import { cookies } from "next/headers";

export function getProjectRoots(): string[] {
  const raw = process.env.MONITOR_PROJECT_ROOT ?? process.cwd();
  return raw.split(",").map((p) => p.trim()).filter(Boolean);
}

export async function getSelectedProject(): Promise<string> {
  const roots = getProjectRoots();
  try {
    const cookieStore = await cookies();
    const saved = cookieStore.get("monitor_project")?.value;
    if (saved && roots.includes(saved)) return saved;
  } catch {
    // cookies() 못 쓰는 환경 (API route 등)
  }
  return roots[0] ?? process.cwd();
}

export function getProjectRoot(): string {
  const roots = getProjectRoots();
  return roots[0] ?? process.cwd();
}

export function getProjectLabel(path: string): string {
  return path.split("/").pop() ?? path;
}
