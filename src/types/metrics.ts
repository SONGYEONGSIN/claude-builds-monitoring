export type HookResult = "pass" | "fail" | "skip";

export interface MetricEvent {
  timestamp: string;
  tool: string;
  file: string;
  results: {
    prettier: HookResult;
    eslint: HookResult;
    typecheck: HookResult;
    test: HookResult;
  };
}

export interface DailyMetrics {
  date: string;
  events: MetricEvent[];
}

export interface DailySummary {
  date: string;
  totalEvents: number;
  passCount: number;
  failCount: number;
  prettierFail: number;
  eslintFail: number;
  typecheckFail: number;
  testFail: number;
  successRate: number;
  uniqueFiles: number;
}
