'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Foundation = {
  num: string
  title: string
  paragraphs?: string[]
  intro?: string
  items?: string[]
  outro?: string
  image?: string
  imageAlt?: string
}

const FOUNDATIONS: Foundation[] = [
  {
    num: '01',
    title: 'Cơ sở kinh tế – xã hội',
    paragraphs: [
      'Sự phát triển của lực lượng sản xuất và quan hệ sản xuất mới là nền tảng kinh tế cho việc xây dựng gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội.',
      'Khi xã hội phát triển, đời sống vật chất và tinh thần được nâng cao sẽ tạo điều kiện xây dựng gia đình no ấm, tiến bộ và hạnh phúc. Việc xóa bỏ áp bức, bất công và từng bước thực hiện bình đẳng xã hội cũng góp phần xây dựng mối quan hệ gia đình tốt đẹp hơn.',
    ],
  },
  {
    num: '02',
    title: 'Cơ sở chính trị – pháp luật',
    intro: 'Nhà nước xã hội chủ nghĩa ban hành nhiều chủ trương, chính sách và pháp luật nhằm bảo vệ hôn nhân và gia đình:',
    items: [
      'Luật Hôn nhân và Gia đình.',
      'Chính sách bình đẳng giới.',
      'Chính sách bảo vệ quyền trẻ em.',
      'Chính sách chăm sóc người cao tuổi.',
    ],
    outro: 'Những quy định này góp phần xây dựng gia đình dân chủ, bình đẳng, tiến bộ và văn minh.',
  },
  {
    num: '03',
    title: 'Cơ sở văn hóa',
    intro: 'Gia đình xã hội chủ nghĩa được xây dựng trên nền tảng các giá trị văn hóa tốt đẹp của dân tộc kết hợp với tinh hoa văn hóa nhân loại:',
    items: [
      'Hiếu thảo với ông bà, cha mẹ.',
      'Yêu thương, đoàn kết giữa các thành viên.',
      'Tôn trọng đạo đức và lối sống lành mạnh.',
      'Bình đẳng giữa vợ và chồng.',
    ],
    outro: 'Đó là nền tảng quan trọng để xây dựng gia đình văn hóa trong xã hội hiện đại.',
  },
  {
    num: '04',
    title: 'Cơ sở hôn nhân tiến bộ',
    image: '/wedding.png',
    imageAlt: 'Lễ cưới truyền thống Việt Nam với cô dâu chú rể mặc áo dài',
    intro: 'Hôn nhân trong thời kỳ quá độ lên chủ nghĩa xã hội được xây dựng dựa trên các nguyên tắc:',
    items: [
      'Hôn nhân tự nguyện.',
      'Một vợ một chồng.',
      'Vợ chồng bình đẳng.',
      'Hôn nhân dựa trên tình yêu chân chính.',
    ],
    outro: 'Đây là cơ sở quan trọng để xây dựng gia đình hạnh phúc và tiến bộ, phù hợp với mục tiêu phát triển của xã hội xã hội chủ nghĩa.',
  },
  {
    num: '05',
    title: 'Liên hệ thực tiễn',
    image: '/community.png',
    imageAlt: 'Cộng đồng làng quê Việt Nam nhiều thế hệ quây quần',
    paragraphs: [
      'Ở Việt Nam hiện nay, Đảng và Nhà nước luôn quan tâm đến việc xây dựng gia đình no ấm, tiến bộ, hạnh phúc và văn minh. Nhiều phong trào như “Gia đình văn hóa”, “Xây dựng gia đình 5 không 3 sạch” đã đạt được những kết quả tích cực.',
      'Tuy nhiên, gia đình Việt Nam cũng đang đối mặt với nhiều thách thức như tỷ lệ ly hôn gia tăng, bạo lực gia đình, khoảng cách thế hệ và tác động của mạng xã hội — đòi hỏi mỗi cá nhân, gia đình và toàn xã hội cần chung tay xây dựng môi trường gia đình lành mạnh.',
    ],
  },
]

