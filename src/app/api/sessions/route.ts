import { NextRequest, NextResponse } from "next/server";
import { getProjectRoot } from "@/lib/env";
import { listSessionLogs } from "@/lib/parsers/session-parser";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const projectRoot = getProjectRoot();

  const sessions = await listSessionLogs(projectRoot, limit);

  return NextResponse.json({
    sessions,
    total: sessions.length,
  });
}
