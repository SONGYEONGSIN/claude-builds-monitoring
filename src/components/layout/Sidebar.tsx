"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PulsingDot } from "@/components/ui/PulsingDot";

const MENU_SECTIONS = [
  {
    label: "개요",
    items: [
      { href: "/dashboard", icon: "dashboard", label: "대시보드" },
    ],
  },
  {
    label: "1. Orchestration",
    items: [
      { href: "/orchestrators", icon: "account_tree", label: "오케스트레이터" },
    ],
  },
  {
    label: "2. Claude Code CLI",
    items: [
      { href: "/hooks", icon: "bolt", label: "훅 파이프라인 (14)" },
      { href: "/skills", icon: "extension", label: "스킬 (15)" },
      { href: "/agents", icon: "smart_toy", label: "에이전트 (11)" },
      { href: "/rules", icon: "gavel", label: "규칙 (4)" },
    ],
  },
  {
    label: "3. 통신 & 학습",
    items: [
      { href: "/bus", icon: "hub", label: "통신 버스" },
      { href: "/learning", icon: "psychology", label: "학습 루프" },
    ],
  },
  {
    label: "시스템",
    items: [
      { href: "/logs", icon: "terminal", label: "빌드 로그" },
      { href: "/settings", icon: "settings", label: "설정" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full hidden md:flex flex-col pt-20 pb-6 w-64 bg-background/90 backdrop-blur-2xl border-r border-primary/5 z-40 overflow-y-auto">
      <div className="px-6 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
            <MaterialIcon icon="memory" className="text-on-primary" filled />
          </div>
          <div>
            <h3 className="font-headline font-black text-primary text-sm">
              Claude-builds
            </h3>
            <p className="text-[10px] text-slate-500">
              모니터링 시스템
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-4 text-sm font-medium">
        {MENU_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-4 mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary shadow-[0_0_15px_rgba(58,223,250,0.1)]"
                        : "text-slate-500 hover:bg-slate-800/50 hover:text-slate-300"
                    }`}
                  >
                    <MaterialIcon icon={item.icon} size="sm" />
                    <span className="text-xs">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 mt-auto">
        <div className="flex flex-col gap-2 px-2 text-[10px] text-slate-500">
          <div className="flex items-center gap-2">
            <PulsingDot color="tertiary" />
            <span>시스템 상태: 정상</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
