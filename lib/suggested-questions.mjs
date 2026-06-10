import { createHash } from 'node:crypto'

// Build deterministic, reusable study questions from the course markdown.
// Ported/rebuilt for the MLN131 (Chủ nghĩa xã hội khoa học) family chapter.

const QUESTION_TEMPLATES = [
  (topic) => `${capitalize(topic)} nên được hiểu ngắn gọn như thế nào cho đúng ý?`,
  (topic) => `Điểm cốt lõi nhất của ${lower(topic)} trong nội dung này là gì?`,
  (topic) => `Phân tích ${lower(topic)} theo quan điểm chủ nghĩa Mác - Lênin.`,
  (topic) => `Vì sao ${lower(topic)} lại quan trọng trong thời kỳ quá độ lên chủ nghĩa xã hội?`,
  (topic) => `Cho một ví dụ thực tế liên hệ với ${lower(topic)}.`,
  (topic) => `Nếu phải giải thích ${lower(topic)} cho người mới học thì nên bắt đầu từ đâu?`,
]

function capitalize(text) {
  const trimmed = text.trim()
  if (!trimmed) return trimmed
  return trimmed.charAt(0).toLocaleUpperCase('vi-VN') + trimmed.slice(1)
}

function lower(text) {
  return text.trim().toLocaleLowerCase('vi-VN')
}

export function hashContent(content) {
  return createHash('sha256').update(content ?? '', 'utf8').digest('hex')
}

// Pull section titles out of the markdown so questions track the real content.
function extractTopics(content) {
  if (!content) return []

  const topics = []
  const seen = new Set()

  for (const rawLine of content.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim()
    const headingMatch = line.match(/^#{1,6}\s+(.+)$/)
    if (!headingMatch) continue

    // Strip markdown emphasis, list markers and leading enumerations
    // (e.g. "**1\. Khái niệm gia đình**" -> "Khái niệm gia đình").
    let topic = headingMatch[1]
      .replace(/\*\*/g, '')
      .replace(/`/g, '')
      .replace(/^[a-dA-D0-9]+[\\.)]\s*/, '')
      .replace(/^(CHƯƠNG|Chương|PHẦN|Phần|Bài)\s+\d+\s*[:\-–]?\s*/i, '')
      .trim()

    if (topic.length < 4 || topic.length > 90) continue

    const key = lower(topic)
    if (seen.has(key)) continue
    seen.add(key)
    topics.push(topic)
  }

  return topics
}

export function buildQuestionBank(content) {
  const topics = extractTopics(content)
  const questions = []
  const seen = new Set()

  for (const topic of topics) {
    for (const template of QUESTION_TEMPLATES) {
      const question = template(topic).trim()
      const key = lower(question)
      if (seen.has(key)) continue
      seen.add(key)
      questions.push(question)
    }
  }

  return questions
}

export function buildFallbackQuestions() {
  return [
    'Khái niệm gia đình theo chủ nghĩa Mác - Lênin được hiểu như thế nào?',
    'Gia đình có những chức năng cơ bản nào trong thời kỳ quá độ lên chủ nghĩa xã hội?',
    'Vì sao gia đình được coi là tế bào của xã hội?',
    'Những cơ sở để xây dựng gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội là gì?',
  ]
}

// Deterministic 4-question pick, rotated by a stable token (so SSR/CSR agree).
export function pickSuggestedQuestions(pool, { refreshToken = 'initial-load' } = {}) {
  const unique = []
  const seen = new Set()
  for (const question of pool ?? []) {
    const normalized = (question ?? '').trim()
    if (!normalized) continue
    const key = lower(normalized)
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(normalized)
  }

  if (unique.length <= 4) return unique

  const seed = parseInt(hashContent(refreshToken).slice(0, 8), 16)
  const start = seed % unique.length
  const picked = []
  for (let offset = 0; offset < unique.length && picked.length < 4; offset += 1) {
    picked.push(unique[(start + offset) % unique.length])
  }

  return picked
}

export function buildQuestionBankPayload(content, { sourceFile = 'noidung.md' } = {}) {
  return {
    model: 'question-bank-templated',
    sourceFile,
    sourceHash: hashContent(content),
    questions: buildQuestionBank(content),
  }
}
