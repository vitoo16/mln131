'use client'

import { SmoothScroll } from '@/components/smooth-scroll'
import { SiteNav } from '@/components/site-nav'
import { HeroSection } from '@/components/hero-section'
import { FunctionsSection } from '@/components/functions-section'
import { FoundationsSection } from '@/components/foundations-section'
import { FamilyBuildingGame } from '@/components/family-building-game'
import { ConclusionSection } from '@/components/conclusion-section'

export default function Page() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-[#F9F6F0] text-[#1C1C1C]">
        <SiteNav />
        <HeroSection />
        <FunctionsSection />
        <FoundationsSection />
        <FamilyBuildingGame />
        <ConclusionSection />
      </main>
    </SmoothScroll>
  )
}
