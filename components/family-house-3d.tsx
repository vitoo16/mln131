'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HOUSE_PARTS, getPartProgress } from '@/lib/family-game-data'

/** Tọa độ isometric cố định — mọi phần căn giữa cx=140 */
const CX = 140
const DX = 22
const DY = 11

// Mặt trước thân nhà
const W = 80
const H = 72
const FL = { x: CX - W / 2, y: 252 }
const FR = { x: CX + W / 2, y: FL.y }
const TL = { x: FL.x, y: FL.y - H }
const TR = { x: FR.x, y: FR.y - H }

// Mặt phải (chiều sâu)
const BR = { x: FR.x + DX, y: FR.y - DY }
const TRB = { x: TR.x + DX, y: TR.y - DY }
const BL = { x: TL.x + DX, y: TL.y - DY }

// Đỉnh mái
const PEAK = { x: CX, y: TL.y - 36 }
const PEAK_B = { x: PEAK.x + DX, y: PEAK.y - DY }
const BBL = { x: FL.x + DX, y: FL.y - DY }

type FamilyHouse3DProps = {
  placedCorrect: string[]
  glow: boolean
  complete: boolean
  arrivingId?: string | null
}

export function FamilyHouse3D({ placedCorrect, glow, complete, arrivingId }: FamilyHouse3DProps) {
  const foundation = getPartProgress(placedCorrect, 'foundation')
  const pillar = getPartProgress(placedCorrect, 'pillar')
  const roof = getPartProgress(placedCorrect, 'roof')

  const hasFoundation = foundation.placed.length > 0
  const hasWalls = foundation.placed.length >= 2
  const hasDoor = foundation.placed.length >= 3
  const foundationFull = foundation.complete

  const leftPillar = pillar.placed.length >= 1
  const rightPillar = pillar.placed.length >= 2

  const roofStart = roof.placed.length >= 1
  const roofFull = roof.complete

  const buildLevel =
    (foundation.placed.length > 0 ? 1 : 0) +
    (foundation.placed.length >= 2 ? 1 : 0) +
    (pillar.placed.length > 0 ? 1 : 0) +
    (pillar.placed.length >= 2 ? 1 : 0) +
    (roof.placed.length > 0 ? 1 : 0) +
    (roof.placed.length >= 2 ? 1 : 0)

  const foundationPad = `M ${FL.x - 8} ${FL.y + 6} L ${FR.x + 8} ${FR.y + 6} L ${BR.x + 8} ${BR.y + 6} L ${BBL.x - 8} ${BBL.y + 6} Z`

  return (
    <div className="family-game__iso-wrap relative mx-auto w-full max-w-[300px]">
      <div
        className={cn(
          'family-game__iso-scene relative aspect-[5/6] w-full transition-all duration-500',
          glow && 'family-game__house--glow',
          complete && 'family-game__house--complete',
        )}
      >
        <svg
          viewBox="0 0 280 320"
          className="h-full w-full drop-shadow-[0_16px_36px_rgba(28,28,28,0.1)]"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="fg-ground" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E8E0D4" />
              <stop offset="100%" stopColor="#D4C9B8" />
            </linearGradient>
            <linearGradient id="fg-foundation" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7A2E24" />
              <stop offset="100%" stopColor="#B84A3D" />
            </linearGradient>
            <linearGradient id="fg-wall" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFDF8" />
              <stop offset="100%" stopColor="#EDE6D8" />
            </linearGradient>
            <linearGradient id="fg-wall-side" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#DDD4C6" />
              <stop offset="100%" stopColor="#C4B8A8" />
            </linearGradient>
            <linearGradient id="fg-roof-l" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9B3A2F" />
              <stop offset="100%" stopColor="#C45A4A" />
            </linearGradient>
            <linearGradient id="fg-roof-r" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#7A2E24" />
              <stop offset="100%" stopColor="#9B3A2F" />
            </linearGradient>
            <linearGradient id="fg-window" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF8E8" />
              <stop offset="100%" stopColor="#E8D4A8" />
            </linearGradient>
            <filter id="fg-shadow" x="-15%" y="-15%" width="130%" height="130%">
              <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#1C1C1C" floodOpacity="0.12" />
            </filter>
          </defs>

          {/* Bóng đất */}
          <ellipse cx={CX} cy={272} rx={100} ry={22} fill="#1C1C1C" opacity="0.05" />
          <ellipse cx={CX} cy={268} rx={108} ry={24} fill="url(#fg-ground)" opacity="0.85" />

          {/* ── NỀN MÓNG ── */}
          <g
            className={cn(
              'family-game__iso-layer transition-all duration-700',
              hasFoundation ? 'family-game__iso-layer--visible' : 'family-game__iso-layer--hidden',
            )}
          >
            <path d={foundationPad} fill="url(#fg-foundation)" filter="url(#fg-shadow)" />
            {/* Mặt trước bệ móng */}
            <path
              d={`M ${FL.x - 8} ${FL.y + 6} L ${FR.x + 8} ${FR.y + 6} L ${FR.x + 8} ${FL.y} L ${FL.x - 8} ${FL.y} Z`}
              fill="#8B3329"
              opacity={0.5 + foundation.placed.length * 0.12}
            />
            {/* 4 viên gạch móng — căn đều trên mặt trước */}
            {HOUSE_PARTS.foundation.cardIds.map((id, i) => {
              const active = placedCorrect.includes(id)
              const bx = FL.x + 10 + i * 18
              return (
                <g
                  key={id}
                  className={cn(
                    'transition-all duration-500',
                    active ? 'family-game__iso-block--active opacity-100' : 'opacity-0',
                    arrivingId === id && 'family-game__iso-block--pop',
                  )}
                >
                  <rect x={bx} y={FL.y - 2} width={14} height={5} rx={0.5} fill="#C45A4A" />
                </g>
              )
            })}
          </g>

          {/* ── CỘT TRÁI (sát góc nhà) ── */}
          <g
            className={cn(
              'family-game__iso-layer transition-all duration-700',
              leftPillar ? 'family-game__iso-layer--visible' : 'family-game__iso-layer--hidden',
            )}
          >
            <path
              d={`M ${FL.x} ${FL.y} L ${FL.x + 10} ${FL.y} L ${FL.x + 10} ${TL.y} L ${FL.x} ${TL.y} Z`}
              fill="#9B3A2F"
            />
            <path
              d={`M ${FL.x + 10} ${FL.y} L ${FL.x + 10 + DX * 0.4} ${FL.y - DY * 0.4} L ${FL.x + 10 + DX * 0.4} ${TL.y - DY * 0.4} L ${FL.x + 10} ${TL.y} Z`}
              fill="#7A2E24"
              opacity="0.85"
            />
          </g>

          {/* ── CỘT PHẢI ── */}
          <g
            className={cn(
              'family-game__iso-layer transition-all duration-700',
              rightPillar ? 'family-game__iso-layer--visible' : 'family-game__iso-layer--hidden',
            )}
          >
            <path
              d={`M ${FR.x - 10} ${FR.y} L ${FR.x} ${FR.y} L ${FR.x} ${TR.y} L ${FR.x - 10} ${TR.y} Z`}
              fill="#8B3329"
            />
            <path
              d={`M ${FR.x} ${FR.y} L ${FR.x + DX * 0.4} ${FR.y - DY * 0.4} L ${FR.x + DX * 0.4} ${TR.y - DY * 0.4} L ${FR.x} ${TR.y} Z`}
              fill="#7A2E24"
              opacity="0.3"
            />
          </g>

          {/* ── THÂN NHÀ ── */}
          <g
            className={cn(
              'family-game__iso-layer transition-all duration-800',
              hasWalls ? 'family-game__iso-layer--visible' : 'family-game__iso-layer--hidden',
            )}
            filter="url(#fg-shadow)"
          >
            {/* Mặt phải */}
            <path
              d={`M ${FR.x} ${FR.y} L ${BR.x} ${BR.y} L ${TRB.x} ${TRB.y} L ${TR.x} ${TR.y} Z`}
              fill="url(#fg-wall-side)"
            />
            {/* Mặt trước */}
            <path
              d={`M ${FL.x} ${FL.y} L ${FR.x} ${FR.y} L ${TR.x} ${TR.y} L ${TL.x} ${TL.y} Z`}
              fill="url(#fg-wall)"
            />
            {/* Viền nền */}
            <line x1={FL.x} y1={FL.y} x2={FR.x} y2={FR.y} stroke="#9B3A2F" strokeWidth="1" opacity="0.25" />

            {/* Cửa — căn giữa */}
            <g className={cn('transition-opacity duration-500', hasDoor ? 'opacity-100' : 'opacity-25')}>
              <rect x={CX - 11} y={FL.y - 46} width={22} height={46} rx={1} fill="#7A2E24" />
              <circle cx={CX + 6} cy={FL.y - 24} r={1.8} fill="#F5E6C8" />
            </g>

            {/* Cửa sổ trái — đối xứng */}
            <g className={cn('transition-opacity duration-500', foundation.placed.length >= 1 ? 'opacity-100' : 'opacity-15')}>
              <rect x={FL.x + 10} y={TL.y + 18} width={18} height={18} rx={1} fill="url(#fg-window)" stroke="#9B3A2F" strokeWidth="1.2" />
              <line x1={FL.x + 19} y1={TL.y + 18} x2={FL.x + 19} y2={TL.y + 36} stroke="#9B3A2F" strokeWidth="0.8" opacity="0.35" />
              <line x1={FL.x + 10} y1={TL.y + 27} x2={FL.x + 28} y2={TL.y + 27} stroke="#9B3A2F" strokeWidth="0.8" opacity="0.35" />
            </g>

            {/* Cửa sổ phải — đối xứng */}
            <g className={cn('transition-opacity duration-500', foundation.placed.length >= 2 ? 'opacity-100' : 'opacity-15')}>
              <rect x={FR.x - 28} y={TL.y + 18} width={18} height={18} rx={1} fill="url(#fg-window)" stroke="#9B3A2F" strokeWidth="1.2" />
              <line x1={FR.x - 19} y1={TL.y + 18} x2={FR.x - 19} y2={TL.y + 36} stroke="#9B3A2F" strokeWidth="0.8" opacity="0.35" />
              <line x1={FR.x - 28} y1={TL.y + 27} x2={FR.x - 10} y2={TL.y + 27} stroke="#9B3A2F" strokeWidth="0.8" opacity="0.35" />
            </g>
          </g>

          {/* ── MÁI NHÀ — đối xứng, khớp đỉnh tường ── */}
          <g
            className={cn(
              'family-game__iso-layer transition-all duration-900',
              roofStart ? 'family-game__iso-layer--visible' : 'family-game__iso-layer--hidden',
            )}
          >
            {/* Mái trái */}
            <path
              d={`M ${TL.x} ${TL.y} L ${BL.x} ${BL.y} L ${PEAK_B.x} ${PEAK_B.y} L ${PEAK.x} ${PEAK.y} Z`}
              fill="url(#fg-roof-l)"
              opacity={roofFull ? 1 : 0.5}
            />
            {/* Mái phải */}
            <path
              d={`M ${TR.x} ${TR.y} L ${TRB.x} ${TRB.y} L ${PEAK_B.x} ${PEAK_B.y} L ${PEAK.x} ${PEAK.y} Z`}
              fill="url(#fg-roof-r)"
              opacity={roofFull ? 1 : 0.5}
            />
            {/* Tam giác đầu hồi — căn giữa */}
            <path
              d={`M ${TL.x} ${TL.y} L ${TR.x} ${TR.y} L ${PEAK.x} ${PEAK.y} Z`}
              fill="#B84A3D"
              opacity={roofFull ? 1 : 0.55}
            />

            {/* Ống khói — trên đỉnh mái phải, cân đối */}
            {roofFull && (
              <g className="family-game__iso-chimney">
                <path
                  d={`M ${CX + 18} ${PEAK.y + 14} L ${CX + 26} ${PEAK.y + 10} L ${CX + 26} ${PEAK.y - 2} L ${CX + 18} ${PEAK.y + 2} Z`}
                  fill="#7A2E24"
                />
                <path
                  d={`M ${CX + 26} ${PEAK.y + 10} L ${CX + 32} ${PEAK.y + 7} L ${CX + 32} ${PEAK.y - 5} L ${CX + 26} ${PEAK.y - 2} Z`}
                  fill="#6B241C"
                />
              </g>
            )}
          </g>

          {complete && (
            <circle
              cx={CX}
              cy={TL.y - 10}
              r={78}
              fill="none"
              stroke="#9B3A2F"
              strokeWidth="1"
              opacity="0.1"
              className="family-game__iso-complete-ring"
            />
          )}
        </svg>

        {roofFull && (
          <div className="family-game__smoke absolute left-[58%] top-[22%]" aria-hidden="true">
            <span /><span /><span />
          </div>
        )}

        {complete && (
          <div className="family-game__complete-badge absolute right-2 top-2 rounded-full border border-[#9B3A2F]/20 bg-[#F9F6F0] p-1.5 shadow-md">
            <Star className="size-4 fill-[#9B3A2F] text-[#9B3A2F]" />
          </div>
        )}
      </div>

      <div className="mt-3 px-2">
        <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[#1C1C1C]/45">
          <span>Xây dựng</span>
          <span className="text-[#9B3A2F]">{buildLevel}/6 tầng</span>
        </div>
        <div className="mt-1.5 flex h-1 gap-0.5 overflow-hidden rounded-full bg-[#1C1C1C]/8">
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'family-game__iso-step h-full flex-1 rounded-full transition-all duration-500',
                i < buildLevel ? 'bg-[#9B3A2F]' : 'bg-transparent',
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-[#1C1C1C]/50">
        <span className={foundationFull ? 'text-[#9B3A2F]' : ''}>
          Nền móng {foundation.placed.length}/{foundation.total}
        </span>
        <span className={pillar.complete ? 'text-[#9B3A2F]' : ''}>
          Cột {pillar.placed.length}/{pillar.total}
        </span>
        <span className={roofFull ? 'text-[#9B3A2F]' : ''}>
          Mái {roof.placed.length}/{roof.total}
        </span>
      </div>

      {foundation.placed.length > 0 && (
        <p className="mt-2 text-center text-[10px] leading-relaxed text-[#1C1C1C]/45">
          {foundationFull && !pillar.placed.length && 'Nền móng vững — tiếp theo dựng cột trụ đạo đức'}
          {pillar.placed.length > 0 && !roofFull && 'Cột trụ đang lên — hoàn thiện mái nhà hôn nhân tiến bộ'}
          {roofFull && 'Ngôi nhà hoàn chỉnh trên nền tảng giá trị gia đình tiến bộ'}
        </p>
      )}
    </div>
  )
}
