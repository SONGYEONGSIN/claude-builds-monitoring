import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

export default function OrchestratorsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          오케스트레이터
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <MaterialIcon icon="terminal" size="lg" className="text-primary" />
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">Claude Squad</h2>
              <p className="text-xs text-slate-400">로컬 병렬 실행</p>
            </div>
          </div>
          <div className="space-y-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <MaterialIcon icon="check" size="xs" className="text-tertiary" />
              <span>tmux 세션 × N, 각 세션 = git worktree</span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon icon="check" size="xs" className="text-tertiary" />
              <span>프로필로 에이전트 선택</span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon icon="check" size="xs" className="text-tertiary" />
              <span>cs → TUI 실행</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-surface-container rounded-lg">
            <p className="text-[10px] text-slate-500 mb-1">실행 명령</p>
            <code className="text-xs text-primary font-mono">cs</code>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
              <MaterialIcon icon="cloud" size="lg" className="text-secondary" />
            </div>
            <div>
              <h2 className="font-headline text-lg font-bold text-on-surface">Agent Orchestrator</h2>
              <p className="text-xs text-slate-400">CI/CD 연동</p>
            </div>
          </div>
          <div className="space-y-3 text-xs text-on-surface-variant">
            <div className="flex items-center gap-2">
              <MaterialIcon icon="check" size="xs" className="text-tertiary" />
              <span>GitHub 이슈 → 에이전트 자동 할당</span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon icon="check" size="xs" className="text-tertiary" />
              <span>CI 실패 → 자동 수정</span>
            </div>
            <div className="flex items-center gap-2">
              <MaterialIcon icon="check" size="xs" className="text-tertiary" />
              <span>리뷰 코멘트 → 자동 대응</span>
            </div>
          </div>
          <div className="mt-4 p-3 bg-surface-container rounded-lg">
            <p className="text-[10px] text-slate-500 mb-1">실행 명령</p>
            <code className="text-xs text-secondary font-mono">ao spawn</code>
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 text-center text-xs text-slate-500">
        각 세션이 .claude/ 설정을 상속합니다
      </div>
    </>
  );
}
