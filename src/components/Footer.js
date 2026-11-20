import Link from "next/link";
import { NAV_LINKS } from "../lib/ventureData.js";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-zinc-500">
        <ul className="mb-6 flex flex-wrap gap-x-4 gap-y-2 font-medium text-zinc-600">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-zinc-900">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} StudyForge AI &mdash; a student project.</p>
          <p>
            Built with Next.js, Tailwind CSS &amp; Supabase &middot;{" "}
            <a
              href="https://github.com/isatrapala/Studyforge"
              className="font-medium text-indigo-600 hover:text-indigo-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
