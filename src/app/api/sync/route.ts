import { NextRequest, NextResponse } from "next/server";
import { getProjectRoot } from "@/lib/env";
import { readDailyMetrics, listMetricDates } from "@/lib/parsers/metrics-parser";
import { listSessionLogs } from "@/lib/parsers/session-parser";
import { listInboxMessages } from "@/lib/parsers/message-parser";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const projectRoot = (body.projectRoot as string) || getProjectRoot();

  const results: Record<string, { count: number; status: string }> = {};

  try {
    const dates = await listMetricDates(projectRoot);
    let totalEvents = 0;
    for (const date of dates.slice(0, 7)) {
      const metrics = await readDailyMetrics(projectRoot, date);
      totalEvents += metrics?.events.length ?? 0;
    }
    results.metrics = { count: totalEvents, status: "ok" };
  } catch {
    results.metrics = { count: 0, status: "error" };
  }

  try {
    const sessions = await listSessionLogs(projectRoot, 50);
    results.sessions = { count: sessions.length, status: "ok" };
  } catch {
    results.sessions = { count: 0, status: "error" };
  }

  try {
    const messages = await listInboxMessages(projectRoot);
    results.messages = { count: messages.length, status: "ok" };
  } catch {
    results.messages = { count: 0, status: "error" };
  }

  return NextResponse.json({
    projectRoot,
    syncedAt: new Date().toISOString(),
    results,
  });
}
