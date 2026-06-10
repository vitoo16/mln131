import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

// Generate RAG embeddings for the MLN131 chatbot.
// Knowledge base = ONLY the official textbook PDF:
//   GIÁO TRÌNH CHỦ NGHĨA XÃ HỘI KHOA HỌC.pdf
// (MLN131_Nhóm 7.md is the team's presentation script and is NOT ingested.)
//
// The script is resumable: progress is saved to data/embeddings.json every few
// chunks and on error, and already-embedded chunks are skipped on re-run.

const EMBEDDING_MODEL = 'gemini-embedding-2-preview'
const ROOT = process.cwd()
const OUTPUT_DIR = path.resolve(ROOT, 'data')
const OUTPUT_FILE = path.resolve(OUTPUT_DIR, 'embeddings.json')
const ENV_FILES = ['.env.local', '.env']
const SAVE_EVERY = 10

const SOURCE_FILES = [
  'GIÁO TRÌNH CHỦ NGHĨA XÃ HỘI KHOA HỌC.pdf',
]

async function loadEnvFiles() {
  for (const file of ENV_FILES) {
    try {
      const raw = await fs.readFile(path.resolve(ROOT, file), 'utf8')
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#')) continue
        const sep = trimmed.indexOf('=')
        if (sep === -1) continue
        const key = trimmed.slice(0, sep).trim()
        const value = trimmed.slice(sep + 1).trim()
        if (key && process.env[key] === undefined) process.env[key] = value
      }
    } catch {
      // Ignore missing env files; key validation happens below.
    }
  }
}

function getApiKey() {
  const apiKey = process.env.GOOGLE_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  if (!apiKey) throw new Error('GOOGLE_API_KEY is not set (check .env.local)')
  return apiKey
}

function normalizeText(text) {
  return text.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

function chunkText(text, chunkSize = 1400, overlap = 220) {
  const normalized = normalizeText(text)
  const chunks = []
  let start = 0
  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + chunkSize)
    const slice = normalized.slice(start, end).trim()
    if (slice.length > 0) chunks.push(slice)
    if (end >= normalized.length) break
    start = Math.max(end - overlap, start + 1)
  }
  return chunks
}

async function pathExists(target) {
  try {
    await fs.access(target)
    return true
  } catch {
    return false
  }
}

async function extractPdfText(filePath) {
  console.log(`\n📄 Đang trích xuất text từ PDF: ${path.basename(filePath)}`)
  const workerPath = path.resolve(ROOT, 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')
  pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href

  const buffer = await fs.readFile(filePath)
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
  console.log(`📖 PDF có ${pdf.numPages} trang. Bắt đầu đọc...`)

  let fullText = ''
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    process.stdout.write(`\r  Đang xử lý trang ${pageNum}/${pdf.numPages}...   `)
    try {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      fullText += textContent.items.map((item) => item.str).join(' ') + '\n'
    } catch (pageError) {
      console.error(`\n⚠️ Trang ${pageNum}: ${pageError.message}`)
    }
  }

  console.log(`\n✅ Trích xuất xong ${fullText.length} ký tự từ ${pdf.numPages} trang.`)
  return fullText.trim()
}

