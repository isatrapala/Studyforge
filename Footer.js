export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
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
    </footer>
  );
}
