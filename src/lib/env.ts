export function getProjectRoot(): string {
  return process.env.MONITOR_PROJECT_ROOT ?? process.cwd();
}
