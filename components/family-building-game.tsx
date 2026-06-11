'use client'

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  Clock,
  HelpCircle,
  Home,
  Lightbulb,
  Monitor,
  RotateCcw,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { FamilyHouse3D } from '@/components/family-house-3d'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ACADEMIC_TIPS,
  BEST_SCORE_KEY,
  CORRECT_CARDS,
  HOUSE_PARTS,
  INTRO_MESSAGE,
  MAX_HINTS,
  SOCIAL_CLOSING_MESSAGE,
  TOTAL_CORRECT,
  calculateBadges,
  calculateCivility,
  createRoundCards,
  formatTime,
  getCardById,
  getComboMessage,
  getCorrectFeedback,
  getOppositeLabels,
  getPartProgress,
  getRandomEvent,
  getRandomQuiz,
  getResultMessage,
  getWrongFeedback,
  loadLeaderboard,
  saveLeaderboardEntry,
  type EarnedBadge,
  type FamilyEvent,
  type GameCard,
  type HousePart,
  type LeaderboardEntry,
  type SituationQuiz,
} from '@/lib/family-game-data'

gsap.registerPlugin(ScrollTrigger)

type GamePhase = 'intro' | 'playing' | 'finished'

type Feedback = {
  message: string
  description?: string
  type: 'correct' | 'wrong' | 'info' | 'combo' | 'tip' | 'event'
}

function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="family-game__confetti pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 14 }, (_, i) => (
        <span
          key={i}
          className="family-game__confetti-particle"
          style={{
            left: `${8 + i * 6}%`,
            animationDelay: `${i * 35}ms`,
            backgroundColor: i % 3 === 0 ? '#9B3A2F' : i % 3 === 1 ? '#1C1C1C' : '#C4A574',
            width: i % 2 === 0 ? 6 : 4,
            height: i % 2 === 0 ? 6 : 4,
          }}
        />
      ))}
    </div>
  )
}

