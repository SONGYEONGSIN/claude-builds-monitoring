"use client";

import { PulsingDot } from "@/components/ui/PulsingDot";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { ProjectSwitcher } from "./ProjectSwitcher";

interface HeaderProps {
  projects: string[];
  currentProject: string;
}

export function Header({ projects, currentProject }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_20px_rgba(8,14,29,0.5)]">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold tracking-tighter text-primary drop-shadow-[0_0_8px_rgba(58,223,250,0.5)] font-headline">
          Claude-builds
        </span>
        <ProjectSwitcher projects={projects} current={currentProject} />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center px-3 py-1 bg-surface-container rounded-lg border border-outline-variant/20 gap-2">
          <PulsingDot color="tertiary" />
          <span className="text-[10px] uppercase font-bold text-tertiary tracking-widest">
            SYSTEM ONLINE
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-primary transition-all active:scale-95">
            <MaterialIcon icon="sensors" />
          </button>
          <button className="p-2 text-slate-400 hover:text-primary transition-all active:scale-95">
            <MaterialIcon icon="notifications" />
          </button>
          <button className="p-2 text-slate-400 hover:text-primary transition-all active:scale-95">
            <MaterialIcon icon="account_circle" />
          </button>
        </div>
      </div>
    </header>
  );
}
