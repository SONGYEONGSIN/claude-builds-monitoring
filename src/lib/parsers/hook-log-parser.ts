import { readFile, stat } from "fs/promises";
import type { HookLogEntry } from "@/types/hook";
import { HOOK_LOG_FILES } from "@/lib/constants/hooks";

async function tailFile(
  filePath: string,
  lines: number = 50
): Promise<{ content: string[]; modifiedAt: string | null }> {
  try {
    const fileStat = await stat(filePath);
    const raw = await readFile(filePath, "utf-8");
    const allLines = raw.split("\n").filter(Boolean);
    return {
      content: allLines.slice(-lines),
      modifiedAt: fileStat.mtime.toISOString(),
    };
  } catch {
    return { content: [], modifiedAt: null };
  }
}

// INPUT: JSON은 무시 — 훅 실행 결과만 판단
const IGNORE_PATTERNS = [
  /^INPUT:/,
  /^HOOK TRIGGERED/,
  /^FILE_PATH:/,
  /^PRETTIER DONE/,
  /^Checking:/,
  /^Running:/,
];

const ERROR_PATTERNS = [
  /exit[= ]+[1-9]/i,
  /BLOCKED/,
  /TS\d{4,}/,
  /\berrors?\b.*found/i,
  /\bfailed\b/i,
  /\d+ problems?\s*\(\d+ errors?/,
];

function detectErrors(lines: string[]): boolean {
  return lines.some((line) => {
    if (IGNORE_PATTERNS.some((p) => p.test(line.trim()))) return false;
    return ERROR_PATTERNS.some((p) => p.test(line));
  });
}

export async function readHookLogs(): Promise<HookLogEntry[]> {
  const entries: HookLogEntry[] = [];

  for (const [name, filePath] of Object.entries(HOOK_LOG_FILES)) {
    const { content, modifiedAt } = await tailFile(filePath);
    entries.push({
      name,
      lastModified: modifiedAt,
      hasError: detectErrors(content),
      lastLines: content,
    });
  }

  return entries;
}
