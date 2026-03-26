import { CommBusFlow } from "@/components/bus/CommBusFlow";
import { getProjectRoot } from "@/lib/env";
import { listInboxMessages } from "@/lib/parsers/message-parser";

export const dynamic = "force-dynamic";

export default async function BusPage() {
  const projectRoot = getProjectRoot();
  const messages = await listInboxMessages(projectRoot);

  return <CommBusFlow messages={messages} />;
}
