"use client";

import { SessionBar } from "@/components/app/session-bar";
import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Container } from "@/components/layout/container";

const appNavItems = [
  { href: "/app", label: "Overview" },
  { href: "/app/login", label: "Login" },
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/summary", label: "Summary" },
  { href: "/app/search", label: "Search" },
  { href: "/app/leads", label: "Leads" },
  { href: "/app/projects", label: "Projects" },
  { href: "/app/updates", label: "Updates" },
  { href: "/app/milestones", label: "Milestones" },
  { href: "/app/actions", label: "Actions" },
  { href: "/app/documents", label: "Documents" },
  { href: "/app/assistant", label: "AI Assistant" },
  { href: "/app/knowledge", label: "Knowledge" },
  { href: "/app/assistant-rules", label: "AI Rules" },
  { href: "/app/settings", label: "Settings" },
];

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/app") {
      return pathname === "/app";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <Container className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
              Musaawama Platform
            </p>
            <h1 className="text-lg font-semibold tracking-tight">
              Project Intelligence Workspace
            </h1>
          </div>

          <div className="flex flex-col gap-4 md:items-end">
            <nav className="flex flex-wrap gap-3">
              {appNavItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      active
                        ? "rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
                        : "rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900"
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <SessionBar />
          </div>
        </Container>
      </header>

      <main>{children}</main>
    </div>
  );
}
