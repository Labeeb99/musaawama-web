import Link from "next/link";
import { Container } from "./container";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold">Musaawama</p>
          <p className="mt-2 text-sm text-neutral-600">
            Construction systems, delivery thinking, and digital foundations.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/cookies">Cookies</Link>
        </div>
      </Container>
    </footer>
  );
}
