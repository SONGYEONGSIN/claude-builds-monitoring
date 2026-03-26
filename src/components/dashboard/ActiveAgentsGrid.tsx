"use client";

import Link from "next/link";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { AgentCard } from "@/components/agents/AgentCard";
import { AgentCardClickable } from "@/components/agents/AgentDetailSheet";
import type { AgentStatus } from "@/types/agent";

interface ActiveAgentsGridProps {
  agents: AgentStatus[];
}

export function ActiveAgentsGrid({ agents }: ActiveAgentsGridProps) {
  const displayed = agents.slice(0, 4);

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline text-2xl font-bold text-on-surface">
          활성 에이전트
        </h2>
        <Link
          href="/agents"
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          전체 보기
          <MaterialIcon icon="arrow_forward" size="xs" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayed.map((agent) => (
          <AgentCardClickable key={agent.name} agent={agent}>
            <AgentCard agent={agent} />
          </AgentCardClickable>
        ))}
      </div>
    </section>
  );
}
