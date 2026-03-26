"use client";

import { useState } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { AgentStatus } from "@/types/agent";

interface AgentDetailSheetProps {
  agent: AgentStatus;
  onClose: () => void;
}

export function AgentDetailSheet({ agent, onClose }: AgentDetailSheetProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md h-full bg-surface-container-low border-l border-outline-variant/10 overflow-y-auto animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-surface-container-low/90 backdrop-blur-xl border-b border-outline-variant/10 p-4 flex items-center justify-between">
          <h3 className="font-headline text-lg font-bold text-on-surface">{agent.displayName}</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-on-surface transition-colors">
            <MaterialIcon icon="close" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* 상태 */}
          <div className="flex items-center gap-3">
            <StatusBadge status={agent.status} />
            {agent.uptime && <span className="text-xs text-slate-400">가동 시간: {agent.uptime}</span>}
          </div>

          {/* 설명 */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">역할</p>
            <p className="text-sm text-on-surface-variant">{agent.description}</p>
          </div>

          {/* 메시지 */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">메시지</p>
            {agent.unreadMessages > 0 ? (
              <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <MaterialIcon icon="mail" size="sm" className="text-warning" />
                  <span className="text-xs text-warning font-bold">{agent.unreadMessages}건 미읽음</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">미읽음 메시지 없음</p>
            )}
          </div>

          {/* 최근 활동 */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">최근 활동</p>
            <p className="text-xs text-on-surface-variant font-mono">
              {agent.lastActivity
                ? new Date(agent.lastActivity).toLocaleString("ko-KR")
                : "기록 없음"}
            </p>
          </div>

          {/* 모델 */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">모델</p>
            <span className="text-xs px-2 py-1 bg-surface-container rounded-sm text-primary font-mono">opus</span>
          </div>

          {/* 도구 */}
          <div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">사용 가능 도구</p>
            <div className="flex flex-wrap gap-1.5">
              {["Read", "Grep", "Glob"].map((tool) => (
                <span key={tool} className="text-[10px] px-2 py-0.5 bg-surface-container rounded-sm text-on-surface-variant font-mono">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 에이전트 카드를 클릭 가능하게 감싸는 래퍼
export function AgentCardClickable({ agent, children }: { agent: AgentStatus; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </div>
      {open && <AgentDetailSheet agent={agent} onClose={() => setOpen(false)} />}
    </>
  );
}
