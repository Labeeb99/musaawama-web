// src/components/layout/navbar.tsx
import Link from "next/link";
import { Container } from "./container";

export function Navbar() {
  return (
    <header className="border-b">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          Musaawama
        </Link>

        <nav className="flex gap-6 text-sm">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </Container>
    </header>
  );
}
