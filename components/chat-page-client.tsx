'use client'

import Link from 'next/link'
import { FormEvent, KeyboardEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, MessageSquareQuote, RefreshCcw, Sparkles } from 'lucide-react'

type ChatMessage = {
  role: 'user' | 'assistant'
  text: string
  sources?: string[]
  isStreaming?: boolean
}

type ChatPageClientProps = {
  initialSuggestedQuestions?: string[]
  suggestionPool?: string[]
}

const ROTATION_INTERVAL_MS = 8000
const ROTATION_FADE_MS = 240

function formatInlineMarkdown(text: string) {
  const parts: Array<string | { kind: 'bold' | 'italic'; text: string }> = []
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }

    if (match[1]) {
      parts.push({ kind: 'bold', text: match[1] })
    } else if (match[2]) {
      parts.push({ kind: 'italic', text: match[2] })
    }

    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : [text]
}

function renderInlineMarkdown(text: string, keyPrefix: string) {
  return formatInlineMarkdown(text).map((part, index) => {
    const key = `${keyPrefix}-${index}`

    if (typeof part === 'string') {
      return <span key={key}>{part}</span>
    }

    if (part.kind === 'bold') {
      return (
        <strong key={key} className="font-semibold text-[#1C1C1C]">
          {part.text}
        </strong>
      )
    }

    return (
      <em key={key} className="italic text-[#9B3A2F]">
        {part.text}
      </em>
    )
  })
}

function renderMarkdownBlocks(text: string) {
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let bulletItems: string[] = []

  function flushBullets() {
    if (bulletItems.length === 0) return

    blocks.push(
      <ul key={`list-${blocks.length}`} className="my-3 space-y-2.5">
        {bulletItems.map((item, index) => (
          <li key={`bullet-${index}`} className="flex gap-3 text-[#1C1C1C]/80">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#9B3A2F]" aria-hidden="true" />
            <span>{renderInlineMarkdown(item, `bullet-${blocks.length}-${index}`)}</span>
          </li>
        ))}
      </ul>,
    )

    bulletItems = []
  }

  lines.forEach((rawLine, index) => {
    const line = rawLine.trim()

    if (!line) {
      flushBullets()
      return
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      flushBullets()
      const level = headingMatch[1].length
      const content = headingMatch[2]
      const headingClass =
        level <= 2
          ? 'mt-5 font-serif text-xl font-semibold text-[#1C1C1C]'
          : 'mt-4 font-serif text-lg font-semibold text-[#1C1C1C]'

      blocks.push(
        <h3 key={`heading-${index}`} className={headingClass}>
          {renderInlineMarkdown(content, `heading-${index}`)}
        </h3>,
      )
      return
    }

    const bulletMatch = line.match(/^[-*]\s+(.+)$/)
    if (bulletMatch) {
      bulletItems.push(bulletMatch[1])
      return
    }

    flushBullets()
    blocks.push(
      <p key={`paragraph-${index}`} className="leading-7 text-[#1C1C1C]/80">
        {renderInlineMarkdown(line, `paragraph-${index}`)}
      </p>,
    )
  })

  flushBullets()

  return blocks.length > 0 ? blocks : [<p key="paragraph-fallback">{renderInlineMarkdown(text, 'fallback')}</p>]
}

function setAssistantText(messages: ChatMessage[], text: string, isStreaming: boolean) {
  const nextMessages = [...messages]
  const lastMessage = nextMessages.at(-1)

  if (!lastMessage || lastMessage.role !== 'assistant') {
    nextMessages.push({ role: 'assistant', text, isStreaming })
    return nextMessages
  }

  nextMessages[nextMessages.length - 1] = { ...lastMessage, text, isStreaming }
  return nextMessages
}

function finishAssistantStream(messages: ChatMessage[]) {
  const nextMessages = [...messages]
  const lastMessage = nextMessages.at(-1)
  if (!lastMessage || lastMessage.role !== 'assistant') return nextMessages

  nextMessages[nextMessages.length - 1] = {
    ...lastMessage,
    isStreaming: false,
  }

  return nextMessages
}

function parseSseEvents(buffer: string) {
  const eventBlocks = buffer.split('\n\n')
  const remainder = eventBlocks.pop() ?? ''
  const events = eventBlocks.map((block) => {
    const lines = block.split('\n')
    const event = lines.find((line) => line.startsWith('event:'))?.slice(6).trim() ?? 'message'
    const data = lines
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice(5).trim())
      .join('\n')

    return { event, data }
  })

  return { events, remainder }
}