function ValueMap({ placedCorrect }: { placedCorrect: string[] }) {
  const parts: HousePart[] = ['foundation', 'pillar', 'roof']

  return (
    <div className="mt-5 rounded-sm border border-[#1C1C1C]/10 bg-[#F9F6F0]/90 p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9B3A2F]">
        Bản đồ giá trị gia đình
      </p>
      <div className="space-y-3">
        {parts.map((part) => {
          const config = HOUSE_PARTS[part]
          const progress = getPartProgress(placedCorrect, part)
          return (
            <div key={part}>
              <p className="font-serif text-sm text-[#1C1C1C]">
                {config.subtitle}
                <span className="ml-2 font-mono text-[10px] text-[#1C1C1C]/45">
                  ({progress.placed.length}/{progress.total})
                </span>
              </p>
              <ul className="mt-1 flex flex-wrap gap-1">
                {config.cardIds.map((id) => {
                  const card = CORRECT_CARDS.find((c) => c.id === id)
                  const active = placedCorrect.includes(id)
                  return (
                    <li
                      key={id}
                      className={cn(
                        'rounded-sm border px-2 py-0.5 font-mono text-[10px] transition-all',
                        active
                          ? 'border-[#9B3A2F]/30 bg-[#9B3A2F]/10 text-[#9B3A2F]'
                          : 'border-[#1C1C1C]/10 bg-white/50 text-[#1C1C1C]/35',
                      )}
                    >
                      {card?.label}
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SituationQuizPanel({
  quiz,
  onAnswer,
  answered,
}: {
  quiz: SituationQuiz
  onAnswer: (correct: boolean, explanation: string) => void
  answered: boolean
}) {
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <div className="family-game__quiz mt-6 rounded-sm border-2 border-[#9B3A2F]/20 bg-white/90 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9B3A2F]">{quiz.context}</p>
      <h4 className="mt-2 font-serif text-lg leading-snug text-[#1C1C1C]">{quiz.question}</h4>
      <div className="mt-4 space-y-2">
        {quiz.options.map((opt) => {
          const isPicked = picked === opt.id
          const showResult = answered && isPicked
          return (
            <button
              key={opt.id}
              type="button"
              disabled={answered}
              onClick={() => {
                setPicked(opt.id)
                onAnswer(opt.correct, opt.explanation)
              }}
              className={cn(
                'w-full rounded-sm border px-4 py-3 text-left text-sm transition-all',
                !answered && 'cursor-pointer hover:border-[#9B3A2F]/30 hover:bg-[#9B3A2F]/5',
                !answered && 'border-[#1C1C1C]/12 bg-[#F9F6F0]/50',
                showResult && opt.correct && 'border-[#9B3A2F]/40 bg-[#9B3A2F]/10',
                showResult && !opt.correct && 'border-[#9B3A2F]/30 bg-[#9B3A2F]/8',
                answered && !isPicked && 'opacity-50',
              )}
            >
              {opt.text}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FamilyEventPanel({
  event,
  onAnswer,
  answered,
}: {
  event: FamilyEvent
  onAnswer: (correct: boolean, explanation: string) => void
  answered: boolean
}) {
  const [picked, setPicked] = useState<string | null>(null)
  const options = event.optionIds.map((id) => getCardById(id)).filter((c): c is GameCard => c != null)

  return (
    <div className="family-game__quiz mt-6 rounded-sm border-2 border-[#1C1C1C]/15 bg-white/90 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9B3A2F]">{event.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-[#1C1C1C]/80">{event.description}</p>
      <div className="mt-4 space-y-2">
        {options.map((opt) => {
          const isPicked = picked === opt.id
          const isCorrect = opt.id === event.correctId
          const showResult = answered && isPicked
          return (
            <button
              key={opt.id}
              type="button"
              disabled={answered}
              onClick={() => {
                setPicked(opt.id)
                onAnswer(isCorrect, event.explanation)
              }}
              className={cn(
                'w-full rounded-sm border px-4 py-3 text-left text-sm transition-all',
                !answered && 'cursor-pointer hover:border-[#9B3A2F]/30 hover:bg-[#9B3A2F]/5',
                !answered && 'border-[#1C1C1C]/12 bg-[#F9F6F0]/50',
                showResult && isCorrect && 'border-[#9B3A2F]/40 bg-[#9B3A2F]/10',
                showResult && !isCorrect && 'border-[#9B3A2F]/30 bg-[#9B3A2F]/8',
                answered && !isPicked && 'opacity-50',
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function IntroPanel({
  presentationMode,
  onTogglePresentation,
  onStart,
}: {
  presentationMode: boolean
  onTogglePresentation: () => void
  onStart: () => void
}) {
  return (
    <div className="family-game__intro mx-auto max-w-2xl rounded-sm border border-[#1C1C1C]/10 bg-white/70 p-8 text-center shadow-[0_16px_48px_rgba(28,28,28,0.05)] md:p-10">
      <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full border border-[#9B3A2F]/20 bg-[#9B3A2F]/5">
        <Home className="size-6 text-[#9B3A2F]" aria-hidden="true" />
      </div>
      <p className="font-serif text-lg italic leading-relaxed text-[#1C1C1C]/80">{INTRO_MESSAGE.headline}</p>
      <p className="mt-3 text-sm leading-relaxed text-[#1C1C1C]/70 md:text-base">{INTRO_MESSAGE.body}</p>

      <button
        type="button"
        onClick={onTogglePresentation}
        className={cn(
          'mt-6 inline-flex items-center gap-2 rounded-sm border px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-all',
          presentationMode
            ? 'border-[#9B3A2F]/40 bg-[#9B3A2F]/10 text-[#9B3A2F]'
            : 'border-[#1C1C1C]/12 bg-[#F9F6F0]/60 text-[#1C1C1C]/60',
        )}
      >
        <Monitor className="size-3.5" aria-hidden="true" />
        Chế độ thuyết trình {presentationMode ? '(đang bật)' : ''}
      </button>

      {presentationMode && (
        <p className="mt-3 text-xs leading-relaxed text-[#1C1C1C]/55">
          8 thẻ chính + 2 thẻ sai · Không đếm giờ · Giải thích học thuật rõ ràng
        </p>
      )}

      <ul className="mt-6 space-y-2 text-left text-sm text-[#1C1C1C]/65">
        <li className="flex gap-2">
          <Zap className="mt-0.5 size-4 shrink-0 text-[#9B3A2F]" aria-hidden="true" />
          Nền móng · Cột trụ · Mái nhà — mỗi nhóm giá trị xây một phần ngôi nhà
        </li>
        <li className="flex gap-2">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#9B3A2F]" aria-hidden="true" />
          Sự kiện gia đình và câu hỏi tình huống xen kẽ
        </li>
        <li className="flex gap-2">
          <Users className="mt-0.5 size-4 shrink-0 text-[#9B3A2F]" aria-hidden="true" />
          Bảng xếp hạng nhóm lưu trên thiết bị
        </li>
      </ul>

      <Button
        type="button"
        size="lg"
        onClick={onStart}
        className="mt-8 h-11 min-w-[220px] rounded-sm bg-[#9B3A2F] px-8 text-xs uppercase tracking-[0.2em] text-[#F9F6F0] hover:bg-[#9B3A2F]/90"
      >
        Bắt đầu chơi
      </Button>
    </div>
  )
}

export function FamilyBuildingGame() {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [presentationMode, setPresentationMode] = useState(false)
  const [roundCards, setRoundCards] = useState<GameCard[]>(() => createRoundCards())
  const [placedCorrect, setPlacedCorrect] = useState<string[]>([])
  const [usedCardIds, setUsedCardIds] = useState<string[]>([])
  const [wrongPickedIds, setWrongPickedIds] = useState<string[]>([])
  const [hintedOutIds, setHintedOutIds] = useState<string[]>([])
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [shakingId, setShakingId] = useState<string | null>(null)
  const [arrivingId, setArrivingId] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [houseGlow, setHouseGlow] = useState(false)
  const [finalScore, setFinalScore] = useState<number | null>(null)
  const [civility, setCivility] = useState(0)
  const [earnedBadges, setEarnedBadges] = useState<EarnedBadge[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [tipIndex, setTipIndex] = useState(0)
  const [activeQuiz, setActiveQuiz] = useState<SituationQuiz | null>(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizStats, setQuizStats] = useState({ correct: 0, total: 0 })
  const [usedQuizIds, setUsedQuizIds] = useState<string[]>([])
  const [activeEvent, setActiveEvent] = useState<FamilyEvent | null>(null)
  const [eventAnswered, setEventAnswered] = useState(false)
  const [usedEventIds, setUsedEventIds] = useState<string[]>([])
  const [teamName, setTeamName] = useState('')
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  const score = placedCorrect.length - wrongAttempts
  const progress = placedCorrect.length
  const hasSelection = usedCardIds.length > 0
  const hintsLeft = MAX_HINTS - hintsUsed
  const isComplete = progress === TOTAL_CORRECT
  const isBlocked = Boolean(activeQuiz || activeEvent)

  useEffect(() => {
    const saved = localStorage.getItem(BEST_SCORE_KEY)
    if (saved) setBestScore(Number(saved))
    setLeaderboard(loadLeaderboard())
  }, [])

  useEffect(() => {
    if (phase !== 'playing' || presentationMode) return
    const timer = window.setInterval(() => setElapsed((s) => s + 1), 1000)
    return () => window.clearInterval(timer)
  }, [phase, presentationMode])

 // ── GSAP scroll entrance ──
useGSAP(() => {
  const section = sectionRef.current
  if (!section) return

  const header = section.querySelector('.family-game__header')
  const introPanel = section.querySelector('.family-game__intro')
  const deck = section.querySelector('.family-game__deck')
  const housePanel = section.querySelector('.family-game__house-panel')
  const cards = section.querySelectorAll<HTMLElement>('.family-game__card')

  const ctx = gsap.context(() => {
    if (header) {
      gsap.set(header, { opacity: 0, y: 24 })
      gsap.to(header, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: header, start: 'top 88%', end: 'top 50%', scrub: 1 },
      })
    }
    if (introPanel) {
      gsap.set(introPanel, { opacity: 0, y: 30, scale: 0.97 })
      gsap.to(introPanel, {
        opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: introPanel, start: 'top 88%', end: 'top 55%', scrub: 1 },
      })
    }
    if (deck) {
      gsap.set(deck, { opacity: 0, y: 24 })
      gsap.to(deck, {
        opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: deck, start: 'top 85%', end: 'top 50%', scrub: 1 },
      })
    }
    if (housePanel) {
      gsap.set(housePanel, { opacity: 0, x: 30 })
      gsap.to(housePanel, {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: housePanel, start: 'top 85%', end: 'top 50%', scrub: 1 },
      })
    }
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 18 })
      gsap.to(cards, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        stagger: 0.06, delay: 0.2,
        scrollTrigger: { trigger: deck ?? section, start: 'top 82%', end: 'top 45%', scrub: 1 },
      })
    }
  }, section)

  return () => ctx.revert()
}, { scope: sectionRef })

// ── Animate card arrival when a correct card is placed ──
useLayoutEffect(() => {
  if (!arrivingId) return
  const section = sectionRef.current
  if (!section) return
  const el = section.querySelector('[aria-pressed="true"][aria-label*="' + arrivingId + '"]') as HTMLElement | null
  const ctx = gsap.context(() => {
    if (el) {
      gsap.fromTo(el,
        { scale: 0.92, y: 8 },
        { scale: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }
      )
    }
  }, section)
  return () => ctx.revert()
}, [arrivingId])

// ── Animate feedback panel ──
useLayoutEffect(() => {
  if (!feedback) return
  const section = sectionRef.current
  if (!section) return
  const el = section.querySelector('.family-game__feedback') as HTMLElement | null
  if (!el) return
  const ctx = gsap.context(() => {
    gsap.fromTo(el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    )
  }, section)
  return () => ctx.revert()
}, [feedback?.message])

// ── Animate quiz/event panel entrance ──
useLayoutEffect(() => {
  if (!activeQuiz && !activeEvent) return
  const section = sectionRef.current
  if (!section) return
  const el = section.querySelector('.family-game__quiz') as HTMLElement | null
  if (!el) return
  const ctx = gsap.context(() => {
    gsap.fromTo(el,
      { opacity: 0, y: 16, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.3)' }
    )
  }, section)
  return () => ctx.revert()
}, [activeQuiz?.id, activeEvent?.id])

// ── Animate result dialog ──
useLayoutEffect(() => {
  if (phase !== 'finished') return
  const section = sectionRef.current
  if (!section) return
  const el = section.querySelector('.family-game__result') as HTMLElement | null
  if (!el) return
  const ctx = gsap.context(() => {
    gsap.fromTo(el,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.2)' }
    )
  }, section)
  return () => ctx.revert()
}, [phase])
 const civilityLive = useMemo(
    () => calculateCivility(placedCorrect, wrongPickedIds),
    [placedCorrect, wrongPickedIds],
  )

  const availableCards = useMemo(
    () => roundCards.filter((card) => !usedCardIds.includes(card.id) && !hintedOutIds.includes(card.id)),
    [roundCards, usedCardIds, hintedOutIds],
  )

  const placedCards = useMemo(
    () =>
      placedCorrect
        .map((id) => CORRECT_CARDS.find((card) => card.id === id))
        .filter((card): card is GameCard => card != null),
    [placedCorrect],
  )

  const missedCards = useMemo(
    () => CORRECT_CARDS.filter((card) => !placedCorrect.includes(card.id)),
    [placedCorrect],
  )

  const triggerConfetti = useCallback((big = false) => {
    setShowConfetti(true)
    setHouseGlow(true)
    window.setTimeout(() => setShowConfetti(false), big ? 1200 : 700)
    window.setTimeout(() => setHouseGlow(false), big ? 1400 : 900)
  }, [])

  const maybeShowQuiz = useCallback(
    (newProgress: number) => {
      if (presentationMode) return
      if (newProgress > 0 && newProgress % 2 === 0 && newProgress < TOTAL_CORRECT) {
        const quiz = getRandomQuiz(usedQuizIds)
        setActiveQuiz(quiz)
        setQuizAnswered(false)
        setUsedQuizIds((prev) => [...prev, quiz.id])
      }
    },
    [usedQuizIds, presentationMode],
  )

  const maybeShowEvent = useCallback(
    (selectionCount: number) => {
      if (selectionCount > 0 && selectionCount % 3 === 0) {
        const event = getRandomEvent(usedEventIds)
        setActiveEvent(event)
        setEventAnswered(false)
        setUsedEventIds((prev) => [...prev, event.id])
      }
    },
    [usedEventIds],
  )

  const handleStart = useCallback(() => {
    setPhase('playing')
    setRoundCards(createRoundCards(presentationMode))
    setElapsed(0)
    setFeedback(null)
    setQuizStats({ correct: 0, total: 0 })
    setUsedQuizIds([])
    setUsedEventIds([])
  }, [presentationMode])

  const handleHint = useCallback(() => {
    if (phase !== 'playing' || presentationMode || hintsLeft <= 0 || isComplete || isBlocked) return
    const wrongAvailable = roundCards.filter(
      (card) => !card.isCorrect && !usedCardIds.includes(card.id) && !hintedOutIds.includes(card.id),
    )
    if (!wrongAvailable.length) return
    const pick = wrongAvailable[Math.floor(Math.random() * wrongAvailable.length)]
    setHintedOutIds((prev) => [...prev, pick.id])
    setHintsUsed((prev) => prev + 1)
    setFeedback({ type: 'tip', message: `Gợi ý: Loại bỏ "${pick.label}"`, description: pick.description })
  }, [phase, presentationMode, hintsLeft, isComplete, isBlocked, roundCards, usedCardIds, hintedOutIds])

  const handleCardClick = useCallback(
    (card: GameCard) => {
      if (phase !== 'playing' || isBlocked || usedCardIds.includes(card.id) || hintedOutIds.includes(card.id)) return

      const nextUsedCount = usedCardIds.length + 1
      setUsedCardIds((prev) => [...prev, card.id])

      if (card.isCorrect) {
        const nextStreak = streak + 1
        const nextProgress = placedCorrect.length + 1
        setStreak(nextStreak)
        setBestStreak((prev) => Math.max(prev, nextStreak))
        setPlacedCorrect((prev) => [...prev, card.id])
        setArrivingId(card.id)
        window.setTimeout(() => setArrivingId(null), 600)

        const combo = getComboMessage(nextStreak)
        const partNote = card.housePart ? HOUSE_PARTS[card.housePart].academicNote : card.description
        if (combo) {
          setFeedback({ type: 'combo', message: combo, description: presentationMode ? partNote : card.description })
          triggerConfetti(nextStreak >= 3)
        } else {
          setFeedback({
            type: 'correct',
            message: getCorrectFeedback(card, presentationMode),
            description: presentationMode ? partNote : card.description,
          })
          triggerConfetti()
        }

        setTipIndex((prev) => (prev + 1) % ACADEMIC_TIPS.length)
        maybeShowQuiz(nextProgress)
        maybeShowEvent(nextUsedCount)

        if (nextProgress === TOTAL_CORRECT) {
          window.setTimeout(() => triggerConfetti(true), 400)
        }
        return
      }

      setStreak(0)
      setWrongAttempts((prev) => prev + 1)
      setWrongPickedIds((prev) => [...prev, card.id])
      setShakingId(card.id)
      const opposites = getOppositeLabels(card)
      setFeedback({
        type: 'wrong',
        message: getWrongFeedback(card),
        description: [
          `Vì sao chưa phù hợp? ${card.description}`,
          opposites.length ? `Giá trị nên chọn: ${opposites.join(', ')}` : undefined,
        ]
          .filter(Boolean)
          .join(' '),
      })
      window.setTimeout(() => setShakingId(null), 450)
      maybeShowEvent(nextUsedCount)
    },
    [
      phase,
      isBlocked,
      usedCardIds,
      hintedOutIds,
      streak,
      placedCorrect.length,
      presentationMode,
      triggerConfetti,
      maybeShowQuiz,
      maybeShowEvent,
    ],
  )

  const handleQuizAnswer = useCallback(
    (correct: boolean, explanation: string) => {
      setQuizAnswered(true)
      setQuizStats((prev) => ({ correct: prev.correct + (correct ? 1 : 0), total: prev.total + 1 }))
      setFeedback({
        type: correct ? 'correct' : 'tip',
        message: correct ? 'Chính xác!' : 'Chưa đúng — hãy xem lại kiến thức.',
        description: explanation,
      })
      if (correct) triggerConfetti()
    },
    [triggerConfetti],
  )

  const handleEventAnswer = useCallback(
    (correct: boolean, explanation: string) => {
      setEventAnswered(true)
      setFeedback({
        type: 'event',
        message: correct ? 'Ứng xử phù hợp!' : 'Chưa phù hợp trong tình huống này.',
        description: explanation,
      })
      if (correct) triggerConfetti()
    },
    [triggerConfetti],
  )

  const dismissOverlay = useCallback(() => {
    setActiveQuiz(null)
    setQuizAnswered(false)
    setActiveEvent(null)
    setEventAnswered(false)
  }, [])

  const handleCheck = useCallback(() => {
    const resultScore = placedCorrect.length - wrongAttempts
    const resultCivility = calculateCivility(placedCorrect, wrongPickedIds)
    const badges = calculateBadges({
      placedCount: placedCorrect.length,
      wrongAttempts,
      elapsed,
      hintsUsed,
      quizCorrect: quizStats.correct,
      quizTotal: quizStats.total,
      civility: resultCivility,
      presentationMode,
    })

    setFinalScore(resultScore)
    setCivility(resultCivility)
    setEarnedBadges(badges)
    setPhase('finished')
    setActiveQuiz(null)
    setActiveEvent(null)

    if (bestScore == null || resultScore > bestScore) {
      localStorage.setItem(BEST_SCORE_KEY, String(resultScore))
      setBestScore(resultScore)
    }
    setFeedback({ type: 'info', message: getResultMessage(resultScore) })
  }, [
    placedCorrect,
    wrongAttempts,
    wrongPickedIds,
    elapsed,
    hintsUsed,
    quizStats,
    presentationMode,
    bestScore,
  ])

  const handleSaveTeam = useCallback(() => {
    if (!teamName.trim() || finalScore == null) return
    const entry: LeaderboardEntry = {
      teamName: teamName.trim(),
      score: finalScore,
      civility,
      elapsed: presentationMode ? 0 : elapsed,
      badges: earnedBadges.map((b) => b.label),
      date: new Date().toLocaleDateString('vi-VN'),
    }
    setLeaderboard(saveLeaderboardEntry(entry))
    setTeamName('')
  }, [teamName, finalScore, civility, elapsed, earnedBadges, presentationMode])

  const handleReplay = useCallback(() => {
    setRoundCards(createRoundCards(presentationMode))
    setPlacedCorrect([])
    setUsedCardIds([])
    setWrongPickedIds([])
    setHintedOutIds([])
    setWrongAttempts(0)
    setHintsUsed(0)
    setStreak(0)
    setBestStreak(0)
    setFeedback(null)
    setShakingId(null)
    setArrivingId(null)
    setShowConfetti(false)
    setHouseGlow(false)
    setFinalScore(null)
    setCivility(0)
    setEarnedBadges([])
    setElapsed(0)
    setActiveQuiz(null)
    setQuizAnswered(false)
    setQuizStats({ correct: 0, total: 0 })
    setUsedQuizIds([])
    setActiveEvent(null)
    setEventAnswered(false)
    setUsedEventIds([])
    setPhase('intro')
  }, [presentationMode])

  return (
    <section
      id="mini-game"
      className="relative w-full border-t border-[#1C1C1C]/10 bg-[#F9F6F0] px-6 py-28 text-[#1C1C1C] md:px-12 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(155,58,47,0.05) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[#9B3A2F]/40" />
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9B3A2F]">Ôn tập tương tác</p>
            <span className="h-px w-10 bg-[#9B3A2F]/40" />
          </div>
          <h2 className="family-game__header text-balance-auto max-w-3xl font-serif text-4xl leading-tight tracking-tight md:text-5xl">
            Mini Game: Xây dựng gia đình hạnh phúc
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#1C1C1C]/75">
            Chọn giá trị đúng để xây nền móng, cột trụ và mái nhà — ôn tập kiến thức chương 7.
          </p>
        </div>

        {phase === 'intro' && (
          <IntroPanel
            presentationMode={presentationMode}
            onTogglePresentation={() => setPresentationMode((v) => !v)}
            onStart={handleStart}
          />
        )}

        {phase !== 'intro' && (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-3 md:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                {presentationMode ? (
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#9B3A2F]/25 bg-[#9B3A2F]/8 px-3 py-1.5 font-mono text-xs text-[#9B3A2F]">
                    <Monitor className="size-3.5" aria-hidden="true" />
                    Thuyết trình
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#1C1C1C]/10 bg-white/60 px-3 py-1.5 font-mono text-xs text-[#1C1C1C]/70">
                    <Clock className="size-3.5 text-[#9B3A2F]" aria-hidden="true" />
                    {formatTime(elapsed)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#1C1C1C]/10 bg-white/60 px-3 py-1.5 font-mono text-xs text-[#1C1C1C]/70">
                  Văn minh: <span className="text-[#9B3A2F]">{civilityLive}%</span>
                </span>
                {streak >= 2 && (
                  <span className="family-game__streak inline-flex items-center gap-1.5 rounded-sm border border-[#9B3A2F]/25 bg-[#9B3A2F]/8 px-3 py-1.5 font-mono text-xs text-[#9B3A2F]">
                    <Zap className="size-3.5" aria-hidden="true" />
                    Chuỗi {streak}
                  </span>
                )}
                {bestScore != null && (
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#1C1C1C]/10 bg-white/60 px-3 py-1.5 font-mono text-xs text-[#1C1C1C]/60">
                    <Trophy className="size-3.5 text-[#9B3A2F]" aria-hidden="true" />
                    Kỷ lục: {bestScore}
                  </span>
                )}
              </div>
              {phase === 'playing' && !presentationMode && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={hintsLeft <= 0 || isBlocked}
                  onClick={handleHint}
                  className="rounded-sm border-[#1C1C1C]/15 bg-white/60 text-xs uppercase tracking-[0.15em]"
                >
                  <HelpCircle className="size-3.5" aria-hidden="true" />
                  Gợi ý ({hintsLeft})
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-12">
              <div className="order-2 lg:order-1">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#1C1C1C]/55">Chọn giá trị</p>
                  <p className="font-mono text-xs text-[#1C1C1C]/45">{availableCards.length} thẻ</p>
                </div>

                <div className="family-game__deck grid grid-cols-1 gap-3 sm:grid-cols-2" role="group" aria-label="Danh sách thẻ giá trị">
                  {roundCards.map((card) => {
                    const Icon = card.icon
                    const isUsed = usedCardIds.includes(card.id)
                    const isHintedOut = hintedOutIds.includes(card.id)
                    const isPlaced = placedCorrect.includes(card.id)
                    const isShaking = shakingId === card.id
                    const isArriving = arrivingId === card.id

                    return (
                      <button
                        key={card.id}
                        type="button"
                        disabled={phase === 'finished' || isUsed || isHintedOut || isBlocked}
                        onClick={() => handleCardClick(card)}
                        aria-label={`Chọn giá trị ${card.label}`}
                        aria-pressed={isPlaced}
                        className={cn(
                          'family-game__card group relative rounded-sm border px-4 py-4 text-left transition-all duration-300',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9B3A2F]/40',
                          isPlaced && 'family-game__card--placed border-[#9B3A2F]/35 bg-[#9B3A2F]/8',
                          isArriving && 'family-game__card--fly-away',
                          !isUsed && !isHintedOut && phase === 'playing' && !isBlocked &&
                            'cursor-pointer border-[#1C1C1C]/12 bg-white/80 hover:-translate-y-1 hover:border-[#9B3A2F]/25 hover:shadow-[0_10px_28px_rgba(28,28,28,0.08)]',
                          isUsed && !isPlaced && 'family-game__card--wrong opacity-60',
                          isHintedOut && 'family-game__card--hinted line-through opacity-40',
                          (isUsed || isHintedOut || isBlocked) && 'cursor-default',
                          isShaking && 'family-game__card--shake',
                          phase === 'finished' && 'opacity-70',
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-sm border',
                              isPlaced
                                ? 'border-[#9B3A2F]/30 bg-[#9B3A2F]/10'
                                : 'border-[#1C1C1C]/10 bg-[#F9F6F0]/80',
                            )}
                          >
                            <Icon className={cn('size-4', isPlaced ? 'text-[#9B3A2F]' : 'text-[#1C1C1C]/40')} aria-hidden="true" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className={cn('font-serif text-base leading-snug', isPlaced && 'text-[#9B3A2F]')}>
                                {card.label}
                              </span>
                              {isPlaced && <Sparkles className="size-3 shrink-0 text-[#9B3A2F]/70" aria-hidden="true" />}
                            </div>
                            <p className="mt-1.5 text-xs leading-relaxed text-[#1C1C1C]/55">{card.example}</p>
                            <span className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.15em] text-[#1C1C1C]/35">
                              {card.isCorrect && card.housePart
                                ? HOUSE_PARTS[card.housePart].label
                                : card.category}
                            </span>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {activeEvent && (
                  <div>
                    <FamilyEventPanel event={activeEvent} onAnswer={handleEventAnswer} answered={eventAnswered} />
                    {eventAnswered && (
                      <div className="mt-3 text-center">
                        <Button type="button" variant="outline" size="sm" onClick={dismissOverlay} className="rounded-sm text-xs uppercase tracking-[0.15em]">
                          Tiếp tục
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {activeQuiz && !activeEvent && (
                  <div>
                    <SituationQuizPanel quiz={activeQuiz} onAnswer={handleQuizAnswer} answered={quizAnswered} />
                    {quizAnswered && (
                      <div className="mt-3 text-center">
                        <Button type="button" variant="outline" size="sm" onClick={dismissOverlay} className="rounded-sm text-xs uppercase tracking-[0.15em]">
                          Tiếp tục
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {feedback && !isBlocked && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={cn(
                      'family-game__feedback mt-6 rounded-sm border px-4 py-4',
                      feedback.type === 'correct' && 'border-[#9B3A2F]/20 bg-[#9B3A2F]/5',
                      feedback.type === 'combo' && 'family-game__feedback--combo border-[#9B3A2F]/30 bg-[#9B3A2F]/10',
                      feedback.type === 'wrong' && 'border-[#9B3A2F]/25 bg-[#9B3A2F]/8',
                      feedback.type === 'tip' && 'border-[#1C1C1C]/12 bg-white/80',
                      feedback.type === 'info' && 'border-[#1C1C1C]/12 bg-white/80',
                      feedback.type === 'event' && 'border-[#1C1C1C]/12 bg-white/80',
                    )}
                  >
                    {feedback.type === 'combo' && (
                      <p className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9B3A2F]">
                        <Zap className="size-3" aria-hidden="true" /> Combo
                      </p>
                    )}
                    <p className="text-sm leading-relaxed md:text-base">{feedback.message}</p>
                    {feedback.description && (
                      <p className="mt-2 text-sm leading-relaxed text-[#1C1C1C]/70">{feedback.description}</p>
                    )}
                  </div>
                )}

                {phase === 'playing' && placedCorrect.length > 0 && !isBlocked && (
                  <div className="mt-4 rounded-sm border border-dashed border-[#9B3A2F]/20 bg-[#9B3A2F]/5 px-4 py-3">
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#9B3A2F]">
                      <Lightbulb className="size-3" aria-hidden="true" />
                      Kiến thức từ bài giảng
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#1C1C1C]/75">{ACADEMIC_TIPS[tipIndex]}</p>
                  </div>
                )}
              </div>

              <div className="order-1 lg:order-2">
                <div className="family-game__house-panel sticky top-24 rounded-sm border border-[#1C1C1C]/10 bg-white/50 p-5 backdrop-blur-sm md:p-6">
                  <ConfettiBurst active={showConfetti} />
                  <FamilyHouse3D
                    placedCorrect={placedCorrect}
                    glow={houseGlow}
                    complete={isComplete}
                    arrivingId={arrivingId}
                  />

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.15em] text-[#1C1C1C]/55">
                      <span>Tiến trình</span>
                      <span className="text-[#9B3A2F]">{progress}/{TOTAL_CORRECT}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#1C1C1C]/8">
                      <div
                        className="family-game__progress h-full rounded-full bg-[#9B3A2F] transition-all duration-500"
                        style={{ width: `${(progress / TOTAL_CORRECT) * 100}%` }}
                      />
                    </div>
                    <p className="font-mono text-xs text-[#1C1C1C]/50">
                      Điểm: <span className="text-[#9B3A2F]">{phase === 'finished' ? finalScore : score}</span> / {TOTAL_CORRECT}
                    </p>
                  </div>

                  <ValueMap placedCorrect={placedCorrect} />
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              {phase === 'playing' ? (
                <Button
                  type="button"
                  size="lg"
                  disabled={!hasSelection || isBlocked}
                  onClick={handleCheck}
                  className="h-10 min-w-[200px] rounded-sm bg-[#1C1C1C] px-6 text-xs uppercase tracking-[0.2em] text-[#F9F6F0]"
                >
                  Kiểm tra kết quả
                </Button>
              ) : (
                <Button type="button" size="lg" variant="outline" onClick={handleReplay} className="h-10 min-w-[200px] rounded-sm text-xs uppercase tracking-[0.2em]">
                  <RotateCcw className="size-4" aria-hidden="true" />
                  Chơi lại
                </Button>
              )}
            </div>

            {phase === 'finished' && finalScore != null && (
              <div className="mx-auto mt-10 max-w-2xl space-y-6">
                <div className="family-game__result rounded-sm border border-[#9B3A2F]/20 bg-white/80 p-8 shadow-[0_16px_48px_rgba(28,28,28,0.06)]" role="dialog">
                  <div className="text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9B3A2F]">Kết quả</p>
                    <h3 className="mt-4 font-serif text-3xl text-[#1C1C1C]">{finalScore}/{TOTAL_CORRECT} điểm</h3>
                    <p className="mt-2 font-mono text-xs text-[#1C1C1C]/50">
                      Văn minh gia đình: {civility}% · Đúng {placedCorrect.length} · Sai {wrongAttempts}
                      {!presentationMode && ` · ${formatTime(elapsed)}`}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-[#1C1C1C]/80">{getResultMessage(finalScore)}</p>
                  </div>

                  {earnedBadges.length > 0 && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {earnedBadges.map((b) => (
                        <span
                          key={b.id}
                          title={b.description}
                          className="inline-flex items-center gap-1 rounded-full border border-[#9B3A2F]/20 bg-[#9B3A2F]/8 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-[#9B3A2F]"
                        >
                          <Star className="size-3" aria-hidden="true" />
                          {b.label}
                        </span>
                      ))}
                    </div>
                  )}

                  {missedCards.length > 0 && (
                    <div className="mt-6 rounded-sm border border-[#1C1C1C]/10 bg-[#F9F6F0]/60 p-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#1C1C1C]/50">
                        Giá trị còn thiếu ({missedCards.length})
                      </p>
                      <ul className="mt-3 space-y-3">
                        {missedCards.map((card) => (
                          <li key={card.id} className="text-sm text-[#1C1C1C]/75">
                            <strong className="font-serif text-[#9B3A2F]">Thiếu {card.label}</strong>
                            <p className="mt-1 text-xs leading-relaxed text-[#1C1C1C]/65">{card.missingConsequence}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <blockquote className="mt-6 border-l-2 border-[#9B3A2F] pl-4 font-serif text-base italic leading-relaxed text-[#1C1C1C]/80">
                    {SOCIAL_CLOSING_MESSAGE}
                  </blockquote>
                </div>

                <div className="rounded-sm border border-[#1C1C1C]/10 bg-white/70 p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9B3A2F]">Bảng xếp hạng nhóm</p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Nhập tên nhóm (vd: Nhóm 1)"
                      className="flex-1 rounded-sm border border-[#1C1C1C]/15 bg-[#F9F6F0]/80 px-3 py-2 text-sm outline-none focus:border-[#9B3A2F]/40"
                      maxLength={40}
                    />
                    <Button type="button" onClick={handleSaveTeam} disabled={!teamName.trim()} className="rounded-sm bg-[#9B3A2F] text-xs uppercase tracking-[0.15em] text-white hover:bg-[#9B3A2F]/90">
                      Lưu điểm
                    </Button>
                  </div>
                  {leaderboard.length > 0 && (
                    <ol className="mt-4 space-y-2">
                      {leaderboard.map((entry, i) => (
                        <li
                          key={`${entry.teamName}-${entry.date}-${i}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-[#1C1C1C]/8 bg-[#F9F6F0]/50 px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-[#1C1C1C]">
                            {i + 1}. {entry.teamName}
                          </span>
                          <span className="font-mono text-xs text-[#1C1C1C]/55">
                            {entry.score}/{TOTAL_CORRECT} · {entry.civility}% · {entry.date}
                          </span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
