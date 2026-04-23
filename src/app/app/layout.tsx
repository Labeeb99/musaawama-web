"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SessionBar } from "@/components/app/session-bar";

const navGroups = [
  {
    title: "Overview",
    items: [
      { href: "/app/dashboard", label: "Dashboard" },
      { href: "/app/summary", label: "Summary" },
      { href: "/app/search", label: "Search" },
    ],
  },
  {
    title: "Workflows",
    items: [
      { href: "/app/leads", label: "Leads" },
      { href: "/app/projects", label: "Projects" },
      { href: "/app/updates", label: "Updates" },
      { href: "/app/milestones", label: "Milestones" },
      { href: "/app/actions", label: "Actions" },
      { href: "/app/documents", label: "Documents" },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { href: "/app/assistant", label: "AI Assistant" },
      { href: "/app/knowledge", label: "Knowledge" },
      { href: "/app/assistant-rules", label: "AI Rules" },
    ],
  },
  {
    title: "Workspace",
    items: [{ href: "/app/settings", label: "Settings" }],
  },
];

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-neutral-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-neutral-200 px-6 py-6">
            <Link
              href="/app/dashboard"
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              Musaawama
            </Link>
            <p className="mt-2 text-sm text-neutral-500">
              Project Intelligence Platform
            </p>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <div className="space-y-8">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <p className="px-3 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400">
                    {group.title}
                  </p>

                  <div className="mt-3 space-y-2">
                    {group.items.map((item) => {
                      const active = isActive(item.href);

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={
                            active
                              ? "block rounded-xl bg-neutral-900 px-4 py-3 text-sm font-medium text-white"
                              : "block rounded-xl px-4 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
                          }
                        >
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-neutral-200 bg-white">
            <div className="flex items-center justify-between px-6 py-4 lg:px-10">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
                  Musaawama Platform
                </p>
                <h1 className="text-lg font-semibold tracking-tight text-neutral-900">
                  Workspace
                </h1>
              </div>

              <SessionBar />
            </div>
          </header>

          <main className="flex-1 px-6 py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
