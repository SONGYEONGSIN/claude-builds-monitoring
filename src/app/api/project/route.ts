import { NextRequest, NextResponse } from "next/server";
import { getProjectRoots } from "@/lib/env";

export async function GET() {
  return NextResponse.json({ projects: getProjectRoots() });
}

export async function POST(request: NextRequest) {
  const { project } = await request.json();
  const roots = getProjectRoots();

  if (!roots.includes(project)) {
    return NextResponse.json({ error: "Invalid project" }, { status: 400 });
  }

  const response = NextResponse.json({ selected: project });
  response.cookies.set("monitor_project", project, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
