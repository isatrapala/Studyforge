"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "../lib/ventureData.js";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:py-4"
      >
        <Link href="/" className="flex items-center gap-2 font-semibold text-zinc-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-sm text-white">
            SF
          </span>
          StudyForge AI
        </Link>
        <ul className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm font-medium text-zinc-600">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-md px-2.5 py-1 transition-colors ${
                    active
                      ? "bg-indigo-50 text-indigo-700"
                      : "hover:bg-zinc-100 hover:text-zinc-900"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
