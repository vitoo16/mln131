import type { LucideIcon } from 'lucide-react'
import {
  Ban,
  BookOpen,
  Heart,
  HeartHandshake,
  Home,
  Scale,
  Share2,
  ShieldAlert,
  ShieldX,
  UserX,
  Users,
  UserCheck,
} from 'lucide-react'

export type HousePart = 'foundation' | 'pillar' | 'roof'

export type GameCard = {
  id: string
  label: string
  description: string
  example: string
  isCorrect: boolean
  icon: LucideIcon
  category: 'nền tảng' | 'hôn nhân' | 'đạo đức' | 'tiêu cực'
  housePart?: HousePart
  missingConsequence?: string
  oppositeIds?: string[]
  civilityPenalty?: number
}

export type SituationQuiz = {
  id: string
  question: string
  context: string
  options: { id: string; text: string; correct: boolean; explanation: string }[]
}

export type FamilyEvent = {
  id: string
  title: string
  description: string
  optionIds: string[]
  correctId: string
  explanation: string
}

export type LeaderboardEntry = {
  teamName: string
  score: number
  civility: number
  elapsed: number
  badges: string[]
  date: string
}

export type BadgeDef = {
  id: string
  label: string
  description: string
}

export const HOUSE_PARTS = {
  foundation: {
    label: 'Nền móng',
    subtitle: 'Nền tảng quan hệ',
    cardIds: ['love', 'equality', 'respect', 'responsibility'],
    civilityPerCard: 15,
    academicNote:
      'Nền móng gồm yêu thương, bình đẳng, tôn trọng và chia sẻ trách nhiệm — giúp gia đình gắn kết và ổn định.',
  },
  pillar: {
    label: 'Cột trụ',
    subtitle: 'Giáo dục – đạo đức',
    cardIds: ['filial', 'education'],
    civilityPerCard: 12,
    academicNote:
      'Cột trụ là hiếu thảo và giáo dục con cái — gia đình là môi trường giáo dục đầu tiên của con người.',
  },
  roof: {
    label: 'Mái nhà',
    subtitle: 'Hôn nhân tiến bộ',
    cardIds: ['voluntary', 'monogamy'],
    civilityPerCard: 13,
    academicNote:
      'Mái nhà là hôn nhân tự nguyện và một vợ một chồng — nền tảng cho hôn nhân ổn định, văn minh.',
  },
} as const

export const INTRO_MESSAGE = {
  headline: 'Một ngôi nhà chưa thể trở thành tổ ấm nếu thiếu những giá trị đúng đắn.',
  body: 'Hãy lựa chọn các yếu tố phù hợp để xây dựng một gia đình no ấm, bình đẳng, tiến bộ và hạnh phúc.',
} as const

export const SOCIAL_CLOSING_MESSAGE =
  'Gia đình không chỉ là nơi gắn bó tình cảm giữa các thành viên, mà còn là tế bào của xã hội. Xây dựng gia đình no ấm, bình đẳng, tiến bộ và hạnh phúc chính là góp phần xây dựng xã hội ổn định, văn minh và phát triển bền vững.'

