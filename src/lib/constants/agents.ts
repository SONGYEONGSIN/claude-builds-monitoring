import type { AgentInfo } from "@/types/agent";

export const AGENTS: AgentInfo[] = [
  {
    name: "planner",
    displayName: "Planner Agent",
    description: "작업 분해, 영향 분석, 구현 계획 수립",
    icon: "architecture",
    color: "primary",
  },
  {
    name: "designer",
    displayName: "Designer Agent",
    description: "UI/UX 디자인, Tailwind CSS 스타일링",
    icon: "palette",
    color: "secondary",
  },
  {
    name: "developer",
    displayName: "Developer Agent",
    description: "Server Actions, React 컴포넌트 구현",
    icon: "code",
    color: "tertiary",
  },
  {
    name: "feedback",
    displayName: "Feedback Agent",
    description: "코드 품질 분석, 개선 제안",
    icon: "rate_review",
    color: "secondary",
  },
  {
    name: "qa",
    displayName: "QA Agent",
    description: "Vitest + Playwright 테스트 작성/실행",
    icon: "bug_report",
    color: "tertiary",
  },
  {
    name: "security",
    displayName: "Security Agent",
    description: "OWASP Top 10 보안 스캔",
    icon: "shield",
    color: "error",
  },
  {
    name: "retrospective",
    displayName: "Retrospective Agent",
    description: "메트릭 분석, 에이전트/스킬/규칙 개선안 도출",
    icon: "psychology",
    color: "primary",
  },
  {
    name: "grader",
    displayName: "Grader Agent",
    description: "eval 결과 채점, PASS/FAIL 판정",
    icon: "grading",
    color: "secondary",
  },
  {
    name: "comparator",
    displayName: "Comparator Agent",
    description: "블라인드 A/B 출력 비교, 루브릭 기반 점수 산출",
    icon: "compare",
    color: "primary",
  },
  {
    name: "skill-reviewer",
    displayName: "Skill Reviewer Agent",
    description: "스킬 품질 8단계 검토, 100점 스코어카드",
    icon: "checklist",
    color: "tertiary",
  },
  {
    name: "moderator",
    displayName: "Moderator Agent",
    description: "에이전트 간 토론 중재, 합의 도출",
    icon: "forum",
    color: "secondary",
  },
];

export const AGENT_MAP = Object.fromEntries(
  AGENTS.map((a) => [a.name, a])
) as Record<string, AgentInfo>;
