import { CommBusFlow } from "@/components/bus/CommBusFlow";
import { getSelectedProject } from "@/lib/env";
import { listInboxMessages } from "@/lib/parsers/message-parser";

export const dynamic = "force-dynamic";

export default async function BusPage() {
  const projectRoot = await getSelectedProject();
  const messages = await listInboxMessages(projectRoot);

  return <CommBusFlow messages={messages} />;
}
