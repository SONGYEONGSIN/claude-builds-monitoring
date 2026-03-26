import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { HookLogEntry } from "@/types/hook";
import type { DailySummary } from "@/types/metrics";

interface HookDetailPanelProps {
  summary: DailySummary | null;
  hookLogs: HookLogEntry[];
}

const HOOK_META: Record<string, { label: string; icon: string; phase: string }> = {
  prettier: { label: "Prettier Format", icon: "format_paint", phase: "PostToolUse" },
  eslint: { label: "ESLint Fix", icon: "rule", phase: "PostToolUse" },
  typecheck: { label: "TypeScript Check", icon: "code", phase: "PostToolUse" },
  "test-runner": { label: "Test Runner", icon: "science", phase: "PostToolUse" },
};

const IGNORE_LINE = /^(INPUT:|HOOK TRIGGERED|FILE_PATH:|PRETTIER DONE|Checking:|Running:)/;

function extractLastError(lines: string[]): string | null {
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (IGNORE_LINE.test(line)) continue;
    // "0 errors" 는 실제 오류가 아님
    if (/\(0 errors?,/.test(line)) continue;
    if (/exit[= ]+[1-9]|BLOCKED|TS\d{4}|\berrors?\b.*found|\bfailed\b|\d+ problems?\s*\([1-9]\d* errors?/i.test(line)) {
      return line.slice(0, 120);
    }
  }
  return null;
}

export function HookDetailPanel({ summary, hookLogs }: HookDetailPanelProps) {
  const failCounts: Record<string, number> = {
    prettier: summary?.prettierFail ?? 0,
    eslint: summary?.eslintFail ?? 0,
    typecheck: summary?.typecheckFail ?? 0,
    "test-runner": summary?.testFail ?? 0,
  };

  return (
    <section className="mb-12">
      <h2 className="font-headline text-xl font-bold text-on-surface mb-6">
        훅 상세 현황
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(HOOK_META).map(([key, meta]) => {
          const log = hookLogs.find((l) => l.name === key);
          const fails = failCounts[key] ?? 0;
          const total = summary?.totalEvents ?? 0;
          const isHealthy = fails === 0;
          const lastError = log ? extractLastError(log.lastLines) : null;

          return (
            <GlassCard
              key={key}
              glow={!isHealthy ? "error" : log?.hasError ? "warning" : undefined}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MaterialIcon
                    icon={meta.icon}
                    size="sm"
                    className={isHealthy ? "text-tertiary" : "text-error"}
                  />
                  <span className="text-xs font-bold text-on-surface">
                    {meta.label}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                    isHealthy
                      ? "bg-tertiary/10 text-tertiary"
                      : "bg-error/10 text-error"
                  }`}
                >
                  {isHealthy ? "정상" : `${fails}건 실패`}
                </span>
              </div>

              <div className="text-[10px] text-slate-500 mb-2">
                {meta.phase} · {total > 0 ? `${total - fails}/${total} 통과` : "데이터 없음"}
              </div>

              {/* 실패 사유 */}
              {lastError && (
                <div className="mt-2 p-2 bg-error/5 rounded-sm border border-error/10">
                  <div className="flex items-center gap-1 mb-1">
                    <MaterialIcon icon="error" size="xs" className="text-error" />
                    <span className="text-[10px] font-bold text-error">최근 오류</span>
                  </div>
                  <p className="text-[10px] text-error/80 font-mono break-all">
                    {lastError}
                  </p>
                </div>
              )}

              {isHealthy && !lastError && (
                <div className="mt-2 flex items-center gap-1">
                  <MaterialIcon icon="check_circle" size="xs" className="text-tertiary" />
                  <span className="text-[10px] text-tertiary">오류 없음</span>
                </div>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* PreToolUse + Stop 훅 */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Command Guard", icon: "shield", phase: "PreToolUse", desc: "위험 명령 차단" },
          { label: "Smart Guard", icon: "psychology", phase: "PreToolUse", desc: "학습 패턴 기반 검증" },
          { label: "Design Lint", icon: "palette", phase: "PostToolUse", desc: "하드코딩 색상 감지" },
          { label: "Pattern Check", icon: "checklist", phase: "PostToolUse", desc: "학습 패턴 준수 확인" },
          { label: "Metrics Collector", icon: "analytics", phase: "PostToolUse", desc: "메트릭 자동 수집" },
          { label: "Debate Trigger", icon: "forum", phase: "PostToolUse", desc: "자동 토론 트리거" },
          { label: "Uncommitted Warn", icon: "warning", phase: "Stop", desc: "미커밋 변경 경고" },
          { label: "Session Review", icon: "rate_review", phase: "Stop", desc: "세션 품질 리뷰" },
          { label: "Session Log", icon: "description", phase: "Stop", desc: "세션 로그 저장" },
        ].map((hook) => (
          <div
            key={hook.label}
            className="flex items-center gap-3 p-3 bg-surface-container/50 rounded-lg"
          >
            <MaterialIcon icon={hook.icon} size="sm" className="text-slate-500" />
            <div>
              <span className="text-xs font-medium text-on-surface">{hook.label}</span>
              <p className="text-[10px] text-slate-500">
                {hook.phase} · {hook.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
