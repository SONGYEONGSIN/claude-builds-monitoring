import { readFile, readdir } from "fs/promises";
import { join } from "path";
import type { DailyMetrics, DailySummary, MetricEvent } from "@/types/metrics";

export async function readDailyMetrics(
  projectRoot: string,
  date?: string
): Promise<DailyMetrics | null> {
  const targetDate = date ?? new Date().toISOString().slice(0, 10);
  const filePath = join(
    projectRoot,
    ".claude",
    "metrics",
    `daily-${targetDate}.json`
  );

  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as DailyMetrics;
  } catch {
    return null;
  }
}

export async function listMetricDates(
  projectRoot: string
): Promise<string[]> {
  const dir = join(projectRoot, ".claude", "metrics");
  try {
    const files = await readdir(dir);
    return files
      .filter((f) => f.startsWith("daily-") && f.endsWith(".json"))
      .map((f) => f.replace("daily-", "").replace(".json", ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

export function summarizeEvents(events: MetricEvent[]): DailySummary {
  const results = { prettierFail: 0, eslintFail: 0, typecheckFail: 0, testFail: 0 };
  let passCount = 0;

  for (const e of events) {
    const allPass =
      e.results.prettier === "pass" &&
      e.results.eslint === "pass" &&
      e.results.typecheck === "pass" &&
      e.results.test === "pass";

    if (allPass) passCount++;
    if (e.results.prettier === "fail") results.prettierFail++;
    if (e.results.eslint === "fail") results.eslintFail++;
    if (e.results.typecheck === "fail") results.typecheckFail++;
    if (e.results.test === "fail") results.testFail++;
  }

  const uniqueFiles = new Set(events.map((e) => e.file)).size;

  return {
    date: events[0]?.timestamp?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    totalEvents: events.length,
    passCount,
    failCount: events.length - passCount,
    ...results,
    successRate: events.length > 0 ? Math.round((passCount / events.length) * 100) : 0,
    uniqueFiles,
  };
}

export async function getMetricsRange(
  projectRoot: string,
  days: number = 7
): Promise<{ date: string; summary: DailySummary }[]> {
  const result: { date: string; summary: DailySummary }[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const metrics = await readDailyMetrics(projectRoot, dateStr);

    if (metrics && metrics.events.length > 0) {
      result.push({ date: dateStr, summary: summarizeEvents(metrics.events) });
    } else {
      result.push({
        date: dateStr,
        summary: {
          date: dateStr,
          totalEvents: 0,
          passCount: 0,
          failCount: 0,
          prettierFail: 0,
          eslintFail: 0,
          typecheckFail: 0,
          testFail: 0,
          successRate: 0,
          uniqueFiles: 0,
        },
      });
    }
  }

  return result.reverse();
}