function getNextSuggestionBatch(pool: string[], currentQuestions: string[]) {
  if (pool.length <= 4) return pool.slice(0, 4)

  const normalizedCurrent = currentQuestions.map((question) => question.trim().toLocaleLowerCase('vi-VN'))
  const firstCurrent = normalizedCurrent[0]
  const currentStartIndex = firstCurrent
    ? pool.findIndex((question) => question.trim().toLocaleLowerCase('vi-VN') === firstCurrent)
    : -1

  const startIndex = currentStartIndex >= 0 ? (currentStartIndex + 4) % pool.length : 0
  const nextQuestions: string[] = []

  for (let offset = 0; offset < pool.length; offset += 1) {
    const question = pool[(startIndex + offset) % pool.length]
    const normalized = question.trim().toLocaleLowerCase('vi-VN')
    if (nextQuestions.some((item) => item.trim().toLocaleLowerCase('vi-VN') === normalized)) continue
    nextQuestions.push(question)
    if (nextQuestions.length >= 4) break
  }

  return nextQuestions
}

export default function ChatPageClient({
  initialSuggestedQuestions = [],
  suggestionPool = [],
}: ChatPageClientProps) {
  const safeInitialSuggestedQuestions = initialSuggestedQuestions
  const safeSuggestionPool = suggestionPool.length > 0 ? suggestionPool : initialSuggestedQuestions
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(safeInitialSuggestedQuestions)
  const [isSuggestionTransitioning, setIsSuggestionTransitioning] = useState(false)
  const [isSuggestionRotationPaused, setIsSuggestionRotationPaused] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, loading])

  // Auto-grow the composer: compact by default, expands with content up to a cap.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [input])

  // Stop any in-flight typewriter animation if the component unmounts.
  useEffect(() => () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current)
  }, [])

  useEffect(() => {
    setSuggestedQuestions(safeInitialSuggestedQuestions)
  }, [safeInitialSuggestedQuestions])

  useEffect(() => {
    if (safeSuggestionPool.length <= 4 || isSuggestionRotationPaused) return

    const rotationTimeoutId = window.setTimeout(() => {
      setIsSuggestionTransitioning(true)

      window.setTimeout(() => {
        setSuggestedQuestions((current) => getNextSuggestionBatch(safeSuggestionPool, current))
        window.requestAnimationFrame(() => {
          setIsSuggestionTransitioning(false)
        })
      }, ROTATION_FADE_MS)
    }, ROTATION_INTERVAL_MS)

    return () => window.clearTimeout(rotationTimeoutId)
  }, [safeSuggestionPool, suggestedQuestions, isSuggestionRotationPaused])

  async function sendMessage(nextText?: string) {
    const text = (nextText ?? input).trim()
    if (!text || loading) return

    const userMessage: ChatMessage = { role: 'user', text }
    const history = [...messages, userMessage].slice(-10).map(({ role, text: content }) => ({
      role,
      text: content,
    }))

    setMessages((current) => [...current, userMessage])
    setInput('')
    setLoading(true)

    // Typewriter buffer: the network fills `targetText`, while a rAF loop
    // reveals it gradually so the answer streams out smoothly and evenly
    // instead of jumping in large bursts as each API chunk arrives.
    let targetText = ''
    let shown = 0
    let streamDone = false

    if (animationRef.current) cancelAnimationFrame(animationRef.current)

    const tick = () => {
      if (shown < targetText.length) {
        const remaining = targetText.length - shown
        // Reveal faster when far behind so we never lag too much, but always
        // at least a couple of characters per frame for a steady flow.
        const step = Math.max(2, Math.ceil(remaining / 16))
        shown = Math.min(targetText.length, shown + step)
        setMessages((current) => setAssistantText(current, targetText.slice(0, shown), true))
      }

      if (streamDone && shown >= targetText.length) {
        setMessages((current) => finishAssistantStream(current))
        animationRef.current = null
        return
      }

      animationRef.current = requestAnimationFrame(tick)
    }

    try {
      setMessages((current) => [...current, { role: 'assistant', text: '', isStreaming: true }])
      animationRef.current = requestAnimationFrame(tick)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null) as { error?: string } | null
        throw new Error(payload?.error ?? `HTTP ${response.status}`)
      }

      if (!response.body) {
        throw new Error('Phản hồi stream không có body.')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let sseBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        sseBuffer += decoder.decode(value, { stream: true })
        const parsed = parseSseEvents(sseBuffer)
        sseBuffer = parsed.remainder

        for (const event of parsed.events) {
          if (!event.data) continue

          const payload = JSON.parse(event.data) as { text?: string; message?: string }

          if (event.event === 'chunk' && payload.text) {
            targetText += payload.text
          }

          if (event.event === 'done') {
            streamDone = true
          }

          if (event.event === 'error') {
            throw new Error(payload.message ?? 'Streaming bị gián đoạn.')
          }
        }
      }

      streamDone = true
    } catch (error) {
      streamDone = true
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      const message = error instanceof Error ? error.message : 'Không gửi được yêu cầu.'
      setMessages((current) => {
        const nextMessages = [...current]
        const lastMessage = nextMessages.at(-1)

        if (lastMessage?.role === 'assistant' && lastMessage.isStreaming) {
          nextMessages[nextMessages.length - 1] = {
            role: 'assistant',
            text: `Lỗi: ${message}`,
            isStreaming: false,
          }
          return nextMessages
        }

        return [...nextMessages, { role: 'assistant', text: `Lỗi: ${message}` }]
      })
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  function resetConversation() {
    setMessages([])
    setInput('')
  }

  return (
    <main className="relative min-h-screen bg-[#F9F6F0] text-[#1C1C1C]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col px-6 py-10 md:px-12 md:py-14">
        <header className="mb-8 flex flex-col gap-6 border-b border-[#1C1C1C]/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9B3A2F]">Trợ lý học tập</p>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#1C1C1C]/50">
                Chương 7 · Vấn đề gia đình
              </p>
            </div>
            <h1 className="font-serif text-4xl leading-[0.95] tracking-tight text-[#1C1C1C] md:text-6xl">
              Đối thoại về <span className="italic text-[#9B3A2F]">Gia đình</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#1C1C1C]/70">
              Đặt câu hỏi về Chương 7 – Vấn đề gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội: khái niệm, vị trí, chức năng và cơ sở xây dựng gia đình. Trợ lý trả lời dựa trên giáo trình Chủ nghĩa xã hội khoa học bản chính thống đã được nạp làm tài liệu nền.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link
              href="/"
              className="inline-flex items-center gap-2 border border-[#1C1C1C]/15 bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#1C1C1C]/70 transition-colors hover:border-[#9B3A2F] hover:text-[#9B3A2F]"
            >
              Quay lại
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={resetConversation}
              className="inline-flex items-center gap-2 border border-[#1C1C1C]/15 bg-transparent px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-[#1C1C1C]/70 transition-colors hover:border-[#9B3A2F] hover:text-[#9B3A2F]"
            >
              Làm mới
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
        </header>

        <section className="grid flex-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="order-2 flex flex-col gap-6 self-start border border-[#1C1C1C]/10 bg-white/60 p-6 xl:order-1 xl:sticky xl:top-6">
            <div className="space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-2xl text-[#9B3A2F]">→</span>
                <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#1C1C1C]/60">
                  Gợi ý nhanh
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-[#1C1C1C]/60">
                Chọn một câu hỏi gợi ý để bắt đầu cuộc trao đổi. Danh sách này sẽ tự đổi theo chu kỳ từ kho câu hỏi đã tạo sẵn.
              </p>
            </div>

            <div
              className={`grid gap-3 transition-all duration-300 ease-out md:grid-cols-2 xl:grid-cols-1 ${
                isSuggestionTransitioning ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
              }`}
              onMouseEnter={() => setIsSuggestionRotationPaused(true)}
              onMouseLeave={() => setIsSuggestionRotationPaused(false)}
            >
              {(suggestedQuestions ?? []).map((question, index) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => void sendMessage(question)}
                  className="group flex w-full items-start gap-3 border border-[#1C1C1C]/10 bg-[#F9F6F0] px-4 py-4 text-left transition-all hover:border-[#9B3A2F] hover:bg-white"
                >
                  <span className="mt-0.5 font-mono text-xs text-[#9B3A2F]">0{index + 1}</span>
                  <span className="text-sm leading-6 text-[#1C1C1C]/80 transition-colors group-hover:text-[#1C1C1C]">
                    {question}
                  </span>
                </button>
              ))}
            </div>

            <div className="border-t border-[#1C1C1C]/10 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#1C1C1C]/40">
                Nguồn tham chiếu
              </p>
              <p className="mt-2 text-sm leading-6 text-[#1C1C1C]/55">
                Câu trả lời được dẫn từ giáo trình{' '}
                <span className="text-[#1C1C1C]/75">Chủ nghĩa xã hội khoa học</span> (Bộ Giáo dục và Đào tạo).
              </p>
            </div>
          </aside>

          <div className="order-1 flex min-h-[62vh] flex-col border border-[#1C1C1C]/10 bg-white sm:min-h-[68vh] xl:order-2">
            <div
              ref={scrollAreaRef}
              className="flex-1 space-y-8 overflow-y-auto p-5 sm:p-6 md:p-8"
            >
              {messages.length === 0 ? (
                <div className="flex h-full min-h-105 flex-col items-center justify-center gap-6 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#1C1C1C]/15 bg-[#F9F6F0] text-[#9B3A2F]">
                    <MessageSquareQuote className="h-7 w-7" />
                  </div>
                  <div className="max-w-xl space-y-3">
                    <h2 className="font-serif text-2xl text-[#1C1C1C] md:text-3xl">Bắt đầu một cuộc hỏi đáp có ngữ cảnh</h2>
                    <p className="text-base leading-relaxed text-[#1C1C1C]/60">
                      Không gian trao đổi này đồng hành cùng bạn tìm hiểu Chương 7 – Vấn đề gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội: khái niệm, vị trí, các chức năng của gia đình và những cơ sở để xây dựng gia đình mới. Câu trả lời được dẫn từ giáo trình chính thống.
                    </p>
                  </div>
                </div>
              ) : null}

              {messages.map((message, index) => {
                const isUser = message.role === 'user'
                const key = `${message.role}-${index}-${message.text.slice(0, 16)}`

                if (isUser) {
                  return (
                    <article key={key} className="flex flex-col items-end gap-1.5">
                      <span className="px-1 font-mono text-[11px] uppercase tracking-[0.28em] text-[#1C1C1C]/40">
                        Bạn
                      </span>
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#1C1C1C] px-5 py-3.5 text-[15px] leading-7 text-[#F9F6F0] sm:max-w-[75%]">
                        {message.text}
                      </div>
                    </article>
                  )
                }

                return (
                  <article key={key} className="flex gap-3 sm:gap-4">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#9B3A2F]/30 bg-[#9B3A2F]/[0.06] text-[#9B3A2F]">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-[#9B3A2F]">
                        Trợ lý
                      </span>
                      <div className="space-y-3 text-[15px] leading-7 text-[#1C1C1C]/85">
                        {message.text.length === 0 && message.isStreaming ? (
                          <span className="inline-flex gap-1" aria-label="Đang soạn câu trả lời">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B3A2F]/70 [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B3A2F]/70 [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9B3A2F]/70" />
                          </span>
                        ) : (
                          <>
                            {renderMarkdownBlocks(message.text)}
                            {message.isStreaming ? (
                              <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-[#9B3A2F] align-middle" />
                            ) : null}
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-[#1C1C1C]/10 bg-white p-4">
              <div className="flex items-end gap-2 border border-[#1C1C1C]/15 bg-[#F9F6F0] pr-2 transition-colors focus-within:border-[#9B3A2F]">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Đặt câu hỏi của bạn về môn Mác – Lênin…"
                  rows={1}
                  disabled={loading}
                  className="max-h-40 min-h-[44px] w-full resize-none bg-transparent px-4 py-3 text-[15px] leading-6 text-[#1C1C1C] outline-none placeholder:text-[#1C1C1C]/40 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="submit"
                  disabled={loading || input.trim().length === 0}
                  aria-label="Gửi câu hỏi"
                  className="group mb-1.5 inline-flex h-9 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap bg-[#9B3A2F] px-4 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-[#F9F6F0] transition-all hover:bg-[#82301f] disabled:cursor-not-allowed disabled:bg-[#1C1C1C]/20 disabled:text-[#1C1C1C]/40"
                >
                  {loading ? 'Đang trả lời' : 'Gửi'}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-enabled:group-hover:translate-x-0.5 group-enabled:group-hover:-translate-y-0.5" />
                </button>
              </div>
              <p className="mt-2 px-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#1C1C1C]/35">
                Enter để gửi · Shift + Enter xuống dòng
              </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
