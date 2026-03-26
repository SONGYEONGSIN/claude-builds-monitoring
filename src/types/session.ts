export interface SessionLog {
  id: string;
  sessionTimestamp: string;
  commits: string[];
  uncommittedFiles: string[];
  stagedFiles: string[];
  totalEvents: number;
  successRate: number;
  tsErrors: number;
  rawContent: string;
}
