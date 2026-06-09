'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FUNCTIONS = [
  {
    num: '01',
    label: 'a',
    title: 'Tái sản xuất con người',
    body: [
      'Đây là chức năng cơ bản của gia đình nhằm duy trì nòi giống và tái sản xuất sức lao động cho xã hội.',
      'Gia đình thực hiện việc sinh con, nuôi dưỡng và chăm sóc các thế hệ mới.',
    ],
  },
  {
    num: '02',
    label: 'b',
    title: 'Kinh tế & tổ chức tiêu dùng',
    body: [
      'Gia đình là đơn vị kinh tế cơ sở, tham gia lao động sản xuất, tạo ra của cải vật chất và tổ chức tiêu dùng nhằm đáp ứng nhu cầu của các thành viên.',
      'Trong thời kỳ hiện nay, chức năng kinh tế của gia đình có nhiều thay đổi khi các thành viên đều tham gia lao động, tạo thu nhập và cùng chia sẻ trách nhiệm xây dựng đời sống gia đình.',
    ],
  },
  {
    num: '03',
    label: 'c',
    title: 'Giáo dục',
    image: '/education-bw.png',
    imageAlt: 'Người mẹ dạy con nhỏ học bài bên bàn',
    body: [
      'Gia đình là môi trường giáo dục đầu tiên và quan trọng nhất đối với mỗi con người — giáo dục nhân cách, đạo đức, lối sống, truyền thống văn hóa và ý thức trách nhiệm.',
      'Việc xây dựng gia đình văn hóa góp phần hình thành thế hệ công dân có tri thức, đạo đức và trách nhiệm đối với xã hội.',
    ],
  },
  {
    num: '04',
    label: 'd',
    title: 'Thỏa mãn nhu cầu tâm sinh lý & tình cảm',
    body: [
      'Gia đình là nơi đem lại sự yêu thương, chăm sóc và chia sẻ giữa các thành viên — môi trường giúp con người cân bằng tâm lý, vượt qua khó khăn và phát triển toàn diện.',
      'Trong xã hội hiện đại, chức năng này ngày càng được đề cao nhằm xây dựng gia đình hạnh phúc, tiến bộ và bền vững.',
    ],
  },
]

export function FunctionsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const articlesRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const sidebar = sidebarRef.current
    const articles = articlesRef.current
    if (!section || !sidebar || !articles) return

    const articleEls = articles.querySelectorAll('article')
    if (!articleEls.length) return

    // Pin sidebar
    ScrollTrigger.create({
      trigger: section,
      start: 'top top+=80',
      end: () => `+=${articles.scrollHeight - section.offsetHeight}`,
      pin: sidebar,
      pinSpacing: false,
    })

    // Sidebar title reveal
    const sidebarTitle = sidebar.querySelector('.sidebar-title')
    if (sidebarTitle) {
      gsap.set(sidebarTitle, { opacity: 0, y: 40 })
      gsap.to(sidebarTitle, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        ease: 'power3.out',
        delay: 0.3,
      })
    }

    articleEls.forEach((article) => {
      const watermark = article.querySelector('[data-watermark]') as HTMLElement | null
      const content = article.querySelector('[data-content]') as HTMLElement | null
      const image = article.querySelector('img')
      const listItems = article.querySelectorAll('li')

      // Article crossfade + scale
      gsap.set(article, { opacity: 0.08, scale: 0.97 })
      gsap.to(article, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: article,
          start: 'top 88%',
          end: 'top 35%',
          scrub: 1.2,
        },
      })

      // Watermark parallax + scale
      if (watermark) {
        gsap.set(watermark, { scale: 0.85, opacity: 0 })
        gsap.to(watermark, {
          yPercent: -25,
          scale: 1,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: article,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      }

      // Content fade-up with stagger
      if (content) {
        const children = Array.from(content.children)
        gsap.set(children, { opacity: 0, y: 30 })
        gsap.to(children, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: article,
            start: 'top 78%',
            end: 'top 40%',
            scrub: 1,
          },
        })
      }

      // Image scale reveal
      if (image) {
        gsap.set(image, { scale: 1.15, opacity: 0 })
        gsap.to(image, {
          scale: 1,
          opacity: 0.9,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: article,
            start: 'top 75%',
            end: 'top 35%',
            scrub: 1.2,
          },
        })
      }

      // List items stagger
      if (listItems.length) {
        gsap.set(listItems, { opacity: 0, x: -20 })
        gsap.to(listItems, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: article,
            start: 'top 72%',
            end: 'top 38%',
            scrub: 1,
          },
        })
      }
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="functions"
      className="relative w-full border-b border-[#1C1C1C]/10 bg-[#1C1C1C] text-[#F9F6F0]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 30% 20%, rgba(155,58,47,0.06) 0%, transparent 70%)',
        }}
      />
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-[30%_70%]">
        {/* Left — sidebar */}
        <div ref={sidebarRef} className="relative border-b border-white/10 md:border-b-0 md:border-r">
          <div className="flex min-h-[40dvh] flex-col justify-between px-6 py-16 md:h-dvh md:px-10 md:py-12">
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#9B3A2F]">
              § 3
            </span>
            <div className="sidebar-title">
              <h2 className="text-balance-auto font-serif text-5xl leading-[0.9] tracking-tight md:text-6xl">
                Các
                <br />
                chức năng
                <br />
                <span className="italic text-[#9B3A2F]">cơ bản</span>
              </h2>
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/50">
                Bốn chức năng nền tảng định hình vai trò của gia đình trong đời
                sống xã hội chủ nghĩa.
              </p>
            </div>
            <div className="hidden md:block">
              <span className="h-px w-12 bg-white/20" />
            </div>
          </div>
        </div>

        {/* Right — articles */}
        <div ref={articlesRef}>
          {FUNCTIONS.map((fn) => (
            <article
              key={fn.num}
              className="relative flex min-h-[70dvh] items-center overflow-hidden border-b border-white/10 px-6 py-20 last:border-b-0 md:px-16"
            >
              {/* Watermark */}
              <span
                data-watermark
                aria-hidden="true"
                className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-serif text-[40vw] font-bold leading-none text-white/5 md:-right-8 md:text-[28vw]"
              >
                {fn.num}
              </span>

              <div data-content className="relative z-10 max-w-md">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#9B3A2F] font-serif text-sm italic text-[#9B3A2F] transition-transform duration-300 hover:scale-110">
                    {fn.label}
                  </span>
                  <span className="h-px flex-1 bg-white/20 transition-colors duration-300 hover:bg-white/40" />
                </div>
                <h3 className="font-serif text-3xl leading-tight tracking-tight md:text-4xl">
                  {fn.title}
                </h3>
                <div className="mt-6 space-y-4">
                  {fn.body.map((p, i) => (
                    <p key={i} className="text-base leading-relaxed text-white/70">
                      {p}
                    </p>
                  ))}
                </div>
                {'image' in fn && fn.image && (
                  <figure className="mt-8">
                    <img
                      src={fn.image || '/placeholder.svg'}
                      alt={fn.imageAlt}
                      className="aspect-[3/2] w-full rounded-sm object-cover opacity-90 transition-opacity duration-300 hover:opacity-100"
                    />
                  </figure>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
