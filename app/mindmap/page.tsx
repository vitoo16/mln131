'use client'

import { useState, useCallback } from 'react'

type Node = {
  id: string
  label: string
  children?: Node[]
  color?: 'root' | 'section' | 'subsection'
}

const MINDMAP_DATA: Node = {
  id: 'root',
  label: 'Chương 7\nGia đình',
  color: 'root',
  children: [
    {
      id: 'hero',
      label: 'Khái niệm\ngia đình',
      color: 'section',
      children: [
        { id: 'hero-1', label: 'Định nghĩa', color: 'subsection' },
        { id: 'hero-2', label: 'Vị trí', color: 'subsection' },
      ],
    },
    {
      id: 'functions',
      label: 'Chức năng\ncơ bản',
      color: 'section',
      children: [
        { id: 'fn-1', label: 'Tái sản xuất\ncon người', color: 'subsection' },
        { id: 'fn-2', label: 'Kinh tế &\ntổ chức tiêu dùng', color: 'subsection' },
        { id: 'fn-3', label: 'Giáo dục', color: 'subsection' },
        { id: 'fn-4', label: 'Thỏa mãn\ntâm sinh lý', color: 'subsection' },
      ],
    },
    {
      id: 'foundations',
      label: 'Cơ sở xây\ndựng gia đình',
      color: 'section',
      children: [
        { id: 'found-1', label: 'Kinh tế – xã hội', color: 'subsection' },
        { id: 'found-2', label: 'Chính trị – pháp luật', color: 'subsection' },
        { id: 'found-3', label: 'Văn hóa', color: 'subsection' },
        { id: 'found-4', label: 'Hôn nhân tiến bộ', color: 'subsection' },
        { id: 'found-5', label: 'Liên hệ thực tiễn', color: 'subsection' },
      ],
    },
    {
      id: 'conclusion',
      label: 'Kết luận',
      color: 'section',
      children: [
        { id: 'conc-1', label: 'Nền tảng phát triển', color: 'subsection' },
        { id: 'conc-2', label: 'Xây dựng gia đình\nno ấm, bình đẳng', color: 'subsection' },
      ],
    },
  ],
}

function NodeComponent({
  node,
  depth = 0,
  isExpanded,
  onToggle,
}: {
  node: Node
  depth?: number
  isExpanded: boolean
  onToggle: (id: string) => void
}) {
  const hasChildren = node.children && node.children.length > 0
  const isRoot = node.color === 'root'
  const isSection = node.color === 'section'

  const baseClasses = isRoot
    ? 'bg-ink text-cream'
    : isSection
      ? 'bg-accent text-cream'
      : 'bg-cream border border-border text-ink'

  const sizeClasses = isRoot
    ? 'px-8 py-5 text-lg'
    : isSection
      ? 'px-5 py-3 text-sm'
      : 'px-3 py-2 text-xs'

  return (
    <div className={`${depth === 0 ? '' : 'ml-4 mt-3'}`}>
      <button
        type="button"
        onClick={() => hasChildren && onToggle(node.id)}
        className={`group relative inline-flex items-center gap-2 rounded-sm font-serif transition-all duration-200 ${baseClasses} ${sizeClasses} ${
          hasChildren ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
        }`}
      >
        {hasChildren && (
          <span
            className={`inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px] transition-transform duration-200 ${
              isExpanded ? 'rotate-45 border-cream/60 text-cream' : 'border-current text-current'
            }`}
          >
            +
          </span>
        )}
        <span className="whitespace-pre-line leading-tight">{node.label}</span>
      </button>

      {hasChildren && isExpanded && (
        <div className="relative ml-3 mt-2 border-l border-border pl-3">
          {node.children!.map((child) => (
            <NodeComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function MindmapPage() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']))

  const toggleNode = useCallback((id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-32">
        <header className="mb-16">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            Cấu trúc bài học
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[0.95] tracking-tight text-ink md:text-6xl">
            Sơ đồ tư duy
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-foreground/70">
            Tổng quan cấu trúc Chương 7 – Vấn đề gia đình trong thời kỳ quá độ lên chủ nghĩa xã hội. Nhấn vào nút + để mở rộng nhánh.
          </p>
        </header>

        <div className="grain-overlay relative rounded-sm border border-border bg-white/40 p-8 md:p-12">
          <NodeComponent
            node={MINDMAP_DATA}
            depth={0}
            isExpanded={expandedNodes.has('root')}
            onToggle={toggleNode}
          />
        </div>

        <footer className="mt-12 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
            Chủ nghĩa xã hội khoa học — Thời kỳ quá độ lên CNXH
          </p>
        </footer>
      </div>
    </main>
  )
}
