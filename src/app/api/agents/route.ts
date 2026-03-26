import { NextResponse } from "next/server";
import { getProjectRoot } from "@/lib/env";
import { AGENTS } from "@/lib/constants/agents";
import { getUnreadCounts, listInboxMessages } from "@/lib/parsers/message-parser";
import type { AgentStatus, AgentStatusType } from "@/types/agent";

function determineStatus(
  agentName: string,
  unreadCount: number,
  lastMessageTime: string | null
): AgentStatusType {
  if (unreadCount > 0) {
    return "alert";
  }

  if (!lastMessageTime) return "idle";

  const diff = Date.now() - new Date(lastMessageTime).getTime();
  const minutes = diff / 60000;

  if (minutes < 1) return "processing";
  if (minutes < 30) return "success";
  return "idle";
}

export async function GET() {
  const projectRoot = getProjectRoot();
  const unreadCounts = await getUnreadCounts(projectRoot);
  const allMessages = await listInboxMessages(projectRoot);

  const lastActivity: Record<string, string> = {};
  for (const msg of allMessages) {
    if (!lastActivity[msg.to]) {
      lastActivity[msg.to] = msg.timestamp;
    }
  }

  const agents: AgentStatus[] = AGENTS.map((agent) => {
    const unread = unreadCounts[agent.name] ?? 0;
    const lastMsg = lastActivity[agent.name] ?? null;

    return {
      ...agent,
      status: determineStatus(agent.name, unread, lastMsg),
      unreadMessages: unread,
      lastActivity: lastMsg,
      uptime: null,
    };
  });

  return NextResponse.json({ agents });
}
