import { NextRequest, NextResponse } from "next/server";
import { getProjectRoot } from "@/lib/env";
import {
  readDailyMetrics,
  summarizeEvents,
  getMetricsRange,
} from "@/lib/parsers/metrics-parser";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date") ?? undefined;
  const range = parseInt(searchParams.get("range") ?? "7");
  const projectRoot = getProjectRoot();

  const daily = await readDailyMetrics(projectRoot, date);
  const trend = await getMetricsRange(projectRoot, Math.min(range, 30));

  return NextResponse.json({
    summary: daily ? summarizeEvents(daily.events) : null,
    events: daily?.events?.slice(-100) ?? [],
    trend: trend.map((t) => ({
      date: t.date,
      successRate: t.summary.successRate,
      totalEvents: t.summary.totalEvents,
    })),
  });
}
