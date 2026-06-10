'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

const LINKS = [
  { id: 'hero', label: 'Khái niệm' },
  { id: 'functions', label: 'Chức năng' },
  { id: 'foundations', label: 'Cơ sở' },
  { id: 'conclusion', label: 'Kết luận' },
] as const

export function SiteNav() {
  const [active, setActive] = useState<string>(LINKS[0].id)
  const rafRef = useRef<number>(0)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const sectionIds = useMemo(() => LINKS.map((l) => l.id), [])

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el != null)

    const updateActive = () => {
      let current = sections[0]?.id ?? LINKS[0].id
      for (const el of sections) {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120) current = el.id
      }
      setActive(current)
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = requestAnimationFrame(updateActive)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: [0, 1] },
    )

    sections.forEach((s) => observerRef.current?.observe(s))
    updateActive()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observerRef.current?.disconnect()
    }
  }, [sectionIds])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-12"
        style={{
          background: 'linear-gradient(to bottom, rgba(28,28,28,0.55) 0%, rgba(28,28,28,0) 100%)',
        }}
      >
        <a
          href="#hero"
          className="font-serif text-sm font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
        >
          Ch.07 — Gia đình
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Điều hướng chính">
          {LINKS.map((l) => {
            const isActive = active === l.id
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={isActive ? 'true' : undefined}
                className="relative px-3 py-1.5 text-xs uppercase tracking-[0.2em] transition-all"
                style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.6)' }}
              >
                {isActive && (
                  <span
                    className="absolute inset-x-1 -bottom-0.5 h-px bg-white"
                    aria-hidden="true"
                  />
                )}
                <span className="transition-colors duration-200 hover:text-white">
                  {l.label}
                </span>
              </a>
            )
          })}
        </nav>

        <a
          href="/chat"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/60 hover:text-white"
        >
          Hỏi đáp AI
        </a>
      </div>
    </header>
  )
}
