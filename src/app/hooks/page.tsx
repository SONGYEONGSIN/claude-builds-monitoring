import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getSelectedProject } from "@/lib/env";
import { readDailyMetrics, summarizeEvents } from "@/lib/parsers/metrics-parser";
import { readHookLogs } from "@/lib/parsers/hook-log-parser";

export const dynamic = "force-dynamic";

const ALL_HOOKS = [
  { name: "command-guard.sh", phase: "PreToolUse", icon: "shield", desc: "위험 명령 차단 (force push, db reset 등)", blocking: true },
  { name: "smart-guard.sh", phase: "PreToolUse", icon: "psychology", desc: "학습 패턴 기반 2차 검증 (memory/patterns.md)", blocking: true },
  { name: "prettier-format.sh", phase: "PostToolUse", icon: "format_paint", desc: "코드 포맷팅 자동 수정", blocking: false },
  { name: "eslint-fix.sh", phase: "PostToolUse", icon: "rule", desc: "린트 자동 수정", blocking: false },
  { name: "typecheck.sh", phase: "PostToolUse", icon: "code", desc: "TypeScript 타입 체크", blocking: false },
  { name: "test-runner.sh", phase: "PostToolUse", icon: "science", desc: "관련 테스트 자동 실행", blocking: false },
  { name: "metrics-collector.sh", phase: "PostToolUse", icon: "analytics", desc: "메트릭 자동 수집 → daily JSON", blocking: false },
  { name: "pattern-check.sh", phase: "PostToolUse", icon: "checklist", desc: "학습 패턴 준수 확인 (비차단)", blocking: false },
  { name: "design-lint.sh", phase: "PostToolUse", icon: "palette", desc: "하드코딩 색상 감지 (비차단)", blocking: false },
  { name: "debate-trigger.sh", phase: "PostToolUse", icon: "forum", desc: "충돌 패턴 감지 → 자동 토론", blocking: false },
  { name: "uncommitted-warn.sh", phase: "Stop", icon: "warning", desc: "미커밋 변경사항 경고", blocking: false },
  { name: "session-review.sh", phase: "Stop", icon: "rate_review", desc: "세션 품질 종합 리뷰 + 학습 제안", blocking: false },
  { name: "session-log.sh", phase: "Stop", icon: "description", desc: "세션 로그 + 메트릭 요약 저장", blocking: false },
  { name: "message-bus.sh", phase: "유틸리티", icon: "hub", desc: "에이전트 간 메시지 전송/수신/아카이브", blocking: false },
];

const PHASE_COLORS: Record<string, string> = {
  PreToolUse: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  PostToolUse: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  Stop: "text-red-400 bg-red-500/10 border-red-500/20",
  "유틸리티": "text-slate-400 bg-slate-500/10 border-slate-500/20",
};

export default async function HooksPage() {
  const projectRoot = await getSelectedProject();
  const daily = await readDailyMetrics(projectRoot);
  const summary = daily && daily.events.length > 0 ? summarizeEvents(daily.events) : null;
  const hookLogs = await readHookLogs();

  const phases = ["PreToolUse", "PostToolUse", "Stop", "유틸리티"];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          훅 파이프라인
        </h1>
        {summary && (
          <div className="flex items-center gap-4 text-xs">
            <span className="text-tertiary">성공률 {summary.successRate}%</span>
            <span className="text-on-surface-variant">오늘 {summary.totalEvents}건</span>
          </div>
        )}
      </div>

      {/* 파이프라인 플로우 */}
      {summary && (
        <GlassCard className="p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: "Prettier", fail: summary.prettierFail },
              { label: "ESLint", fail: summary.eslintFail },
              { label: "TypeCheck", fail: summary.typecheckFail },
              { label: "Test", fail: summary.testFail },
            ].map((h) => {
              const pass = summary.totalEvents - h.fail;
              const pct = summary.totalEvents > 0 ? Math.round((pass / summary.totalEvents) * 100) : 0;
              return (
                <div key={h.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-on-surface">{h.label}</span>
                    <span className={h.fail > 0 ? "text-error" : "text-tertiary"}>{pct}%</span>
                  </div>
                  <ProgressBar value={pct} color={h.fail > 0 ? "error" : "tertiary"} />
                  {h.fail > 0 && (
                    <p className="text-[10px] text-error mt-1">{h.fail}건 실패</p>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* 훅별 상세 */}
      {phases.map((phase) => {
        const hooks = ALL_HOOKS.filter((h) => h.phase === phase);
        return (
          <section key={phase} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-sm border ${PHASE_COLORS[phase]}`}>
                {phase}
              </span>
              <span className="text-xs text-slate-500">{hooks.length}개</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {hooks.map((hook) => {
                const log = hookLogs.find((l) => hook.name.startsWith(l.name));
                return (
                  <GlassCard
                    key={hook.name}
                    glow={log?.hasError ? "error" : undefined}
                    className="p-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <MaterialIcon icon={hook.icon} size="sm" className="text-on-surface-variant" />
                      <span className="text-xs font-bold text-on-surface font-mono">{hook.name}</span>
                      {hook.blocking && (
                        <span className="text-[8px] px-1 py-0.5 bg-error/10 text-error rounded-sm border border-error/20">차단</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mb-2">{hook.desc}</p>
                    {log && (
                      <div className="text-[10px] text-slate-500">
                        {log.hasError ? (
                          <span className="text-error">오류 감지됨</span>
                        ) : log.lastModified ? (
                          <span className="text-tertiary">최근 실행: {new Date(log.lastModified).toLocaleString("ko-KR")}</span>
                        ) : null}
                      </div>
                    )}
                  </GlassCard>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
