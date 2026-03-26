import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

const SKILLS = [
  { category: "개발", color: "text-tertiary", items: [
    { name: "/commit", desc: "Conventional Commit 자동 생성", icon: "commit" },
    { name: "/scaffold", desc: "새 도메인 보일러플레이트 생성", icon: "create_new_folder" },
    { name: "/design-sync", desc: "디자인 URL/캡처에서 CSS 추출 → 코드 싱크", icon: "sync" },
  ]},
  { category: "품질", color: "text-warning", items: [
    { name: "/verify", desc: "lint → typecheck → test → e2e 순차 검증", icon: "verified" },
    { name: "/feedback", desc: "최근 변경사항 품질 분석", icon: "rate_review" },
    { name: "/test", desc: "Vitest 단위 테스트 자동 생성", icon: "science" },
    { name: "/eval-skill", desc: "스킬 품질 정량 평가 (evals.json 기반)", icon: "grading" },
    { name: "/design-audit", desc: "디자인 시스템 준수 점검 — 토큰 커버리지, 중복 패턴", icon: "palette" },
  ]},
  { category: "운영", color: "text-primary", items: [
    { name: "/status", desc: "프로젝트 상태 대시보드 (git, CI, 배포)", icon: "monitoring" },
    { name: "/security", desc: "OWASP Top 10 전체 코드 보안 스캔", icon: "shield" },
    { name: "/review-pr", desc: "GitHub PR 코드 리뷰", icon: "code_review" },
  ]},
  { category: "학습", color: "text-secondary", items: [
    { name: "/metrics", desc: "빌드 성공률, 에러 빈도, 핫스팟 대시보드", icon: "analytics" },
    { name: "/learn", desc: "패턴/에러 해결법 저장·조회", icon: "school" },
    { name: "/retrospective", desc: "종합 회고 — 메트릭 분석 → 개선안", icon: "psychology" },
  ]},
  { category: "협업", color: "text-pink-400", items: [
    { name: "/discuss", desc: "에이전트 간 구조화된 토론 개시", icon: "forum" },
  ]},
];

export default function SkillsPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          스킬 (15)
        </h1>
      </div>

      <div className="space-y-8">
        {SKILLS.map((cat) => (
          <section key={cat.category}>
            <div className="flex items-center gap-2 mb-4">
              <span className={`text-sm font-bold ${cat.color}`}>{cat.category}</span>
              <span className="text-[10px] text-slate-500">{cat.items.length}개</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.items.map((skill) => (
                <GlassCard key={skill.name} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MaterialIcon icon={skill.icon} size="sm" className={cat.color} />
                    <span className="text-sm font-bold font-mono text-on-surface">{skill.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{skill.desc}</p>
                </GlassCard>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
