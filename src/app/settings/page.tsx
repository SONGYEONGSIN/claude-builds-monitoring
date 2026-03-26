import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getSelectedProject } from "@/lib/env";
import { readFile } from "fs/promises";
import { join } from "path";

export const dynamic = "force-dynamic";

async function safeRead(path: string): Promise<string | null> {
  try { return await readFile(path, "utf-8"); } catch { return null; }
}

export default async function SettingsPage() {
  const projectRoot = await getSelectedProject();
  const settingsJson = await safeRead(join(projectRoot, ".claude", "settings.local.json"));
  const claudeMd = await safeRead(join(projectRoot, "CLAUDE.md"));

  const checks = [
    { label: ".claude/ 디렉토리", exists: true, path: ".claude/" },
    { label: "settings.local.json", exists: !!settingsJson, path: ".claude/settings.local.json" },
    { label: "CLAUDE.md", exists: !!claudeMd, path: "CLAUDE.md" },
    { label: "agents/", exists: true, path: ".claude/agents/" },
    { label: "hooks/", exists: true, path: ".claude/hooks/" },
    { label: "skills/", exists: true, path: ".claude/skills/" },
    { label: "rules/", exists: true, path: ".claude/rules/" },
    { label: "metrics/", exists: true, path: ".claude/metrics/" },
    { label: "messages/", exists: true, path: ".claude/messages/" },
  ];

  return (
    <>
      <h1 className="font-headline text-2xl font-bold text-on-surface mb-6">설정</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 모니터링 대상 */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon icon="folder" className="text-primary" />
            <h3 className="text-sm font-bold text-on-surface">모니터링 대상 프로젝트</h3>
          </div>
          <div className="p-3 bg-surface-container rounded-lg font-mono text-xs text-primary break-all">
            {projectRoot}
          </div>
          <p className="text-[10px] text-slate-500 mt-2">
            .env.local → MONITOR_PROJECT_ROOT 로 변경 가능
          </p>
        </GlassCard>

        {/* 구성 상태 */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <MaterialIcon icon="checklist" className="text-tertiary" />
            <h3 className="text-sm font-bold text-on-surface">claude-builds 구성 상태</h3>
          </div>
          <div className="space-y-2">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center justify-between">
                <span className="text-xs text-on-surface-variant">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">{c.path}</span>
                  {c.exists ? (
                    <MaterialIcon icon="check_circle" size="xs" className="text-tertiary" />
                  ) : (
                    <MaterialIcon icon="cancel" size="xs" className="text-error" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* settings.local.json 미리보기 */}
        {settingsJson && (
          <GlassCard className="p-5 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <MaterialIcon icon="settings" className="text-secondary" />
              <h3 className="text-sm font-bold text-on-surface">settings.local.json</h3>
            </div>
            <pre className="p-3 bg-surface-container rounded-lg text-[11px] text-on-surface-variant font-mono overflow-x-auto max-h-64 overflow-y-auto">
              {settingsJson}
            </pre>
          </GlassCard>
        )}
      </div>
    </>
  );
}