export const CORRECT_CARDS: GameCard[] = [
  {
    id: 'love',
    label: 'Yêu thương',
    description: 'Là nền tảng gắn kết các thành viên trong gia đình.',
    example: 'Quan tâm, lắng nghe và chia sẻ giữa các thành viên.',
    isCorrect: true,
    icon: Heart,
    category: 'nền tảng',
    housePart: 'foundation',
    missingConsequence:
      'Thiếu yêu thương, các thành viên dễ cảm thấy cô đơn và xa cách trong chính ngôi nhà của mình.',
  },
  {
    id: 'equality',
    label: 'Bình đẳng',
    description: 'Giúp vợ chồng và các thành viên tôn trọng quyền lợi của nhau.',
    example: 'Vợ chồng cùng tham gia quyết định việc gia đình.',
    isCorrect: true,
    icon: Scale,
    category: 'nền tảng',
    housePart: 'foundation',
    missingConsequence:
      'Thiếu bình đẳng, gia đình dễ xuất hiện sự áp đặt, bất công và thiếu tôn trọng giữa các thành viên.',
  },
  {
    id: 'respect',
    label: 'Tôn trọng',
    description: 'Tạo nên sự dân chủ và hòa thuận trong gia đình.',
    example: 'Lắng nghe ý kiến của từng thành viên.',
    isCorrect: true,
    icon: UserCheck,
    category: 'nền tảng',
    housePart: 'foundation',
    missingConsequence:
      'Thiếu tôn trọng, mâu thuẫn gia đình khó được giải quyết bằng thoả thuận và dân chủ.',
  },
  {
    id: 'responsibility',
    label: 'Chia sẻ trách nhiệm',
    description: 'Giúp gia đình ổn định và phát triển bền vững.',
    example: 'Mọi thành viên cùng đóng góp việc nhà và chăm sóc gia đình.',
    isCorrect: true,
    icon: Share2,
    category: 'nền tảng',
    housePart: 'foundation',
    missingConsequence:
      'Thiếu chia sẻ trách nhiệm, gánh nặng gia đình dễ dồn lên một người, làm giảm sự gắn kết.',
  },
  {
    id: 'filial',
    label: 'Hiếu thảo',
    description: 'Thể hiện truyền thống tốt đẹp của gia đình Việt Nam.',
    example: 'Chăm sóc ông bà, cha mẹ và giữ gìn nếp nhà.',
    isCorrect: true,
    icon: Users,
    category: 'đạo đức',
    housePart: 'pillar',
    missingConsequence:
      'Thiếu hiếu thảo, các thế hệ trong gia đình dễ mất liên kết và giá trị văn hóa truyền thống.',
  },
  {
    id: 'education',
    label: 'Giáo dục con cái',
    description: 'Gia đình là môi trường giáo dục đầu tiên của con người.',
    example: 'Dạy con đạo đức, kỹ năng sống và ý thức trách nhiệm.',
    isCorrect: true,
    icon: BookOpen,
    category: 'đạo đức',
    housePart: 'pillar',
    missingConsequence:
      'Thiếu giáo dục con cái, trẻ em có thể thiếu định hướng về đạo đức, lối sống và trách nhiệm xã hội.',
  },
  {
    id: 'voluntary',
    label: 'Hôn nhân tự nguyện',
    description: 'Là nguyên tắc quan trọng của hôn nhân tiến bộ.',
    example: 'Kết hôn dựa trên tình yêu và sự tự nguyện.',
    isCorrect: true,
    icon: HeartHandshake,
    category: 'hôn nhân',
    housePart: 'roof',
    missingConsequence:
      'Thiếu nguyên tắc tự nguyện, hôn nhân dễ dẫn đến bất hạnh và mâu thuẫn kéo dài.',
  },
  {
    id: 'monogamy',
    label: 'Một vợ một chồng',
    description: 'Góp phần xây dựng hôn nhân ổn định, văn minh.',
    example: 'Hôn nhân chung thủy, ổn định lâu dài.',
    isCorrect: true,
    icon: Home,
    category: 'hôn nhân',
    housePart: 'roof',
    missingConsequence:
      'Thiếu sự ổn định hôn nhân, gia đình khó tạo môi trường an toàn cho con cái phát triển.',
  },
]

