"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const MOBILE_ITEMS = [
  { href: "/dashboard", icon: "dashboard", label: "대시보드" },
  { href: "/hooks", icon: "bolt", label: "훅" },
  { href: "/agents", icon: "smart_toy", label: "에이전트" },
  { href: "/bus", icon: "hub", label: "통신" },
  { href: "/logs", icon: "terminal", label: "로그" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 md:hidden glass border-t border-outline-variant/10 flex justify-around py-2 px-4">
      {MOBILE_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 ${
              isActive ? "text-primary" : "text-slate-500"
            }`}
          >
            <MaterialIcon icon={item.icon} size="sm" />
            <span className="text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
