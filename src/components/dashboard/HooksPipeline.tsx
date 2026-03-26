"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { DailySummary } from "@/types/metrics";

interface HooksPipelineProps {
  summary: DailySummary | null;
}

interface HookItem {
  name: string;
  pass: number;
  fail: number;
  icon: string;
  color: string;
  failFiles?: string[];
}

export function HooksPipeline({ summary }: HooksPipelineProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const hooks: HookItem[] = summary
    ? [
        { name: "Prettier", pass: summary.totalEvents - summary.prettierFail, fail: summary.prettierFail, icon: "format_paint", color: "text-sky-400" },
        { name: "ESLint", pass: summary.totalEvents - summary.eslintFail, fail: summary.eslintFail, icon: "rule", color: "text-amber-400" },
        { name: "TypeCheck", pass: summary.totalEvents - summary.typecheckFail, fail: summary.typecheckFail, icon: "code", color: "text-purple-400" },
        { name: "Test", pass: summary.totalEvents - summary.testFail, fail: summary.testFail, icon: "science", color: "text-pink-400" },
      ]
    : [];

  const totalFail = hooks.reduce((s, h) => s + h.fail, 0);

  return (
    <GlassCard className="lg:col-span-2 p-6">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="font-headline text-lg font-bold text-on-surface">
            오늘의 훅 실행 결과
          </h2>
          <p className="text-[10px] text-slate-500">
            PostToolUse (Write|Edit) · 오늘 {summary?.totalEvents ?? 0}건
          </p>
        </div>
        {totalFail > 0 ? (
          <span className="px-2 py-1 rounded-sm bg-error/10 text-error text-[10px] font-bold border border-error/20">
            {totalFail}건 실패
          </span>
        ) : summary ? (
          <span className="px-2 py-1 rounded-sm bg-tertiary/10 text-tertiary text-[10px] font-bold border border-tertiary/20">
            전체 통과
          </span>
        ) : (
          <span className="px-2 py-1 rounded-sm bg-slate-500/10 text-slate-400 text-[10px] font-bold border border-slate-500/20">
            대기
          </span>
        )}
      </div>

      {hooks.length > 0 ? (
        <>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {hooks.map((h) => {
              const isExpanded = expanded === h.name;
              const hasFail = h.fail > 0;
              return (
                <div key={h.name}>
                  <button
                    onClick={() => hasFail ? setExpanded(isExpanded ? null : h.name) : undefined}
                    className={`w-full p-3 bg-surface-container/50 rounded-lg text-left transition-all ${
                      hasFail ? "cursor-pointer hover:bg-surface-container" : ""
                    } ${isExpanded ? "ring-1 ring-error/40" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MaterialIcon icon={h.icon} size="sm" className={h.color} />
                      <span className="text-xs font-bold text-on-surface">{h.name}</span>
                      {hasFail && (
                        <MaterialIcon
                          icon={isExpanded ? "expand_less" : "expand_more"}
                          size="xs"
                          className="text-error ml-auto"
                        />
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-tertiary">{h.pass}</span>
                      <span className="text-[10px] text-slate-500">pass</span>
                      {hasFail && (
                        <>
                          <span className="text-lg font-bold text-error">{h.fail}</span>
                          <span className="text-[10px] text-slate-500">fail</span>
                        </>
                      )}
                    </div>
                    <div className="h-1 w-full bg-surface-container rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full ${hasFail ? "bg-error" : "bg-tertiary"}`}
                        style={{ width: `${(h.pass + h.fail) > 0 ? (h.pass / (h.pass + h.fail)) * 100 : 0}%` }}
                      />
                    </div>
                  </button>

                  {/* 펼침 영역: 실패 상세 */}
                  {isExpanded && (
                    <div className="mt-2 p-3 bg-error/5 border border-error/10 rounded-lg animate-fade-in">
                      <div className="flex items-center gap-1 mb-2">
                        <MaterialIcon icon="error" size="xs" className="text-error" />
                        <span className="text-[10px] font-bold text-error">{h.name} 실패 상세</span>
                      </div>
                      <p className="text-[10px] text-error/70">
                        {h.fail}건의 파일에서 {h.name} 검사 실패.
                        /hooks 페이지 또는 /tmp 로그에서 상세 확인 가능.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-outline-variant/10 text-[10px] text-slate-500">
            <div className="flex items-center gap-1">
              <MaterialIcon icon="shield" size="xs" className="text-purple-400" />
              <span>PreToolUse: command-guard · smart-guard</span>
            </div>
            <div className="flex items-center gap-1">
              <MaterialIcon icon="stop_circle" size="xs" className="text-red-400" />
              <span>Stop: uncommitted-warn · session-review · session-log</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-slate-500 text-sm">
          아직 오늘 실행된 훅이 없습니다
        </div>
      )}
    </GlassCard>
  );
}
