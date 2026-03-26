export const HOOK_NAMES = {
  preToolUse: ["command-guard", "smart-guard"] as const,
  postToolUse: [
    "prettier-format",
    "eslint-fix",
    "typecheck",
    "test-runner",
    "metrics-collector",
    "pattern-check",
    "design-lint",
    "debate-trigger",
  ] as const,
  stop: ["uncommitted-warn", "session-review", "session-log"] as const,
} as const;

export const HOOK_LOG_FILES: Record<string, string> = {
  prettier: "/tmp/prettier-hook.log",
  eslint: "/tmp/eslint-hook.log",
  typecheck: "/tmp/typecheck-hook.log",
  "test-runner": "/tmp/test-runner-hook.log",
};
