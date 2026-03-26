import { readFile } from "fs/promises";
import { join } from "path";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getProjectRoot } from "@/lib/env";
import { readDailyMetrics, summarizeEvents, getMetricsRange } from "@/lib/parsers/metrics-parser";

export const dynamic = "force-dynamic";

async function readPatterns(projectRoot: string): Promise<string | null> {
  try {
    return await readFile(join(projectRoot, ".claude", "memory", "patterns.md"), "utf-8");
  } catch {
    return null;
  }
}

export default async function LearningPage() {
  const projectRoot = getProjectRoot();
  const patterns = await readPatterns(projectRoot);
  const trend = await getMetricsRange(projectRoot, 7);
  const hasData = trend.some((t) => t.summary.totalEvents > 0);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          자동 학습 루프
        </h1>
      </div>

      {/* 피드백 루프 시각화 */}
      <GlassCard className="p-8 mb-8">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="px-4 py-3 bg-sky-500/10 border border-sky-500/20 rounded-lg text-center">
            <MaterialIcon icon="analytics" className="text-sky-400" />
            <p className="text-xs font-mono text-sky-400 mt-1">metrics-collector</p>
          </div>
          <MaterialIcon icon="arrow_forward" className="text-slate-500" />
          <div className="px-4 py-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center">
            <MaterialIcon icon="description" className="text-purple-400" />
            <p className="text-xs font-mono text-purple-400 mt-1">memory/patterns.md</p>
          </div>
          <MaterialIcon icon="arrow_forward" className="text-slate-500" />
          <div className="px-4 py-3 bg-tertiary/10 border border-tertiary/20 rounded-lg text-center">
            <MaterialIcon icon="shield" className="text-tertiary" />
            <p className="text-xs font-mono text-tertiary mt-1">smart-guard + pattern-check</p>
          </div>
          <MaterialIcon icon="replay" className="text-primary" />
        </div>
        <p className="text-center text-xs text-slate-500 mt-4">
          수집 → 패턴 축적 → 가드 강화 → 재수집 (자동 학습 루프)
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 패턴 파일 */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon icon="description" size="sm" className="text-purple-400" />
            <h3 className="text-sm font-bold text-on-surface">학습 패턴</h3>
            <span className="text-[10px] font-mono text-slate-500 ml-auto">
              .claude/memory/patterns.md
            </span>
          </div>
          {patterns ? (
            <pre className="p-3 bg-surface-container rounded-lg text-[11px] text-on-surface-variant font-mono overflow-x-auto max-h-64 overflow-y-auto whitespace-pre-wrap">
              {patterns}
            </pre>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              아직 학습된 패턴이 없습니다
              <p className="text-[10px] mt-1">/learn save 로 패턴을 저장하세요</p>
            </div>
          )}
        </GlassCard>

        {/* 학습 효과 */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MaterialIcon icon="trending_up" size="sm" className="text-tertiary" />
            <h3 className="text-sm font-bold text-on-surface">학습 효과</h3>
          </div>
          {hasData ? (
            <div className="space-y-3">
              {trend.map((t) => (
                <div key={t.date} className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-500 w-20">{t.date.slice(5)}</span>
                  <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-tertiary rounded-full"
                      style={{ width: `${t.summary.successRate}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-on-surface-variant w-10 text-right">
                    {t.summary.successRate}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-sm">
              메트릭 데이터가 쌓이면 학습 효과를 확인할 수 있습니다
            </div>
          )}
        </GlassCard>
      </div>
    </>
  );
}