export function FoundationsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const section = sectionRef.current
    if (!section) return

    const rows = section.querySelectorAll<HTMLElement>('[data-row]')
    if (!rows.length) return

    rows.forEach((row) => {
      const divider = row.querySelector<HTMLElement>('[data-divider]')
      const titleWrap = row.querySelector<HTMLElement>('[data-title-reveal]')
      const titleInner = row.querySelector<HTMLElement>('[data-title-inner]')
      const bodyWrap = row.querySelector<HTMLElement>('[data-body-reveal]')
      const bodyInner = row.querySelector<HTMLElement>('[data-body-inner]')
      const image = row.querySelector('img')
      const listItems = row.querySelectorAll('li')

      // Divider draw
      if (divider) {
        gsap.from(divider, {
          scaleX: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 85%',
            end: 'top 50%',
            scrub: 1.2,
          },
        })
      }

      // Title mask-reveal
      if (titleInner) {
        gsap.from(titleInner, {
          yPercent: 110,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 82%',
            end: 'top 45%',
            scrub: 1,
          },
        })
      }

      // Body mask-reveal with stagger
      if (bodyInner) {
        const bodyChildren = Array.from(bodyInner.children)
        if (bodyChildren.length) {
          gsap.set(bodyChildren, { opacity: 0, yPercent: 30 })
          gsap.to(bodyChildren, {
            yPercent: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            stagger: 0.06,
            scrollTrigger: {
              trigger: row,
              start: 'top 78%',
              end: 'top 40%',
              scrub: 1.2,
            },
          })
        } else {
          gsap.from(bodyInner, {
            yPercent: 40,
            opacity: 0.2,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 75%',
              end: 'top 40%',
              scrub: 1.2,
            },
          })
        }
      }

      // Image scale reveal
      if (image) {
        gsap.set(image, { scale: 1.2, opacity: 0 })
        gsap.to(image, {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 78%',
            end: 'top 40%',
            scrub: 1.2,
          },
        })
      }

      // List items stagger
      if (listItems.length) {
        gsap.set(listItems, { opacity: 0, x: -15 })
        gsap.to(listItems, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: row,
            start: 'top 75%',
            end: 'top 40%',
            scrub: 1,
          },
        })
      }
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="foundations"
      className="relative w-full border-b border-[#1C1C1C]/10 px-6 py-24 md:px-12 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 70% 30%, rgba(155,58,47,0.03) 0%, transparent 70%)',
        }}
      />
      <div className="relative mx-auto max-w-[1400px]">
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9B3A2F]">
              Phần II
            </p>
            <h2 className="text-balance-auto mt-4 max-w-2xl font-serif text-4xl leading-[0.95] tracking-tight text-[#1C1C1C] md:text-6xl">
              Cơ sở xây dựng gia đình trong thời kỳ quá độ
            </h2>
          </div>
          <span className="font-serif text-7xl italic text-[#1C1C1C]/15 md:text-8xl">
            05
          </span>
        </div>

        <div className="border-t border-[#1C1C1C]/15">
          {FOUNDATIONS.map((f) => (
            <div
              key={f.num}
              data-row
              className="group relative grid grid-cols-1 gap-6 border-b border-[#1C1C1C]/15 py-10 md:grid-cols-[0.4fr_0.6fr] md:gap-16 md:py-14"
            >
              {/* Animated divider */}
              <div
                data-divider
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-[#1C1C1C]/15 origin-left scale-x-0"
              />

              <div className="relative flex items-start gap-5">
                <span className="font-mono text-sm text-[#9B3A2F] transition-transform duration-300 group-hover:translate-x-0.5">
                  {f.num}
                </span>
                <div data-title-reveal className="overflow-hidden">
                  <h3
                    data-title-inner
                    className="font-serif text-2xl leading-tight tracking-tight text-[#1C1C1C] md:text-4xl"
                  >
                    {f.title}
                  </h3>
                </div>
              </div>

              <div data-body-reveal className="overflow-hidden">
                <div data-body-inner className="space-y-4">
                  {f.paragraphs?.map((p, i) => (
                    <p
                      key={i}
                      className="text-base leading-[1.75] text-[#1C1C1C]/80"
                    >
                      {p}
                    </p>
                  ))}

                  {f.intro && (
                    <p className="text-base leading-[1.75] text-[#1C1C1C]/80">
                      {f.intro}
                    </p>
                  )}

                  {f.items && (
                    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {f.items.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-baseline gap-3 border-l border-[#9B3A2F]/40 pl-3 text-base leading-[1.75] text-[#1C1C1C]/80 transition-all duration-300 hover:border-[#9B3A2F] hover:pl-4"
                        >
                          <span className="font-mono text-xs text-[#9B3A2F]">
                            —
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {f.outro && (
                    <p className="text-base leading-[1.75] text-[#1C1C1C]/80">
                      {f.outro}
                    </p>
                  )}

                  {f.image && (
                    <figure className="mt-2 pt-2">
                      <img
                        src={f.image || '/placeholder.svg'}
                        alt={f.imageAlt}
                        className="aspect-[16/9] w-full rounded-sm object-cover grayscale-[0.1] transition-all duration-500 hover:grayscale-0"
                      />
                    </figure>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
