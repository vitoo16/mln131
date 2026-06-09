'use client'

import { useRef, useMemo } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  const splitText = (text: string) =>
    text.split(' ').map((word, i) => (
      <span key={i} className="inline-block overflow-hidden">
        <span className="hero-word inline-block">{word}&nbsp;</span>
      </span>
    ))

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const left = leftRef.current
      const right = rightRef.current
      if (!left || !right) return

      // Left column entrance
      gsap.set(left, { opacity: 0 })
      gsap.to(left, {
        opacity: 1,
        duration: 1.8,
        ease: 'power3.out',
        delay: 0.3,
      })

      // Word-by-word 3D reveal
      const words = left.querySelectorAll('.hero-word')
      if (words.length) {
        gsap.set(words, { yPercent: 120, rotateX: -80 })
        gsap.to(words, {
          yPercent: 0,
          rotateX: 0,
          duration: 1.4,
          ease: 'power4.out',
          stagger: 0.04,
          delay: 0.5,
        })
      }

      // Shake animation for scroll hint
      const scrollHint = left.querySelector('.scroll-hint')
      if (scrollHint) {
        gsap.set(scrollHint, { opacity: 0 })
        gsap.to(scrollHint, {
          opacity: 1,
          duration: 0.6,
          delay: 2,
        })
        gsap.to(scrollHint, {
          x: 3,
          duration: 0.15,
          ease: 'sine.inOut',
          repeat: 5,
          yoyo: true,
          repeatDelay: 0.8,
        })
      }

      // Right content blocks fade-up on scroll
      const rightChildren = Array.from(right.children)
      rightChildren.forEach((child) => {
        gsap.set(child, { opacity: 0, y: 60 })
        gsap.to(child, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: child as HTMLElement,
            start: 'top bottom-=100',
            end: 'top center',
            scrub: 1.2,
          },
        })
      })

      // Parallax on key elements
      const parallaxTargets = right.querySelectorAll(
        'blockquote, figure, h2, ul',
      )
      parallaxTargets.forEach((el) => {
        gsap.to(el, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: el as HTMLElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        })
      })
    }, containerRef)
  }, { scope: containerRef })

  return (
    <section id="hero" ref={containerRef} className="relative w-full border-b border-[#1C1C1C]/10">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-2">
        {/* Left — Sticky title */}
        <div ref={leftRef} className="relative md:h-dvh">
          <div className="md:sticky md:top-0 flex min-h-[60dvh] flex-col justify-between px-6 pt-28 pb-10 md:h-dvh md:px-12 md:pt-0 md:pb-0 md:justify-center">
            <div className="mb-8 md:mb-12 md:absolute md:top-26">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9B3A2F]">
                Chủ nghĩa xã hội khoa học
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-[#1C1C1C]/50">
                Thời kỳ quá độ lên CNXH
              </p>
            </div>
            <h1 className="text-balance-auto font-serif text-[15vw] leading-[0.85] tracking-tight text-[#1C1C1C] md:text-[8.5vw]">
              {splitText('Chương')}
              <br />
              <span className="text-[#9B3A2F]">{splitText('07')}</span>
              <br />
              <span className="italic">{splitText('Gia đình')}</span>
            </h1>
            <div className="scroll-hint mt-8 hidden items-center gap-3 md:absolute md:bottom-12 md:flex">
              <span className="h-px w-12 bg-[#1C1C1C]" />
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#1C1C1C]/60">
                Cuộn để khám phá
              </span>
            </div>
          </div>
        </div>

        {/* Right — Scrollable content */}
        <div ref={rightRef} className="border-t border-[#1C1C1C]/10 px-6 py-16 md:border-l md:border-t-0 md:px-12 md:py-40">
          <article className="max-w-xl">
            <div className="mb-8 flex items-baseline gap-4">
              <span className="font-serif text-2xl text-[#9B3A2F]">1</span>
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#1C1C1C]/60">
                Khái niệm gia đình
              </h2>
            </div>
            <blockquote className="border-l-2 border-[#9B3A2F] pl-6 font-serif text-2xl leading-snug text-[#1C1C1C] md:text-3xl">
              Gia đình là một hình thức cộng đồng xã hội đặc biệt, được hình thành trên cơ sở quan hệ hôn nhân, huyết thống và nuôi dưỡng — tế bào của xã hội.
            </blockquote>
            <p className="mt-8 text-base leading-relaxed text-[#1C1C1C]/80">
              Gia đình là nơi con người được sinh ra, nuôi dưỡng, giáo dục và hình thành nhân cách. Trong thời kỳ quá độ lên chủ nghĩa xã hội, gia đình không chỉ giữ vai trò duy trì nòi giống mà còn là môi trường quan trọng để giáo dục đạo đức, lối sống và hình thành ý thức công dân cho mỗi cá nhân.
            </p>
            <figure className="mt-10">
              <img
                src="/family-meal.png"
                alt="Một gia đình Việt Nam nhiều thế hệ quây quần bên bữa cơm"
                className="aspect-[4/3] w-full rounded-sm object-cover grayscale-[0.15]"
              />
              <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-[#1C1C1C]/45">
                Hình 1 — Gia đình, tế bào của xã hội
              </figcaption>
            </figure>
            <div className="mt-20 mb-4 flex items-baseline gap-4">
              <span className="font-serif text-2xl text-[#9B3A2F]">2</span>
              <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-[#1C1C1C]/60">
                Vị trí của gia đình
              </h2>
            </div>
            <p className="text-base leading-relaxed text-[#1C1C1C]/80">
              Gia đình giữ vị trí đặc biệt quan trọng trong đời sống xã hội:
            </p>
            <ul className="mt-6 space-y-5">
              {[
                'Là tế bào của xã hội, góp phần quyết định sự ổn định và phát triển của xã hội.',
                'Là tổ ấm của mỗi cá nhân, đáp ứng nhu cầu tình cảm, vật chất và tinh thần.',
                'Là cầu nối giữa cá nhân với xã hội, truyền tải các giá trị văn hóa, đạo đức và truyền thống dân tộc.',
                'Sự phát triển bền vững của gia đình ảnh hưởng trực tiếp đến sự phát triển của đất nước.',
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-1 font-mono text-xs text-[#9B3A2F]">
                    0{i + 1}
                  </span>
                  <span className="text-base leading-relaxed text-[#1C1C1C]/80">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-base leading-relaxed text-[#1C1C1C]/80">
              Trong xã hội hiện nay, cùng với sự phát triển của kinh tế thị trường và hội nhập quốc tế, gia đình Việt Nam đang có nhiều thay đổi về quy mô, chức năng và giá trị. Tuy nhiên, gia đình vẫn giữ vai trò nền tảng trong việc xây dựng con người mới xã hội chủ nghĩa.
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}
