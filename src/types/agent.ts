export type AgentStatusType = "processing" | "idle" | "success" | "alert";

export interface AgentInfo {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: "primary" | "secondary" | "tertiary" | "error";
}

export interface AgentStatus extends AgentInfo {
  status: AgentStatusType;
  unreadMessages: number;
  lastActivity: string | null;
  uptime: string | null;
}
