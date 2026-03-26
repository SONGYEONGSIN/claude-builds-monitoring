export interface HookLogEntry {
  name: string;
  lastModified: string | null;
  hasError: boolean;
  lastLines: string[];
}

export interface HookPipelineStatus {
  preToolUse: {
    total: number;
    passed: number;
    percentage: number;
  };
  postToolUse: {
    total: number;
    passed: number;
    percentage: number;
  };
}
