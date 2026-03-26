import { NextResponse } from "next/server";
import { readHookLogs } from "@/lib/parsers/hook-log-parser";

export async function GET() {
  const hooks = await readHookLogs();
  return NextResponse.json({ hooks });
}
