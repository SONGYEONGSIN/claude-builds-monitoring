import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface ShellLayoutProps {
  children: React.ReactNode;
}

export function ShellLayout({ children }: ShellLayoutProps) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="md:ml-64 pt-24 px-6 md:px-8 pb-20 md:pb-8 min-h-screen bg-background">
        {children}
      </main>
      <MobileNav />
    </>
  );
}
