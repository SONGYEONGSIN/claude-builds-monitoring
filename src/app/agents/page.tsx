import { AgentCard } from "@/components/agents/AgentCard";
import { AGENTS } from "@/lib/constants/agents";
import { getSelectedProject } from "@/lib/env";
import { getUnreadCounts, listInboxMessages } from "@/lib/parsers/message-parser";
import type { AgentStatus, AgentStatusType } from "@/types/agent";

export const dynamic = "force-dynamic";

function determineStatus(
  unreadCount: number,
  lastMessageTime: string | null
): AgentStatusType {
  if (unreadCount > 0) return "alert";
  if (!lastMessageTime) return "idle";
  const minutes = (Date.now() - new Date(lastMessageTime).getTime()) / 60000;
  if (minutes < 1) return "processing";
  if (minutes < 30) return "success";
  return "idle";
}

export default async function AgentsPage() {
  const projectRoot = await getSelectedProject();
  const unreadCounts = await getUnreadCounts(projectRoot);
  const allMessages = await listInboxMessages(projectRoot);

  const lastActivity: Record<string, string> = {};
  for (const msg of allMessages) {
    if (!lastActivity[msg.to]) lastActivity[msg.to] = msg.timestamp;
  }

  const agents: AgentStatus[] = AGENTS.map((agent) => ({
    ...agent,
    status: determineStatus(unreadCounts[agent.name] ?? 0, lastActivity[agent.name] ?? null),
    unreadMessages: unreadCounts[agent.name] ?? 0,
    lastActivity: lastActivity[agent.name] ?? null,
    uptime: null,
  }));

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-2xl font-bold text-on-surface">
          에이전트 상태
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </>
  );
}
