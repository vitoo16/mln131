import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Be_Vietnam_Pro, Lora } from 'next/font/google'
import './globals.css'

const beVietnam = Be_Vietnam_Pro({
  variable: '--font-be-vietnam',
  subsets: ['latin', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
})
const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: 'Chương 7: Gia đình — Triết học Mác–Lênin',
  description:
    'Vấn đề gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội — một trình bày biên tập số.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html suppressHydrationWarning
      lang="vi"
      className={`${beVietnam.variable} ${lora.variable} bg-cream noise-overlay`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