export const WRONG_CARDS: GameCard[] = [
  {
    id: 'violence',
    label: 'Bạo lực',
    description: 'Làm tổn thương thể chất và tinh thần các thành viên.',
    example: 'Dùng bạo lực để giáo dục hoặc giải quyết mâu thuẫn.',
    isCorrect: false,
    icon: ShieldAlert,
    category: 'tiêu cực',
    oppositeIds: ['love', 'respect'],
    civilityPenalty: 20,
  },
  {
    id: 'forced-marriage',
    label: 'Ép hôn',
    description: 'Trái với nguyên tắc hôn nhân tự nguyện.',
    example: 'Bắt buộc con kết hôn theo ý người lớn.',
    isCorrect: false,
    icon: Ban,
    category: 'tiêu cực',
    oppositeIds: ['voluntary'],
    civilityPenalty: 18,
  },
  {
    id: 'sexism',
    label: 'Trọng nam khinh nữ',
    description: 'Trái với nguyên tắc bình đẳng giới.',
    example: 'Phân biệt đối xử giữa con trai và con gái.',
    isCorrect: false,
    icon: UserX,
    category: 'tiêu cực',
    oppositeIds: ['equality'],
    civilityPenalty: 15,
  },
  {
    id: 'irresponsible',
    label: 'Vô trách nhiệm',
    description: 'Làm suy yếu sự gắn kết trong gia đình.',
    example: 'Bỏ mặc việc nuôi dạy con cho người khác.',
    isCorrect: false,
    icon: ShieldX,
    category: 'tiêu cực',
    oppositeIds: ['responsibility'],
    civilityPenalty: 10,
  },
  {
    id: 'selfish',
    label: 'Ích kỷ',
    description: 'Làm giảm sự chia sẻ và yêu thương.',
    example: 'Chỉ quan tâm lợi ích cá nhân, bỏ qua gia đình.',
    isCorrect: false,
    icon: UserX,
    category: 'tiêu cực',
    oppositeIds: ['love', 'responsibility'],
    civilityPenalty: 8,
  },
  {
    id: 'neglect',
    label: 'Thiếu quan tâm',
    description: 'Gây khoảng cách giữa các thành viên.',
    example: 'Không dành thời gian trò chuyện với vợ/chồng, con cái.',
    isCorrect: false,
    icon: ShieldX,
    category: 'tiêu cực',
    oppositeIds: ['love'],
    civilityPenalty: 8,
  },
  {
    id: 'patriarchy',
    label: 'Gia trưởng',
    description: 'Làm mất đi sự bình đẳng trong gia đình.',
    example: 'Một người tự quyết định mọi việc, không cho ý kiến.',
    isCorrect: false,
    icon: Ban,
    category: 'tiêu cực',
    oppositeIds: ['equality', 'respect'],
    civilityPenalty: 12,
  },
  {
    id: 'indifferent',
    label: 'Thờ ơ với con cái',
    description: 'Ảnh hưởng tiêu cực đến giáo dục và nhân cách trẻ.',
    example: 'Không quan tâm học hành, bạn bè và tâm lý của con.',
    isCorrect: false,
    icon: ShieldAlert,
    category: 'tiêu cực',
    oppositeIds: ['education'],
    civilityPenalty: 12,
  },
]

export const FAMILY_EVENTS: FamilyEvent[] = [
  {
    id: 'e1',
    title: 'Sự kiện tích cực',
    description: 'Một thành viên gặp khó khăn trong học tập. Gia đình cần phản ứng thế nào?',
    optionIds: ['love', 'selfish', 'indifferent'],
    correctId: 'love',
    explanation: 'Yêu thương và quan tâm giúp thành viên vượt qua khó khăn — đúng chức năng gắn kết gia đình.',
  },
  {
    id: 'e2',
    title: 'Sự kiện tiêu cực',
    description: 'Cha mẹ ép con kết hôn theo ý mình, bất chấp con chưa sẵn sàng.',
    optionIds: ['voluntary', 'forced-marriage', 'patriarchy'],
    correctId: 'voluntary',
    explanation: 'Hôn nhân tự nguyện là nguyên tắc cốt lõi của hôn nhân tiến bộ.',
  },
  {
    id: 'e3',
    title: 'Sự kiện thực tế',
    description: 'Con mắc lỗi nhỏ. Cha mẹ nên chọn cách giáo dục nào?',
    optionIds: ['education', 'violence', 'neglect'],
    correctId: 'education',
    explanation: 'Gia đình là môi trường giáo dục đầu tiên — cần kiên nhẫn, không dùng bạo lực.',
  },
  {
    id: 'e4',
    title: 'Sự kiện thực tế',
    description: 'Chồng muốn một mình quyết định mọi khoản chi tiêu gia đình.',
    optionIds: ['equality', 'patriarchy', 'sexism'],
    correctId: 'equality',
    explanation: 'Bình đẳng vợ chồng là nguyên tắc của hôn nhân tiến bộ.',
  },
]

export const BADGE_DEFS: BadgeDef[] = [
  { id: 'architect', label: 'Kiến trúc sư gia đình', description: 'Chọn đủ 8 giá trị đúng' },
  { id: 'civilized', label: 'Gia đình văn minh', description: 'Không chọn sai lần nào' },
  { id: 'fast', label: 'Người xây tổ ấm nhanh nhạy', description: 'Hoàn thành dưới 60 giây' },
  { id: 'quiz-master', label: 'Nhà tư vấn gia đình', description: 'Trả lời đúng tất cả câu hỏi tình huống' },
  { id: 'no-hints', label: 'Người hiểu bài xuất sắc', description: 'Không dùng gợi ý' },
  { id: 'high-civility', label: 'Mức văn minh cao', description: 'Chỉ số văn minh đạt từ 90%' },
]

