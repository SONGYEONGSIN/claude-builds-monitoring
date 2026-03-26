import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { getProjectRoots, getSelectedProject } from "@/lib/env";

interface ShellLayoutProps {
  children: React.ReactNode;
}

export async function ShellLayout({ children }: ShellLayoutProps) {
  const projects = getProjectRoots();
  const currentProject = await getSelectedProject();

  return (
    <>
      <Header projects={projects} currentProject={currentProject} />
      <Sidebar />
      <main className="md:ml-64 pt-24 px-6 md:px-8 pb-20 md:pb-8 min-h-screen bg-background">
        {children}
      </main>
      <MobileNav />
    </>
  );
}
