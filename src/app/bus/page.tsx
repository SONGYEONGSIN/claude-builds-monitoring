import { CommBusFlow } from "@/components/bus/CommBusFlow";
import { GlassCard } from "@/components/ui/GlassCard";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getProjectRoot } from "@/lib/env";
import { listInboxMessages } from "@/lib/parsers/message-parser";

export const dynamic = "force-dynamic";

const TYPE_COLORS: Record<string, string> = {
  request: "text-primary",
  alert: "text-error",
  reply: "text-tertiary",
  info: "text-secondary",
  "debate-invite": "text-warning",
  "debate-round": "text-secondary",
  "debate-verdict": "text-tertiary",
};

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

export default async function BusPage() {
  const projectRoot = getProjectRoot();
  const messages = await listInboxMessages(projectRoot);
  const recent = messages.slice(0, 20);

  return (
    <>
      <CommBusFlow />

      <section>
        <h2 className="font-headline text-xl font-bold text-on-surface mb-6">
          최근 메시지
        </h2>
        {recent.length > 0 ? (
          <div className="space-y-3">
            {recent.map((msg) => (
              <GlassCard key={msg.messageId} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[140px]">
                    <span className="text-xs font-mono text-primary">{msg.from}</span>
                    <MaterialIcon icon="arrow_forward" size="xs" className="text-slate-500" />
                    <span className="text-xs font-mono text-secondary">{msg.to}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${TYPE_COLORS[msg.type] ?? "text-slate-400"}`}>
                    {msg.type}
                  </span>
                  <span className="text-sm text-on-surface">{msg.subject}</span>
                </div>
                <span className="text-[10px] text-slate-500">{timeAgo(msg.timestamp)}</span>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <p className="text-lg mb-2">메시지가 없습니다</p>
            <p className="text-sm">에이전트 간 통신이 발생하면 여기에 표시됩니다</p>
          </div>
        )}
      </section>
    </>
  );
}