export const SITUATION_QUIZZES: SituationQuiz[] = [
  {
    id: 'q1',
    question: 'Ông bà muốn can thiệp mọi quyết định của vợ chồng. Cách ứng xử nào phù hợp?',
    context: 'Tình huống thực tế',
    options: [
      {
        id: 'a',
        text: 'Vợ chồng tôn trọng ý kiến ông bà nhưng tự quyết định việc của mình',
        correct: true,
        explanation: 'Tôn trọng thế hệ trước đồng thời giữ sự dân chủ trong gia đình nhỏ.',
      },
      {
        id: 'b',
        text: 'Nghe theo hoàn toàn vì "hiếu thảo là trên hết"',
        correct: false,
        explanation: 'Hiếu thảo không đồng nghĩa với bất cứ điều gì cũng phải nghe theo.',
      },
    ],
  },
  {
    id: 'q2',
    question: 'Chồng kiếm nhiều hơn nên muốn "nắm quyền" chi tiêu. Điều này thể hiện?',
    context: 'Tình huống thực tế',
    options: [
      {
        id: 'a',
        text: 'Bình đẳng vợ chồng trong quyền và nghĩa vụ',
        correct: true,
        explanation: 'Vợ chồng bình đẳng là nguyên tắc của hôn nhân tiến bộ.',
      },
      {
        id: 'b',
        text: 'Gia trưởng — người kiếm nhiều quyết định',
        correct: false,
        explanation: 'Gia trưởng trái với nguyên tắc bình đẳng trong gia đình tiến bộ.',
      },
    ],
  },
  {
    id: 'q3',
    question: 'Con mắc lỗi nhỏ. Cha mẹ nên ứng xử thế nào?',
    context: 'Tình huống thực tế',
    options: [
      {
        id: 'a',
        text: 'Giáo dục bằng lời nói và gương mẫu, không dùng bạo lực',
        correct: true,
        explanation: 'Gia đình là môi trường giáo dục đầu tiên — cần kiên nhẫn và yêu thương.',
      },
      {
        id: 'b',
        text: 'Đánh để con "nhớ đời"',
        correct: false,
        explanation: 'Bạo lực gia đình gây tổn thương tâm lý, trái với xây dựng gia đình văn minh.',
      },
    ],
  },
  {
    id: 'q4',
    question: 'Hai người yêu nhau muốn kết hôn nhưng gia đình phản đối. Nguyên tắc nào cần đặt lên hàng đầu?',
    context: 'Tình huống thực tế',
    options: [
      {
        id: 'a',
        text: 'Hôn nhân tự nguyện, một vợ một chồng',
        correct: true,
        explanation: 'Hôn nhân tiến bộ dựa trên tự nguyện và tình yêu chân thành.',
      },
      {
        id: 'b',
        text: 'Nghe theo gia đình sắp đặt',
        correct: false,
        explanation: 'Ép buộc kết hôn trái với nguyên tắc hôn nhân tự nguyện.',
      },
    ],
  },
  {
    id: 't1',
    question: 'Gia đình được xem là gì của xã hội?',
    context: 'Câu hỏi lý thuyết',
    options: [
      {
        id: 'a',
        text: 'Một tổ chức kinh tế độc lập',
        correct: false,
        explanation: 'Gia đình là tế bào của xã hội, không chỉ là tổ chức kinh tế.',
      },
      {
        id: 'b',
        text: 'Tế bào của xã hội',
        correct: true,
        explanation: 'Gia đình là tế bào của xã hội vì sự ổn định và phát triển của gia đình ảnh hưởng trực tiếp đến sự ổn định và phát triển của xã hội.',
      },
    ],
  },
  {
    id: 't2',
    question: 'Chức năng giáo dục của gia đình thể hiện ở nội dung nào?',
    context: 'Câu hỏi lý thuyết',
    options: [
      {
        id: 'a',
        text: 'Hình thành nhân cách, đạo đức, lối sống cho con người',
        correct: true,
        explanation: 'Gia đình là môi trường giáo dục đầu tiên và quan trọng nhất.',
      },
      {
        id: 'b',
        text: 'Chỉ tạo ra thu nhập cho các thành viên',
        correct: false,
        explanation: 'Đó là chức năng kinh tế, không phải chức năng giáo dục.',
      },
    ],
  },
  {
    id: 't3',
    question: 'Hôn nhân tiến bộ trong thời kỳ quá độ lên CNXH dựa trên nguyên tắc nào?',
    context: 'Câu hỏi lý thuyết',
    options: [
      {
        id: 'a',
        text: 'Tự nguyện, một vợ một chồng, vợ chồng bình đẳng',
        correct: true,
        explanation: 'Đây là các nguyên tắc cốt lõi của hôn nhân tiến bộ.',
      },
      {
        id: 'b',
        text: 'Ép buộc, gia trưởng, bất bình đẳng',
        correct: false,
        explanation: 'Đây là những tàn dư của hôn nhân lạc hậu cần xóa bỏ.',
      },
    ],
  },
  {
    id: 't4',
    question: 'Giá trị hiếu thảo thuộc cơ sở nào trong xây dựng gia đình?',
    context: 'Câu hỏi lý thuyết',
    options: [
      {
        id: 'a',
        text: 'Cơ sở văn hóa',
        correct: true,
        explanation: 'Hiếu thảo là giá trị văn hóa truyền thống tốt đẹp của dân tộc.',
      },
      {
        id: 'b',
        text: 'Cơ sở sinh học',
        correct: false,
        explanation: 'Cơ sở sinh học là quan hệ huyết thống, còn hiếu thảo là giá trị văn hóa đạo đức.',
      },
    ],
  },
]

