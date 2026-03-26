import { NextRequest, NextResponse } from "next/server";
import { getProjectRoot } from "@/lib/env";
import { listInboxMessages, getUnreadCounts } from "@/lib/parsers/message-parser";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const agent = searchParams.get("agent") ?? undefined;
  const limit = parseInt(searchParams.get("limit") ?? "50");
  const projectRoot = getProjectRoot();

  const messages = await listInboxMessages(projectRoot, agent);
  const unreadCounts = await getUnreadCounts(projectRoot);

  return NextResponse.json({
    messages: messages.slice(0, limit),
    total: messages.length,
    unreadCounts,
  });
}
