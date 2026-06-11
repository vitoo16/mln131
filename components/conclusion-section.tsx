'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function ConclusionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphsRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const decorRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    const paragraphs = paragraphsRef.current
    const footer = footerRef.current
    const decor = decorRef.current
    if (!section || !heading || !paragraphs) return

    const ctx = gsap.context(() => {
      // Section background fade-in
      gsap.set(section, { opacity: 0 })
      gsap.to(section, {
        opacity: 1,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top 60%',
          scrub: 1,
        },
      })

      // Decorative line
      if (decor) {
        gsap.set(decor, { scaleX: 0 })
        gsap.to(decor, {
          scaleX: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 40%',
            scrub: 1,
          },
        })
      }

      // Kinetic typography on heading lines
      const lineInners = heading.querySelectorAll('[data-line-inner]')
      if (lineInners.length) {
        gsap.set(lineInners, { yPercent: 120, opacity: 0, rotateX: -60 })
        gsap.to(lineInners, {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.4,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: heading,
            start: 'top 82%',
            end: 'top 30%',
            scrub: 1,
          },
        })
      }

      // Paragraph columns stagger
      const pEls = paragraphs.querySelectorAll('p')
      if (pEls.length) {
        gsap.set(pEls, { opacity: 0, y: 30 })
        gsap.to(pEls, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: paragraphs,
            start: 'top 82%',
            end: 'top 35%',
            scrub: 1,
          },
        })
      }

      // Footer scale-up
      if (footer) {
        gsap.set(footer, { opacity: 0, y: 20 })
        gsap.to(footer, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            end: 'top 60%',
            scrub: 1,
          },
        })
      }
    }, section)

    return () => ctx.revert()
  }, { scope: sectionRef })

  const headingLines = [
    'Gia đình là nền tảng cho sự phát triển',
    'bền vững của con người và đất nước.',
  ]

  return (
    <section
      ref={sectionRef}
      id="conclusion"
      className="relative w-full bg-[#9B3A2F] px-6 py-28 text-[#F9F6F0] md:px-12 md:py-44"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(249,246,240,0.08) 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-5xl">
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="h-px w-12 bg-[#F9F6F0]/50" />
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F9F6F0]/80">
            Kết luận
          </p>
          <span className="h-px w-12 bg-[#F9F6F0]/50" />
        </div>

        <h2
          ref={headingRef}
          className="text-balance-auto mx-auto max-w-4xl text-center font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl"
        >
          {headingLines.map((line, i) => (
            <span key={i} data-line className="block overflow-hidden">
              <span data-line-inner className="block">{line}</span>
            </span>
          ))}
        </h2>

        <div
          ref={paragraphsRef}
          className="mx-auto mt-16 max-w-3xl columns-1 gap-12 md:columns-2 [&>p]:mb-6 [&>p]:break-inside-avoid"
        >
          <p className="text-base leading-[1.75] text-[#F9F6F0]/90">
            Gia đình có vai trò đặc biệt quan trọng trong thời kỳ quá độ lên chủ nghĩa xã hội.
            Gia đình không chỉ là nơi duy trì nòi giống mà còn là môi trường giáo dục, hình thành
            nhân cách và truyền giữ các giá trị văn hóa dân tộc.
          </p>
          <p className="text-base leading-[1.75] text-[#F9F6F0]/90">
            Việc xây dựng gia đình no ấm, bình đẳng, tiến bộ và hạnh phúc là nhiệm vụ quan trọng
            của toàn xã hội. Để thực hiện mục tiêu đó cần kết hợp giữa phát triển kinh tế, hoàn
            thiện pháp luật, nâng cao đời sống văn hóa và phát huy trách nhiệm của mỗi cá nhân
            trong gia đình.
          </p>
          <p className="text-base leading-[1.75] text-[#F9F6F0]/90">
            Trong bối cảnh hội nhập và phát triển hiện nay, việc giữ gìn và phát huy các giá trị
            tốt đẹp của gia đình Việt Nam có ý nghĩa đặc biệt quan trọng đối với sự phát triển
            bền vững của đất nước.
          </p>
        </div>

        <div
          ref={decorRef}
          aria-hidden="true"
          className="mx-auto mt-16 h-px w-24 origin-center bg-[#F9F6F0]/30"
        />

        <footer ref={footerRef} className="relative mt-16 flex flex-col items-center gap-2">
          <p className="font-serif text-2xl italic">Chương 7 — Gia đình</p>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#F9F6F0]/70">
            Chủ nghĩa xã hội khoa học
          </p>
        </footer>
      </div>
    </section>
  )
}
