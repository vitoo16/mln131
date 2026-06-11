'use client'

import { useLayoutEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    ScrollTrigger.scrollerProxy(window, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll || 0
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    const raf = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      ScrollTrigger.refresh()
    }
  }, [])

  return <>{children}</>
}
