"use client";

import Link from "@/components/ui/Link";
import { useAppStore } from "@/store/useAppStore";

const links = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const navOpen = useAppStore((s) => s.navOpen);
  const setNavOpen = useAppStore((s) => s.setNavOpen);

  return (
    <nav className="flex items-center justify-between">
      <Link href="/" className="font-medium">ieggmondays</Link>
      <ul className="hidden md:flex items-center gap-8">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
      <button
        className="md:hidden"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Toggle menu"
      >
        {navOpen ? "Close" : "Menu"}
      </button>
    </nav>
  );
}
