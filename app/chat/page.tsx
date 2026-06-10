import type { Metadata } from 'next'

import ChatPageClient from '@/components/chat-page-client'
import { pickSuggestedQuestions } from '@/lib/suggested-questions.mjs'

export const metadata: Metadata = {
  title: 'Chat — Chương 7: Vấn đề gia đình',
  description:
    'Trang đối thoại học tập về Chương 7 – Vấn đề gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội, trả lời dựa trên giáo trình Chủ nghĩa xã hội khoa học bản chính thống.',
}

// Câu hỏi gợi ý bám sát nội dung thuyết trình của nhóm:
// Chương 7 - Vấn đề gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội.
const SUGGESTION_POOL = [
  'Khái niệm gia đình theo chủ nghĩa Mác - Lênin được hiểu như thế nào?',
  'Vì sao nói gia đình là tế bào của xã hội?',
  'Gia đình giữ những vị trí nào trong đời sống xã hội?',
  'Chức năng tái sản xuất con người của gia đình là gì?',
  'Chức năng kinh tế và tổ chức tiêu dùng của gia đình thể hiện ra sao?',
  'Vì sao gia đình được coi là môi trường giáo dục đầu tiên và quan trọng nhất?',
  'Chức năng thỏa mãn nhu cầu tâm sinh lý, tình cảm của gia đình có ý nghĩa gì?',
  'Cơ sở kinh tế - xã hội để xây dựng gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội là gì?',
  'Nhà nước xã hội chủ nghĩa có những chính sách, pháp luật nào để bảo vệ hôn nhân và gia đình?',
  'Hôn nhân tiến bộ được xây dựng dựa trên những nguyên tắc nào?',
  'Những giá trị văn hóa nào là nền tảng để xây dựng gia đình văn hóa?',
  'Gia đình Việt Nam hiện nay đang đối mặt với những thách thức gì?',
]

export default function ChatPage() {
  const initialSuggestedQuestions = pickSuggestedQuestions(SUGGESTION_POOL, { refreshToken: 'initial-load' })

  return (
    <ChatPageClient
      initialSuggestedQuestions={initialSuggestedQuestions}
      suggestionPool={SUGGESTION_POOL}
    />
  )
}
