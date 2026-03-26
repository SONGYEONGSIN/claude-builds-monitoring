import { LogTable } from "@/components/logs/LogTable";
import { getSelectedProject } from "@/lib/env";
import { readDailyMetrics } from "@/lib/parsers/metrics-parser";
import { listSessionLogs } from "@/lib/parsers/session-parser";
import type { LogEntry } from "@/components/logs/LogRow";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const projectRoot = await getSelectedProject();

  const daily = await readDailyMetrics(projectRoot);
  const sessions = await listSessionLogs(projectRoot, 20);

  const eventLogs: LogEntry[] = (daily?.events ?? []).reverse().map((e, i) => ({
    id: `#HE-${String(i + 1).padStart(4, "0")}`,
    timestamp: e.timestamp,
    source: e.tool,
    action: e.file,
    status:
      e.results.prettier === "pass" &&
      e.results.eslint === "pass" &&
      e.results.typecheck === "pass" &&
      e.results.test === "pass"
        ? "success"
        : "failed",
    duration: "-",
  }));

  const sessionLogs: LogEntry[] = sessions.map((s, i) => ({
    id: `#SL-${String(i + 1).padStart(4, "0")}`,
    timestamp: s.sessionTimestamp,
    source: "Session",
    action: `커밋 ${s.commits.length}개, 변경 ${s.uncommittedFiles.length}개`,
    status: s.successRate >= 80 ? "success" : s.successRate >= 50 ? "completed" : "failed",
    duration: `${s.totalEvents} events`,
  }));

  const allLogs = [...eventLogs, ...sessionLogs];

  return allLogs.length > 0 ? (
    <LogTable entries={allLogs} />
  ) : (
    <section className="text-center py-16 text-slate-500">
      <p className="text-lg mb-2">로그 데이터가 없습니다</p>
      <p className="text-sm">Claude Code로 파일을 수정하면 메트릭이 자동 수집됩니다</p>
    </section>
  );
}