export const ACADEMIC_TIPS = [
  'Gia đình là tế bào của xã hội — nền tảng cho sự ổn định và phát triển.',
  'Gia đình thực hiện 4 chức năng: tái sản xuất con người, kinh tế, giáo dục, thỏa mãn tâm sinh lý.',
  'Hôn nhân tiến bộ: tự nguyện — một vợ một chồng — vợ chồng bình đẳng — tình yêu chân thành.',
  'Ngôi nhà hạnh phúc cần nền móng (yêu thương, bình đẳng), cột trụ (đạo đức, giáo dục), mái nhà (hôn nhân tiến bộ).',
  'Luật Hôn nhân và Gia đình bảo vệ quyền lợi vợ chồng, trẻ em và người cao tuổi.',
] as const

export const TOTAL_CORRECT = CORRECT_CARDS.length
export const MAX_HINTS = 2
export const BEST_SCORE_KEY = 'mln131-family-game-best'
export const LEADERBOARD_KEY = 'mln131-family-game-leaderboard'
export const MAX_LEADERBOARD = 10

const ALL_CARDS_MAP = new Map([...CORRECT_CARDS, ...WRONG_CARDS].map((c) => [c.id, c]))

export function getCardById(id: string): GameCard | undefined {
  return ALL_CARDS_MAP.get(id)
}

export function getOppositeLabels(card: GameCard): string[] {
  if (!card.oppositeIds?.length) return []
  return card.oppositeIds
    .map((id) => CORRECT_CARDS.find((c) => c.id === id)?.label)
    .filter((l): l is string => Boolean(l))
}

export function shuffleCards<T>(items: T[]): T[] {
  const next = [...items]
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[next[i], next[j]] = [next[j], next[i]]
  }
  return next
}

export function createRoundCards(presentationMode = false): GameCard[] {
  if (presentationMode) {
    const wrongPool = shuffleCards(WRONG_CARDS).slice(0, 2)
    return shuffleCards([...CORRECT_CARDS, ...wrongPool])
  }
  const wrongCount = 2 + Math.floor(Math.random() * 3)
  const wrongPool = shuffleCards(WRONG_CARDS).slice(0, wrongCount)
  return shuffleCards([...CORRECT_CARDS, ...wrongPool])
}

