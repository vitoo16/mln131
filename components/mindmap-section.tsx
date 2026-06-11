"use client";

import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
  useLayoutEffect,
} from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ChevronRight, ChevronDown, X, BookOpen } from "lucide-react";

type MindMapNode = {
  id: string;
  label: string;
  detail?: string;
  content?: string;
  color?: string;
  children?: MindMapNode[];
};

const DATA: MindMapNode = {
  id: "root",
  label: "Chương 7",
  detail: "Gia đình",
  content:
    "Gia đình là một trong những tổ chức xã hội cơ bản nhất, đóng vai trò nền tảng trong sự phát triển của cá nhân và toàn xã hội.",
  color: "#9B3A2F",
  children: [
    {
      id: "khai-niem",
      label: "Khái niệm",
      detail: "Định nghĩa & vai trò",
      content:
        "Gia đình là cộng đồng người sống chung, gắn bó với nhau bởi các mối quan hệ hôn nhân, huyết thống, nuôi dưỡng, cùng chia sẻ đời sống vật chất và tinh thần.",
      color: "#6366f1",
      children: [
        {
          id: "kn-1",
          label: "Cộng đồng XH đặc biệt",
          detail: "Quan hệ: hôn nhân, huyết thống, nuôi dưỡng",
          content:
            "Gia đình là cộng đồng xã hội đặc biệt vì các mối quan hệ trong gia đình hình thành tự nhiên (huyết thống) hoặc từ sự lựa chọn tự nguyện (hôn nhân), khác với các tổ chức xã hội khác.",
          color: "#818cf8",
        },
        {
          id: "kn-2",
          label: "Tế bào của xã hội",
          detail: "Nơi sinh ra, nuôi dưỡng, giáo dục",
          content:
            'Gia đình được xem là "tế bào" của xã hội vì là môi trường đầu tiên hình thành nhân cách, giá trị đạo đức và kỹ năng sống của mỗi cá nhân.',
          color: "#818cf8",
        },
      ],
    },
    {
      id: "vi-tri",
      label: "Vị trí",
      detail: "Tầm quan trọng",
      content:
        "Vị trí của gia đình trong xã hội được thể hiện qua nhiều vai trò quan trọng: tế bào xã hội, tổ ấm cá nhân, cầu nối văn hóa và yếu tố phát triển đất nước.",
      color: "#0891b2",
      children: [
        {
          id: "vt-1",
          label: "Tế bào XH",
          detail: "Quyết định ổn định & phát triển",
          content:
            "Là đơn vị cơ sở của xã hội, gia đình quyết định sự ổn định chính trị, phát triển kinh tế và văn hóa của cả một quốc gia.",
          color: "#22d3ee",
        },
        {
          id: "vt-2",
          label: "Tổ ấm cá nhân",
          detail: "Đáp ứng tình cảm, vật chất, tinh thần",
          content:
            "Gia đình là nơi thỏa mãn nhu cầu tình cảm, vật chất và tinh thần của mỗi thành viên, tạo nên nền tảng hạnh phúc cá nhân.",
          color: "#22d3ee",
        },
        {
          id: "vt-3",
          label: "Cầu nối",
          detail: "Truyền giá trị văn hóa, đạo đức",
          content:
            "Gia đình đóng vai trò cầu nối giữa các thế hệ, truyền thụ các giá trị văn hóa, đạo đức, truyền thống từ thế hệ này sang thế hệ khác.",
          color: "#22d3ee",
        },
        {
          id: "vt-4",
          label: "Phát triển đất nước",
          detail: "Gia đình bền vững → quốc gia",
          content:
            "Sự phát triển của đất nước gắn liền với sự phát triển của từng gia đình. Gia đình bền vững là nền tảng cho quốc gia thịnh vượng.",
          color: "#22d3ee",
        },
      ],
    },
    {
      id: "chuc-nang",
      label: "Chức năng",
      detail: "4 chức năng cơ bản",
      content:
        "Gia đình thực hiện 4 chức năng cơ bản: tái sản xuất dân số, kinh tế, giáo dục và thỏa mãn nhu cầu tâm sinh lý.",
      color: "#059669",
      children: [
        {
          id: "cn-1",
          label: "Tái sản xuất",
          detail: "Duy trì nòi giống, sức lao động",
          content:
            "Chức năng sinh sản duy trì nòi giống loài người và cung cấp lực lượng lao động cho xã hội, đảm bảo sự phát triển liên tục của dân cư.",
          color: "#34d399",
        },
        {
          id: "cn-2",
          label: "Kinh tế",
          detail: "Đơn vị kinh tế cơ sở",
          content:
            "Gia đình là đơn vị kinh tế cơ sở, tổ chức sản xuất, phân phối và tiêu dùng, đóng góp vào sự phát triển kinh tế quốc dân.",
          color: "#34d399",
        },
        {
          id: "cn-3",
          label: "Giáo dục",
          detail: "Nhân cách, đạo đức, văn hóa",
          content:
            "Gia đình là môi trường giáo dục đầu tiên, hình thành nhân cách, đạo đức, lối sống và các kỹ năng cần thiết cho cuộc sống.",
          color: "#34d399",
        },
        {
          id: "cn-4",
          label: "Tâm sinh lý",
          detail: "Yêu thương, cân bằng tâm lý",
          content:
            "Gia đình đáp ứng nhu cầu tình cảm, tạo sự ấm áp, yêu thương và giúp mỗi thành viên cân bằng tâm lý, hạnh phúc.",
          color: "#34d399",
        },
      ],
    },
    {
      id: "co-so",
      label: "Cơ sở",
      detail: "Xây dựng gia đình",
      content:
        "Việc xây dựng gia đình dựa trên nhiều cơ sở: kinh tế - xã hội, chính trị - pháp luật, văn hóa, hôn nhân tiến bộ và thực tiễn Việt Nam.",
      color: "#d97706",
      children: [
        {
          id: "cs-1",
          label: "Kinh tế - XH",
          detail: "Lực lượng sản xuất",
          content:
            "Điều kiện kinh tế và vị trí xã hội của các thành viên là cơ sở hình thành và phát triển gia đình, quyết định chất lượng cuộc sống.",
          color: "#fbbf24",
        },
        {
          id: "cs-2",
          label: "Chính trị - PL",
          detail: "Luật H&G, bình đẳng giới",
          content:
            "Hệ thống pháp luật về hôn nhân và gia đình, cùng chính sách bình đẳng giới, là cơ sở pháp lý bảo vệ và phát triển gia đình.",
          color: "#fbbf24",
        },
        {
          id: "cs-3",
          label: "Văn hóa",
          detail: "Hiếu thảo, đoàn kết, đạo đức",
          content:
            "Các giá trị văn hóa truyền thống như hiếu thảo, đoàn kết, tương trợ, đạo đức là nền tảng tinh thần của gia đình Việt Nam.",
          color: "#fbbf24",
        },
        {
          id: "cs-4",
          label: "Hôn nhân tiến bộ",
          detail: "Tự nguyện, bình đẳng",
          content:
            "Hôn nhân tiến bộ dựa trên nguyên tắc tự nguyện, tiến bộ, một vợ một chồng, bình đẳng giới là cơ sở vững chắc cho gia đình hạnh phúc.",
          color: "#fbbf24",
        },
        {
          id: "cs-5",
          label: "Thực tiễn VN",
          detail: "Gia đình văn hóa, thách thức",
          content:
            'Thực tiễn xây dựng gia đình Việt Nam gắn với phong trào "Gia đình văn hóa", đối mặt với các thách thức từ toàn cầu hóa và thay đổi lối sống.',
          color: "#fbbf24",
        },
      ],
    },
    {
      id: "ket-luan",
      label: "Kết luận",
      detail: "Tóm lược",
      content:
        "Gia đình là nền tảng của xã hội, đóng vai trò then chốt trong sự phát triển cá nhân và quốc gia. Xây dựng gia đình bền vững là nhiệm vụ chiến lược.",
      color: "#dc2626",
      children: [
        {
          id: "kl-1",
          label: "Nền tảng",
          detail: "Phát triển bền vững",
          content:
            "Gia đình là nền tảng cho sự phát triển bền vững của cá nhân và xã hội, là hạt nhân văn hóa truyền thống.",
          color: "#f87171",
        },
        {
          id: "kl-2",
          label: "Nhiệm vụ",
          detail: "No ấm, bình đẳng, tiến bộ",
          content:
            "Xây dựng gia đình no ấm, bình đẳng, tiến bộ, hạnh phúc; thực hiện công bằng giới và bảo vệ quyền lợi các thành viên.",
          color: "#f87171",
        },
        {
          id: "kl-3",
          label: "Bối cảnh",
          detail: "Giữ gìn giá trị trong hội nhập",
          content:
            "Trong bối cảnh toàn cầu hóa, cần giữ gìn các giá trị truyền thống tốt đẹp của gia đình Việt Nam, thích ứng với những thay đổi của thời đại.",
          color: "#f87171",
        },
      ],
    },
  ],
};

