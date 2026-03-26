"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const INTERVAL = 30000; // 30초

export function AutoRefresh() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(INTERVAL / 1000);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.refresh();
          return INTERVAL / 1000;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, paused]);

  return (
    <button
      onClick={() => setPaused((p) => !p)}
      className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg text-[10px] hover:bg-surface-container-high transition-colors"
      title={paused ? "자동 새로고침 재개" : "자동 새로고침 일시정지"}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${paused ? "bg-slate-500" : "bg-tertiary animate-pulse-primary"}`} />
      <span className={paused ? "text-slate-500" : "text-tertiary"}>
        {paused ? "일시정지" : `${countdown}s`}
      </span>
    </button>
  );
}
