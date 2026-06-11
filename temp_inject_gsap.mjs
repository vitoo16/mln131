import { readFileSync, writeFileSync } from 'fs';
const file = 'C:/Users/viett/Downloads/mln131/components/family-building-game.tsx';
let content = readFileSync(file, 'utf8');

// Normalize to find the marker
const startMarker = "return () => window.clearInterval(timer) }, [phase, presentationMode])";
const startIdx = content.indexOf(startMarker);
console.log('startIdx:', startIdx);
if (startIdx === -1) {
  // Try with \r\n
  const altMarker = "return () => window.clearInterval(timer)\r\n }, [phase, presentationMode])\r\n\r\n ";
  const altIdx = content.indexOf(altMarker);
  console.log('altIdx:', altIdx);
  if (altIdx !== -1) {
    const replaceStart = altIdx + altMarker.length;
    const insert = buildInsert();
    content = content.substring(0, altIdx + "return () => window.clearInterval(timer)\r\n }, [phase, presentationMode])\r\n\r\n".length) + insert + content.substring(replaceStart);
    writeFileSync(file, content, 'utf8');
    console.log('Inserted with alt marker');
  } else {
    console.log('No marker found, dumping context...');
    const idx = content.indexOf('const civilityLive');
    console.log('Around civilityLive:', JSON.stringify(content.substring(idx - 120, idx + 10)));
  }
} else {
  const replaceStart = startIdx + startMarker.length;
  const insert = buildInsert();
  content = content.substring(0, replaceStart) + '\n\n' + insert + content.substring(replaceStart);
  writeFileSync(file, content, 'utf8');
  console.log('Inserted successfully');
}

function buildInsert() {
  return `// ── GSAP scroll entrance ──
useGSAP(() => {
  const section = sectionRef.current
  if (!section) return

  const header = section.querySelector('.family-game__header')
  const introPanel = section.querySelector('.family-game__intro')
  const deck = section.querySelector('.family-game__deck')
  const housePanel = section.querySelector('.family-game__house-panel')
  const cards = section.querySelectorAll<HTMLElement>('.family-game__card')

  const ctx = gsap.context(() => {
    if (header) {
      gsap.set(header, { opacity: 0, y: 24 })
      gsap.to(header, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: header, start: 'top 88%', end: 'top 50%', scrub: 1 },
      })
    }
    if (introPanel) {
      gsap.set(introPanel, { opacity: 0, y: 30, scale: 0.97 })
      gsap.to(introPanel, {
        opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'back.out(1.2)',
        scrollTrigger: { trigger: introPanel, start: 'top 88%', end: 'top 55%', scrub: 1 },
      })
    }
    if (deck) {
      gsap.set(deck, { opacity: 0, y: 24 })
      gsap.to(deck, {
        opacity: 1, y: 0, duration: 0.65, ease: 'power3.out',
        scrollTrigger: { trigger: deck, start: 'top 85%', end: 'top 50%', scrub: 1 },
      })
    }
    if (housePanel) {
      gsap.set(housePanel, { opacity: 0, x: 30 })
      gsap.to(housePanel, {
        opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: housePanel, start: 'top 85%', end: 'top 50%', scrub: 1 },
      })
    }
    if (cards.length) {
      gsap.set(cards, { opacity: 0, y: 18 })
      gsap.to(cards, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        stagger: 0.06, delay: 0.2,
        scrollTrigger: { trigger: deck ?? section, start: 'top 82%', end: 'top 45%', scrub: 1 },
      })
    }
  }, section)

  return () => ctx.revert()
}, { scope: sectionRef })

// ── Animate card arrival when a correct card is placed ──
useLayoutEffect(() => {
  if (!arrivingId) return
  const section = sectionRef.current
  if (!section) return
  const el = section.querySelector('[aria-pressed="true"][aria-label*="' + arrivingId + '"]') as HTMLElement | null
  const ctx = gsap.context(() => {
    if (el) {
      gsap.fromTo(el,
        { scale: 0.92, y: 8 },
        { scale: 1, y: 0, duration: 0.45, ease: 'back.out(2)' }
      )
    }
  }, section)
  return () => ctx.revert()
}, [arrivingId])

// ── Animate feedback panel ──
useLayoutEffect(() => {
  if (!feedback) return
  const section = sectionRef.current
  if (!section) return
  const el = section.querySelector('.family-game__feedback') as HTMLElement | null
  if (!el) return
  const ctx = gsap.context(() => {
    gsap.fromTo(el,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
    )
  }, section)
  return () => ctx.revert()
}, [feedback?.message])

// ── Animate quiz/event panel entrance ──
useLayoutEffect(() => {
  if (!activeQuiz && !activeEvent) return
  const section = sectionRef.current
  if (!section) return
  const el = section.querySelector('.family-game__quiz') as HTMLElement | null
  if (!el) return
  const ctx = gsap.context(() => {
    gsap.fromTo(el,
      { opacity: 0, y: 16, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.3)' }
    )
  }, section)
  return () => ctx.revert()
}, [activeQuiz?.id, activeEvent?.id])

// ── Animate result dialog ──
useLayoutEffect(() => {
  if (phase !== 'finished') return
  const section = sectionRef.current
  if (!section) return
  const el = section.querySelector('.family-game__result') as HTMLElement | null
  if (!el) return
  const ctx = gsap.context(() => {
    gsap.fromTo(el,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.2)' }
    )
  }, section)
  return () => ctx.revert()
}, [phase])

const civilityLive = useMemo(`;
}
