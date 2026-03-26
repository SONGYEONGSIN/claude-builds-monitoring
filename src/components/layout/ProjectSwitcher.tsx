"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface ProjectSwitcherProps {
  projects: string[];
  current: string;
}

function label(path: string): string {
  return path.split("/").pop() ?? path;
}

export function ProjectSwitcher({ projects, current }: ProjectSwitcherProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (projects.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg text-xs text-on-surface-variant">
        <MaterialIcon icon="folder" size="xs" className="text-primary" />
        <span className="font-mono">{label(current)}</span>
      </div>
    );
  }

  async function switchProject(project: string) {
    await fetch("/api/project", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project }),
    });
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg text-xs hover:bg-surface-container-high transition-colors"
      >
        <MaterialIcon icon="folder" size="xs" className="text-primary" />
        <span className="font-mono text-on-surface">{label(current)}</span>
        <MaterialIcon icon={open ? "expand_less" : "expand_more"} size="xs" className="text-slate-500" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 right-0 z-50 min-w-[200px] glass-strong rounded-lg border border-outline-variant/20 shadow-xl overflow-hidden animate-fade-in">
            <p className="px-3 py-2 text-[10px] text-slate-500 uppercase tracking-wider border-b border-outline-variant/10">
              프로젝트 전환
            </p>
            {projects.map((p) => (
              <button
                key={p}
                onClick={() => switchProject(p)}
                className={`w-full text-left px-3 py-2.5 text-xs flex items-center gap-2 transition-colors ${
                  p === current
                    ? "bg-primary/10 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <MaterialIcon
                  icon={p === current ? "radio_button_checked" : "radio_button_unchecked"}
                  size="xs"
                  className={p === current ? "text-primary" : "text-slate-500"}
                />
                <span className="font-mono truncate">{label(p)}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
