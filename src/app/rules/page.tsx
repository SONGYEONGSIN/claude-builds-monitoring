import { readFile } from "fs/promises";
import { join } from "path";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getSelectedProject } from "@/lib/env";

export const dynamic = "force-dynamic";

const RULES = [
  { file: "conventions.md", label: "Conventions", icon: "edit_note", desc: "코드 스타일, 파일 크기, Server Action 패턴" },
  { file: "git.md", label: "Git", icon: "commit", desc: "Conventional Commits, 브랜치 네이밍, PR 규칙" },
  { file: "donts.md", label: "Don'ts", icon: "block", desc: "코드 품질, 보안, 패턴 금지 사항 (15항목)" },
  { file: "design.md", label: "Design", icon: "palette", desc: "디자인 토큰, 하드코딩 색상 금지, 공통 컴포넌트" },
];

async function readRuleFile(projectRoot: string, filename: string): Promise<string | null> {
  try {
    return await readFile(join(projectRoot, ".claude", "rules", filename), "utf-8");
  } catch {
    return null;
  }
}

export default async function RulesPage() {
  const projectRoot = await getSelectedProject();

  const rulesWithContent = await Promise.all(
    RULES.map(async (rule) => ({
      ...rule,
      content: await readRuleFile(projectRoot, rule.file),
    }))
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          규칙 (4)
        </h1>
      </div>

      <div className="space-y-4">
        {rulesWithContent.map((rule) => (
          <GlassCard key={rule.file} className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <MaterialIcon icon={rule.icon} className="text-primary" />
              <div>
                <h3 className="text-sm font-bold text-on-surface">{rule.label}</h3>
                <p className="text-[11px] text-slate-400">{rule.desc}</p>
              </div>
              <span className="ml-auto text-[10px] font-mono text-slate-500">
                .claude/rules/{rule.file}
              </span>
              {rule.content ? (
                <span className="text-[10px] text-tertiary">로드됨</span>
              ) : (
                <span className="text-[10px] text-error">없음</span>
              )}
            </div>
            {rule.content && (
              <pre className="mt-3 p-3 bg-surface-container rounded-lg text-[11px] text-on-surface-variant font-mono overflow-x-auto max-h-48 overflow-y-auto whitespace-pre-wrap">
                {rule.content.slice(0, 1000)}
                {rule.content.length > 1000 && "\n\n... (truncated)"}
              </pre>
            )}
          </GlassCard>
        ))}
      </div>
    </>
  );
}
