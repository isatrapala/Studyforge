import { BRAND, PERSONA, AB_TESTS } from "../lib/brandData.js";

const roadmap = [
  {
    week: "Setup Sprint — Builder Infrastructure",
    status: "Done",
    detail:
      "GitHub, Vercel, Supabase, Next.js + Tailwind app running, README, homepage/nav/footer/docs.",
  },
  {
    week: "Week 1 — Generative Core Agent",
    status: "Done",
    detail:
      "/core: paste a messy topic, get a simulated core-extraction card (topic, key concepts, study order), save it to Supabase, and see it in the dashboard preview.",
  },
  {
    week: "Week 2 — Research + Benchmarking Dashboard",
    status: "Done",
    detail:
      "/research: 5 global examples, 8 direct competitors, a risk map, and a research log for validating the core problem with real people.",
  },
  {
    week: "Week 3 — Product Architecture + Pricing Simulator",
    status: "Done",
    detail:
      "/product and /pricing: 3 pricing tiers, a feature map, 2 customer segments, a revenue calculator with scenarios, and saved scenarios.",
  },
  {
    week: "Week 4 — Marketing Engine + Content System",
    status: "In progress",
    detail:
      "/marketing: brand system, target persona, landing copy, 10 social posts, 3 video scripts, a 14-day calendar, 2 A/B tests with real votes, and saved assets.",
  },
];

const steps = [
  {
    title: "Paste your topic",
    text: "Paste your messy notes or a topic you need to study.",
  },
  {
    title: "Get the core",
    text: "The Core Agent picks the key ideas and a study order.",
  },
  {
    title: "Study with a plan",
    text: "Follow the order and save your result for later.",
  },
];

const benefits = [
  {
    title: "Know what to study first",
    text: "Start with the core ideas instead of reading everything.",
  },
  {
    title: "Less time sorting notes",
    text: "Turn a long, messy topic into a short list you can follow.",
  },
  {
    title: "Keep your results",
    text: "Save each plan so you can open it again before the exam.",
  },
];

export default function Home() {
  // A/B test results (10 real votes each, saved in Supabase):
  // Test 1 headline: A won (7 of 10). Test 2 button text: B won (9 of 10).
  // Visitors can still vote on /marketing.
  const headline = AB_TESTS[0].A;
  const buttonText = AB_TESTS[1].B;

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            {BRAND.name} &middot; Study planner for university students
          </span>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            {headline}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600">
            {BRAND.oneLiner}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/core"
              className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
            >
              {buttonText}
            </a>
            <a
              href="/marketing"
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-400"
            >
              Vote on our headline
            </a>
          </div>
          <p className="mt-4 text-sm text-zinc-500">{BRAND.tagline}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center text-2xl font-semibold text-zinc-900">
          How it works
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <li key={step.title} className="text-center">
              <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
                {i + 1}
              </span>
              <p className="mt-3 font-medium text-zinc-900">{step.title}</p>
              <p className="mt-1 text-sm text-zinc-600">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-center text-2xl font-semibold text-zinc-900">
          Why {BRAND.name}?
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {benefits.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-6"
            >
              <p className="font-semibold text-zinc-900">{item.title}</p>
              <p className="mt-2 text-sm text-zinc-600">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-y border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Who it&apos;s for
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-700">
            Students like {PERSONA.name} ({PERSONA.label.toLowerCase()}):{" "}
            {PERSONA.profile} {PERSONA.situation}
          </p>
        </div>
      </section>

      {/* Pricing teaser + honest note */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-zinc-900">See the plans</p>
            <p className="mt-1 text-sm text-zinc-600">
              Free, Plus and Pro tiers in Mexican pesos, plus a simple calculator
              for how much revenue they could make.
            </p>
          </div>
          <a
            href="/pricing"
            className="w-fit rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
          >
            View pricing
          </a>
        </div>
        <p className="mt-4 text-sm text-zinc-500">
          Honest note: {BRAND.name} is a student project. The content on
          /marketing is simulated from templates, and there are no real
          customer reviews or numbers on this site.
        </p>
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
