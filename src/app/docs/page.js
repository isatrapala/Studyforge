const roadmap = [
  {
    week: "Setup Sprint — Builder Infrastructure",
    status: "Done",
    detail:
      "GitHub, Vercel, Supabase, Next.js + Tailwind app running, README, homepage/nav/footer/docs.",
  },
  {
    week: "Week 1 — Generative Core Agent",
    status: "In progress",
    detail:
      "/core: paste a messy topic, get a simulated core-extraction card (topic, key concepts, study order), save it to Supabase, and see it in the dashboard preview.",
  },
  {
    week: "Next — Testing & Iteration",
    status: "Planned",
    detail: "Self-tests, bug fixes, and a redeploy based on what testing found.",
  },
];

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Week 1 &middot; Generative Core Agent
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            StudyForge AI
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
            An AI-native study planner that turns a messy topic into a clear,
            actionable study plan &mdash; and remembers it for you.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/core"
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              Try the Core Agent
            </a>
            <a
              href="/docs"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
            >
              View Docs
            </a>
            <a
              href="https://github.com/isatrapala/Studyforge"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
            >
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Problem / User */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              The problem
            </h2>
            <p className="mt-3 text-zinc-700">
              Students often know *what* they need to study but freeze when
              it comes to breaking that topic into a realistic plan, so they
              procrastinate or study inefficiently.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Who it&apos;s for
            </h2>
            <p className="mt-3 text-zinc-700">
              Students preparing for exams or coursework who want a quick,
              structured starting point instead of a blank page.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-semibold text-zinc-900">
            Project roadmap
          </h2>
          <p className="mt-2 text-zinc-600">
            What&apos;s built, and what&apos;s coming next, week by week.
          </p>

          <ol className="mt-8 space-y-4">
            {roadmap.map((item) => (
              <li
                key={item.week}
                className="flex flex-col gap-1 rounded-xl border border-zinc-200 bg-white p-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="font-medium text-zinc-900">{item.week}</p>
                  <p className="mt-1 text-sm text-zinc-600">{item.detail}</p>
                </div>
                <span
                  className={`mt-2 inline-block w-fit rounded-full px-3 py-1 text-xs font-semibold sm:mt-0 ${
                    item.status === "In progress"
                      ? "bg-amber-100 text-amber-800"
                      : item.status === "Done"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