export function getRandomQuiz(usedIds: string[]): SituationQuiz {
  const available = SITUATION_QUIZZES.filter((q) => !usedIds.includes(q.id))
  const pool = available.length ? available : SITUATION_QUIZZES
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getRandomEvent(usedIds: string[]): FamilyEvent {
  const available = FAMILY_EVENTS.filter((e) => !usedIds.includes(e.id))
  const pool = available.length ? available : FAMILY_EVENTS
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getPartProgress(placedIds: string[], part: HousePart) {
  const config = HOUSE_PARTS[part]
  const placed = config.cardIds.filter((id) => placedIds.includes(id))
  return { placed, total: config.cardIds.length, complete: placed.length === config.cardIds.length }
}

export function calculateCivility(placedCorrect: string[], wrongCardIds: string[]): number {
  let score = 0
  for (const id of placedCorrect) {
    const card = CORRECT_CARDS.find((c) => c.id === id)
    if (!card?.housePart) continue
    score += HOUSE_PARTS[card.housePart].civilityPerCard
  }
  for (const id of wrongCardIds) {
    const card = WRONG_CARDS.find((c) => c.id === id)
    if (card?.civilityPenalty) score -= card.civilityPenalty
  }
  return Math.max(0, Math.min(100, score))
}

export type EarnedBadge = {
  id: string
  label: string
  description: string
}

export function calculateBadges(opts: {
  placedCount: number
  wrongAttempts: number
  elapsed: number
  hintsUsed: number
  quizCorrect: number
  quizTotal: number
  civility: number
  presentationMode: boolean
}): EarnedBadge[] {
  const badges: EarnedBadge[] = []
  const find = (id: string) => BADGE_DEFS.find((b) => b.id === id)

  if (opts.placedCount === TOTAL_CORRECT) {
    const b = find('architect')
    if (b) badges.push(b)
  }
  if (opts.wrongAttempts === 0 && opts.placedCount > 0) {
    const b = find('civilized')
    if (b) badges.push(b)
  }
  if (!opts.presentationMode && opts.elapsed > 0 && opts.elapsed < 60 && opts.placedCount === TOTAL_CORRECT) {
    const b = find('fast')
    if (b) badges.push(b)
  }
  if (opts.quizTotal > 0 && opts.quizCorrect === opts.quizTotal) {
    const b = find('quiz-master')
    if (b) badges.push(b)
  }
  if (opts.hintsUsed === 0 && opts.placedCount >= 4) {
    const b = find('no-hints')
    if (b) badges.push(b)
  }
  if (opts.civility >= 90) {
    const b = find('high-civility')
    if (b) badges.push(b)
  }
  return badges
}

export function getComboMessage(streak: number): string | null {
  if (streak >= 5) return 'Xuất sắc! Chuỗi 5 đúng liên tiếp!'
  if (streak >= 3) return 'Tuyệt vời! Chuỗi 3 đúng liên tiếp!'
  if (streak === 2) return 'Tốt lắm! Bạn đang đi đúng hướng.'
  return null
}

export function getCorrectFeedback(card: GameCard, presentationMode: boolean): string {
  if (presentationMode && card.housePart) {
    return `${HOUSE_PARTS[card.housePart].label}: Đã thêm "${card.label}". ${HOUSE_PARTS[card.housePart].academicNote}`
  }
  return `Đã thêm "${card.label}" vào ${card.housePart ? HOUSE_PARTS[card.housePart].label.toLowerCase() : 'ngôi nhà'}.`
}

export function getWrongFeedback(card: GameCard): string {
  return `Bạn chọn: ${card.label} — giá trị này không phù hợp để xây dựng gia đình tiến bộ.`
}

export function getResultMessage(score: number): string {
  if (score >= 7) {
    return 'Xuất sắc! Bạn đã xây dựng được một gia đình no ấm, bình đẳng, tiến bộ và hạnh phúc.'
  }
  if (score >= 4) {
    return 'Khá tốt! Bạn đã hiểu được nhiều giá trị quan trọng, nhưng vẫn cần chú ý hơn đến các yếu tố xây dựng gia đình văn minh.'
  }
  return 'Gia đình cần được xây dựng trên nền tảng yêu thương, bình đẳng, tôn trọng và trách nhiệm.'
}

export function getResultBadge(score: number): string {
  if (score >= 7) return 'Kiến trúc sư gia đình'
  if (score >= 4) return 'Người xây dựng'
  return 'Đang học hỏi'
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function loadLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    return raw ? (JSON.parse(raw) as LeaderboardEntry[]) : []
  } catch {
    return []
  }
}

export function saveLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const list = loadLeaderboard()
  const next = [entry, ...list].sort((a, b) => b.score - a.score || b.civility - a.civility).slice(0, MAX_LEADERBOARD)
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(next))
  return next
}
