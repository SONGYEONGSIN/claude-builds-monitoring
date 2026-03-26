import { readFile, readdir } from "fs/promises";
import { join } from "path";
import type { AgentMessage } from "@/types/message";

async function readJsonSafe<T>(filePath: string): Promise<T | null> {
  try {
    const content = await readFile(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

interface RawMessage {
  id: string;
  timestamp: string;
  from: string;
  to: string;
  type: string;
  priority: string;
  subject: string;
  body: string;
  context?: Record<string, unknown> | null;
  status: string;
  debate_id?: string | null;
  reply_to?: string | null;
}

function rawToMessage(raw: RawMessage): AgentMessage {
  return {
    id: raw.id,
    messageId: raw.id,
    timestamp: raw.timestamp,
    from: raw.from,
    to: raw.to,
    type: raw.type as AgentMessage["type"],
    priority: raw.priority as AgentMessage["priority"],
    subject: raw.subject,
    body: raw.body,
    context: raw.context ?? null,
    status: raw.status as AgentMessage["status"],
    debateId: raw.debate_id ?? null,
    replyTo: raw.reply_to ?? null,
  };
}

export async function listInboxMessages(
  projectRoot: string,
  agent?: string
): Promise<AgentMessage[]> {
  const inboxDir = join(projectRoot, ".claude", "messages", "inbox");
  const messages: AgentMessage[] = [];

  try {
    const agents = agent ? [agent] : await readdir(inboxDir);

    for (const agentName of agents) {
      const agentDir = join(inboxDir, agentName);
      try {
        const files = await readdir(agentDir);
        for (const file of files.filter((f) => f.endsWith(".json"))) {
          const raw = await readJsonSafe<RawMessage>(join(agentDir, file));
          if (raw) messages.push(rawToMessage(raw));
        }
      } catch {
        continue;
      }
    }

    return messages.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch {
    return [];
  }
}

export async function getUnreadCounts(
  projectRoot: string
): Promise<Record<string, number>> {
  const messages = await listInboxMessages(projectRoot);
  const counts: Record<string, number> = {};

  for (const msg of messages) {
    if (msg.status === "unread") {
      counts[msg.to] = (counts[msg.to] ?? 0) + 1;
    }
  }

  return counts;
}