async function collectSources() {
  const sources = []
  for (const name of SOURCE_FILES) {
    const full = path.resolve(ROOT, name)
    if (!(await pathExists(full))) {
      console.log(`⏭️  Bỏ qua (không tìm thấy): ${name}`)
      continue
    }

    const ext = path.extname(name).toLowerCase()
    const text = ext === '.pdf' ? await extractPdfText(full) : await fs.readFile(full, 'utf8')
    if (text.trim().length > 0) {
      sources.push({ source: name, text })
      console.log(`✅ Đã nạp nguồn: ${name}`)
    }
  }

  if (sources.length === 0) throw new Error('Không tìm thấy nguồn nội dung nào để nhúng.')
  return sources
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function embedOnce(text) {
  const apiKey = getApiKey()
  const response = await fetch(
    `https://api.shopaikey.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
    },
  )
  const payload = await response.json()
  if (!response.ok) throw new Error(JSON.stringify(payload))
  const values = payload?.embedding?.values
  if (!Array.isArray(values)) throw new Error('Embedding response is missing vector values: ' + JSON.stringify(payload))
  return values
}

// Retry on transient upstream errors (e.g. "上游负载已饱和" / rate limits) with
// exponential backoff + jitter, so a busy API doesn't abort the whole run.
const MAX_ATTEMPTS = 12
async function embedText(text) {
  let lastError
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      return await embedOnce(text)
    } catch (error) {
      lastError = error
      if (attempt === MAX_ATTEMPTS) break
      const base = Math.min(30000, 1500 * 2 ** (attempt - 1))
      const wait = Math.round(base + Math.random() * 1000)
      process.stdout.write(`\r   ⚠️  API bận, chờ ${(wait / 1000).toFixed(1)}s rồi thử lại (lần ${attempt}/${MAX_ATTEMPTS})...   `)
      await sleep(wait)
    }
  }
  throw lastError
}

async function main() {
  await loadEnvFiles()
  getApiKey() // fail fast if missing

  const sources = await collectSources()
  const chunks = sources.flatMap((doc) =>
    chunkText(doc.text).map((text, index) => ({
      id: `${doc.source}::${index + 1}`,
      source: doc.source,
      text,
    })),
  )
  if (chunks.length === 0) throw new Error('Không tạo được chunk nào từ các nguồn.')

  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  // Resume from any previously saved embeddings.
  let embeddedItems = []
  try {
    embeddedItems = JSON.parse(await fs.readFile(OUTPUT_FILE, 'utf8'))
    console.log(`\n📂 Đã có ${embeddedItems.length} embeddings. Tiếp tục từ phần còn thiếu...`)
  } catch {
    console.log(`\n📝 Bắt đầu nhúng mới...`)
  }
  const embeddedIds = new Set(embeddedItems.map((item) => item.id))

  console.log(`\n🔢 Tổng số chunk cần nhúng: ${chunks.length}\n`)

  for (const [index, chunk] of chunks.entries()) {
    if (embeddedIds.has(chunk.id)) {
      process.stdout.write(`\r⏭️  Bỏ qua ${index + 1}/${chunks.length}: ${chunk.id}        `)
      continue
    }

    process.stdout.write(`\r⏳ Nhúng ${index + 1}/${chunks.length}: ${chunk.id}        `)
    try {
      const embedding = await embedText(chunk.text)
      embeddedItems.push({ ...chunk, embedding })
      embeddedIds.add(chunk.id)

      if (embeddedItems.length % SAVE_EVERY === 0) {
        await fs.writeFile(OUTPUT_FILE, JSON.stringify(embeddedItems, null, 2), 'utf8')
        process.stdout.write(` 💾 (đã lưu ${embeddedItems.length})`)
      }

      await sleep(250) // nghỉ ngắn giữa các lượt gọi để đỡ bị nghẽn
    } catch (error) {
      await fs.writeFile(OUTPUT_FILE, JSON.stringify(embeddedItems, null, 2), 'utf8')
      console.error(`\n❌ Lỗi khi nhúng chunk ${index + 1}:`, error instanceof Error ? error.message : error)
      console.log(`💾 Đã lưu ${embeddedItems.length} embeddings trước khi dừng. Chạy lại lệnh để tiếp tục.`)
      process.exit(1)
    }
  }

  await fs.writeFile(OUTPUT_FILE, JSON.stringify(embeddedItems, null, 2), 'utf8')
  console.log(`\n\n✅ Hoàn tất! Đã lưu ${embeddedItems.length} embeddings vào ${path.relative(ROOT, OUTPUT_FILE)}`)
}

main().catch((error) => {
  console.error('\n' + (error instanceof Error ? error.message : error))
  process.exit(1)
})
