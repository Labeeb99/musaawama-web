import Link from "next/link";
import { Container } from "@/components/layout/container";

const navItems = [
  { href: "/solutions", label: "Solutions" },
  { href: "/projects", label: "Projects" },
  { href: "/platform", label: "Platform" },
  { href: "/ai-assistant", label: "AI Assistant" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur">
      <Container>
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="text-lg font-semibold tracking-tight text-neutral-900">
            Musaawama
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-neutral-600 transition hover:text-neutral-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Get in touch
          </Link>
        </div>
      </Container>
    </header>
  );
}