function countNodes(node: MindMapNode): number {
  return 1 + (node.children?.reduce((sum, c) => sum + countNodes(c), 0) ?? 0);
}
function countLeaves(node: MindMapNode): number {
  return !node.children || node.children.length === 0
    ? 1
    : node.children.reduce((s, c) => s + countLeaves(c), 0);
}
function maxDepth(node: MindMapNode): number {
  return 1 + Math.max(0, ...(node.children?.map(maxDepth) ?? []));
}

export function MindMapSection() {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MindMapNode | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const dragInfo = useRef({
    active: false,
    startX: 0,
    startY: 0,
    scrollStartX: 0,
    scrollStartY: 0,
    moved: false,
  });

  const stats = useMemo(
    () => ({
      total: countNodes(DATA),
      leaves: countLeaves(DATA),
      depth: maxDepth(DATA),
    }),
    [],
  );

  const toggle = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => setCollapsed(new Set()), []);
  const collapseAll = useCallback(() => {
    const ids: string[] = [];
    const walk = (n: MindMapNode) => {
      if (n.children?.length) {
        ids.push(n.id);
        n.children.forEach(walk);
      }
    };
    walk(DATA);
    setCollapsed(new Set(ids));
  }, []);

  // Scroll-triggered entrance — matches Functions/Foundations pattern
  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const canvas = section.querySelector(
        ".mindmap-canvas",
      ) as HTMLElement | null;
      const rootEl = section.querySelector(
        ".mindmap-node-root",
      ) as HTMLElement | null;
      const branchEls = section.querySelectorAll<HTMLElement>(
        ".mindmap-node-branch",
      );

      if (!canvas) return;

      const ctx = gsap.context(() => {
        // Canvas fade-up
        gsap.set(canvas, { opacity: 0, y: 30 });
        gsap.to(canvas, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: canvas,
            start: "top 88%",
            end: "top 50%",
            scrub: 1,
          },
        });

        // Root node scale reveal
        if (rootEl) {
          gsap.set(rootEl, { opacity: 0, scale: 0.85, y: 20 });
          gsap.to(rootEl, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.7,
            ease: "back.out(1.4)",
            delay: 0.15,
            scrollTrigger: {
              trigger: canvas,
              start: "top 88%",
              end: "top 50%",
              scrub: 1,
            },
          });
        }

        // Branches slide from left with stagger
        if (branchEls.length) {
          gsap.set(branchEls, { opacity: 0, x: -30 });
          gsap.to(branchEls, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.08,
            delay: 0.35,
            scrollTrigger: {
              trigger: canvas,
              start: "top 88%",
              end: "top 50%",
              scrub: 1,
            },
          });
        }
      }, section);

      return () => ctx.revert();
    },
    { scope: sectionRef },
  );

  // Re-animate branches when collapsed state changes
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const branchEls = section.querySelectorAll<HTMLElement>(
      ".mindmap-node-branch",
    );
    if (!branchEls.length) return;

    const ctx = gsap.context(() => {
      gsap.set(branchEls, { opacity: 0, x: -30 });
      gsap.to(branchEls, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.06,
      });
    }, section);

    return () => ctx.revert();
  }, [collapsed]);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    const canvas = e.currentTarget;
    dragInfo.current = {
      active: true,
      startX: e.pageX,
      startY: e.pageY,
      scrollStartX: canvas.scrollLeft,
      scrollStartY: canvas.scrollTop,
      moved: false,
    };
  }, []);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const info = dragInfo.current;
      if (!info.active) return;
      const dx = e.pageX - info.startX;
      const dy = e.pageY - info.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        info.moved = true;
      }
      const canvas = document.querySelector(
        ".mindmap-canvas",
      ) as HTMLElement | null;
      if (canvas) {
        canvas.scrollLeft = info.scrollStartX - dx;
        canvas.scrollTop = info.scrollStartY - dy;
      }
    };
    const handleUp = () => {
      dragInfo.current.active = false;
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, []);

  const openPopup = useCallback((node: MindMapNode) => {
    if (dragInfo.current.moved) return;
    setSelectedNode(node);
  }, []);

  const closePopup = useCallback(() => setSelectedNode(null), []);

  useGSAP(() => {
    if (!selectedNode || !popupRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        popupRef.current,
        { opacity: 0, scale: 0.92, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.5)" },
      );
    }, popupRef);
    return () => ctx.revert();
  }, [selectedNode]);

  return (
    <section
      id="mindmap"
      ref={sectionRef}
      className={`relative w-full border-b border-border bg-cream px-4 py-20 md:px-10 md:py-28 ${isFullscreen ? "fixed inset-0 z-[60] overflow-auto bg-cream" : ""}`}
    >
      <div
        className={`mx-auto ${isFullscreen ? "max-w-[1600px] py-8" : "max-w-[1400px]"}`}
      >
        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#9B3A2F]">
              Tổng quan
            </p>
            <h2 className="mt-3 font-serif text-3xl leading-[0.95] tracking-tight text-ink md:text-5xl">
              Sơ đồ tư duy
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-foreground/60">
              Cấu trúc Chương 7 — nhấp vào nhánh/ lá để xem chi tiết.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground/45">
              <span>{stats.total} nút</span>
              <span className="h-2.5 w-px bg-border" aria-hidden="true" />
              <span>{stats.leaves} ý</span>
              <span className="h-2.5 w-px bg-border" aria-hidden="true" />
              <span>{stats.depth} cấp</span>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div
          className="mindmap-canvas"
          style={{ minHeight: 420, cursor: "grab" }}
          onMouseDown={handleCanvasMouseDown}
        >
          <HorizontalMindMap
            node={DATA}
            collapsed={collapsed}
            toggle={toggle}
            onNodeClick={openPopup}
          />
        </div>
      </div>

      {/* Popup Modal */}
      {selectedNode && (
        <div className="mindmap-popup-overlay" onClick={closePopup}>
          <div
            ref={popupRef}
            className="mindmap-popup"
            onClick={(e) => e.stopPropagation()}
            style={{ borderColor: `${selectedNode.color}30` }}
          >
            <div
              className="mindmap-popup-header"
              style={{ backgroundColor: `${selectedNode.color}12` }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: selectedNode.color }}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="font-serif text-lg font-semibold tracking-tight text-ink">
                    {selectedNode.label}
                  </h3>
                  {selectedNode.detail && (
                    <p
                      className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.15em]"
                      style={{ color: selectedNode.color }}
                    >
                      {selectedNode.detail}
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={closePopup}
                className="mindmap-popup-close"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mindmap-popup-body">
              {selectedNode.content && (
                <div className="flex gap-3">
                  <BookOpen
                    className="mt-0.5 h-4 w-4 shrink-0 text-foreground/30"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-relaxed text-foreground/70">
                    {selectedNode.content}
                  </p>
                </div>
              )}

              {selectedNode.children && selectedNode.children.length > 0 && (
                <div className="mt-4">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/35">
                    {selectedNode.children.length} mục con
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedNode.children.map((child) => (
                      <span
                        key={child.id}
                        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-white/50 px-2.5 py-1.5 text-xs font-medium text-ink/80"
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: child.color }}
                          aria-hidden="true"
                        />
                        {child.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function HorizontalMindMap({
  node,
  collapsed,
  toggle,
  depth = 0,
  onNodeClick,
}: {
  node: MindMapNode;
  collapsed: Set<string>;
  toggle: (id: string) => void;
  depth?: number;
  onNodeClick: (node: MindMapNode) => void;
}) {
  const isCollapsed = collapsed.has(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isRoot = depth === 0;
  const isLevel1 = depth === 1;

  if (isRoot) {
    return (
      <div className="flex flex-col items-center">
        {/* Root node */}
        <div
          className="mindmap-node-root"
          style={{ borderColor: node.color, backgroundColor: node.color }}
          onClick={() => onNodeClick(node)}
        >
          <div className="text-center">
            <div className="font-serif text-lg font-semibold tracking-tight text-cream md:text-xl">
              {node.label}
            </div>
            {node.detail && (
              <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cream/70">
                {node.detail}
              </div>
            )}
          </div>
        </div>

        {/* Branches */}
        {hasChildren && !isCollapsed && (
          <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-5">
            {node.children!.map((child) => (
              <HorizontalMindMap
                key={child.id}
                node={child}
                collapsed={collapsed}
                toggle={toggle}
                depth={depth + 1}
                onNodeClick={onNodeClick}
              />
            ))}
          </div>
        )}

        {/* Collapsed indicator */}
        {hasChildren && isCollapsed && (
          <div className="mt-3 flex items-center gap-2">
            <div className="h-8 w-px bg-border" aria-hidden="true" />
            <span className="font-mono text-[11px] text-foreground/40">
              {node.children!.length} nhánh — nhấp để mở
            </span>
          </div>
        )}
      </div>
    );
  }

  if (isLevel1) {
    return (
      <div
        className="mindmap-node-branch"
        style={{
          borderColor: `${node.color}40`,
          backgroundColor: `${node.color}10`,
        }}
      >
        <button
          type="button"
          onClick={() => onNodeClick(node)}
          className="flex w-full items-center gap-3"
        >
          <span
            className="h-3 w-3 shrink-0 rounded-full"
            style={{ backgroundColor: node.color }}
            aria-hidden="true"
          />
          <div className="text-left">
            <div
              className="font-serif text-base font-semibold tracking-tight"
              style={{ color: node.color }}
            >
              {node.label}
            </div>
            {node.detail && (
              <div className="mt-0.5 text-[11px] leading-snug text-foreground/50">
                {node.detail}
              </div>
            )}
          </div>
        </button>

        {/* Children — horizontal row */}
        {hasChildren && !isCollapsed && (
          <div className="mt-3 flex flex-wrap justify-start gap-2.5">
            {node.children!.map((child) => (
              <MindMapLeaf
                key={child.id}
                node={child}
                parentColor={node.color!}
                onClick={() => onNodeClick(child)}
              />
            ))}
          </div>
        )}

        {/* Collapsed indicator */}
        {hasChildren && isCollapsed && (
          <div className="mt-2 flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full bg-foreground/20"
              aria-hidden="true"
            />
            <span className="font-mono text-[10px] text-foreground/35">
              {node.children!.length} chi tiết — nhấp để mở
            </span>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function MindMapLeaf({
  node,
  parentColor,
  onClick,
}: {
  node: MindMapNode;
  parentColor: string;
  onClick: () => void;
}) {
  const leafRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useGSAP(() => {
    if (!leafRef.current) return;
    gsap.set(leafRef.current, { opacity: 0, y: 12 });
    gsap.to(leafRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      ref={leafRef}
      className="mindmap-leaf"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        borderColor: isHovered ? parentColor : undefined,
        backgroundColor: isHovered ? `${parentColor}15` : undefined,
        cursor: "pointer",
      }}
    >
      <div className="flex items-start gap-2">
        <span
          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
          style={{ backgroundColor: parentColor }}
          aria-hidden="true"
        />
        <div>
          <div className="text-sm font-medium leading-snug text-ink">
            {node.label}
          </div>
          {node.detail && (
            <div className="mt-0.5 text-[11px] leading-snug text-foreground/45">
              {node.detail}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
