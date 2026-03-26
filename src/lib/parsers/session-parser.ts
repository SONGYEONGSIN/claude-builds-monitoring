import { readFile, readdir } from "fs/promises";
import { join } from "path";
import type { SessionLog } from "@/types/session";

function parseSessionMarkdown(content: string, filename: string): SessionLog {
  const timestamp = filename
    .replace(".md", "")
    .replace("_", "T")
    .replace(/(\d{2})(\d{2})(\d{2})$/, "$1:$2:$3");

  const sections: Record<string, string[]> = {};
  let currentSection = "";

  for (const line of content.split("\n")) {
    if (line.startsWith("## ")) {
      currentSection = line.replace("## ", "").trim();
      sections[currentSection] = [];
    } else if (currentSection && line.trim()) {
      sections[currentSection].push(line.trim());
    }
  }

  const metricsLine = (sections["메트릭 요약"] ?? []).join(" ");
  const totalMatch = metricsLine.match(/이벤트\s*(\d+)/);
  const rateMatch = metricsLine.match(/성공률\s*(\d+)/);
  const tsMatch = metricsLine.match(/TS에러\s*(\d+)/);

  return {
    id: filename.replace(".md", ""),
    sessionTimestamp: timestamp,
    commits: sections["오늘의 커밋"] ?? [],
    uncommittedFiles: sections["미커밋 변경 파일"] ?? [],
    stagedFiles: sections["스테이징된 파일"] ?? [],
    totalEvents: totalMatch ? parseInt(totalMatch[1]) : 0,
    successRate: rateMatch ? parseInt(rateMatch[1]) : 0,
    tsErrors: tsMatch ? parseInt(tsMatch[1]) : 0,
    rawContent: content,
  };
}

export async function listSessionLogs(
  projectRoot: string,
  limit: number = 20
): Promise<SessionLog[]> {
  const dir = join(projectRoot, ".claude", "session-logs");

  try {
    const files = await readdir(dir);
    const mdFiles = files
      .filter((f) => f.endsWith(".md"))
      .sort()
      .reverse()
      .slice(0, limit);

    const sessions: SessionLog[] = [];
    for (const file of mdFiles) {
      const content = await readFile(join(dir, file), "utf-8");
      sessions.push(parseSessionMarkdown(content, file));
    }

    return sessions;
  } catch {
    return [];
  }
}
