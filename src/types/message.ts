export type MessageType =
  | "alert"
  | "request"
  | "reply"
  | "debate-invite"
  | "debate-round"
  | "debate-verdict"
  | "info";

export type MessagePriority = "critical" | "high" | "medium" | "low";
export type MessageStatus = "unread" | "read" | "archived";

export interface AgentMessage {
  id: string;
  messageId: string;
  timestamp: string;
  from: string;
  to: string;
  type: MessageType;
  priority: MessagePriority;
  subject: string;
  body: string;
  context: Record<string, unknown> | null;
  status: MessageStatus;
  debateId: string | null;
  replyTo: string | null;
}
