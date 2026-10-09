import Link from "next/link";
import { TIERS, FEATURES, SEGMENTS, B2B_DEFAULT_PRICE_PER_SEAT } from "@/lib/pricingData";

function Cell({ value }) {
  if (value === true) return <span className="font-semibold text-emerald-700">Included</span>;
  if (value === false) return <span className="text-zinc-400">&mdash;</span>;
  return <span className="font-medium text-zinc-800">{value}</span>;
}

export const metadata = {
  title: "Product — StudyForge AI",
  description: "Feature map, pricing tiers and customer segments for StudyForge AI.",
};

export default function ProductPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        Product
      </span>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
        What StudyForge AI includes
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        A study planner that turns messy notes into a clear study plan. Here is
        what each plan includes, and who pays for it.
      </p>

      {/* Tiers */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">3 pricing tiers</h2>
        <p className="mt-1 text-sm text-zinc-600">Prices in MXN per month.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div key={tier.id} className="rounded-xl border border-zinc-200 p-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                {tier.name}
              </p>
              <p className="mt-2 text-3xl font-bold text-zinc-900">
                {tier.priceMonthly === 0 ? "$0" : `$${tier.priceMonthly}`}
                <span className="text-sm font-normal text-zinc-500"> / month</span>
              </p>
              <p className="mt-1 text-sm text-zinc-600">{tier.tagline}</p>
              <ul className="mt-4 space-y-1 text-sm text-zinc-700">
                {tier.highlights.map((h) => (
                  <li key={h}>&bull; {h}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Feature map */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">Product feature map</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Feature</th>
                {TIERS.map((t) => (
                  <th key={t.id} className="px-4 py-2 text-left font-semibold text-zinc-700">
                    {t.name}
                  </th>
                ))}
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">B2B</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {FEATURES.map((f) => (
                <tr key={f.name}>
                  <td className="px-4 py-2 text-zinc-800">{f.name}</td>
                  <td className="px-4 py-2"><Cell value={f.free} /></td>
                  <td className="px-4 py-2"><Cell value={f.plus} /></td>
                  <td className="px-4 py-2"><Cell value={f.pro} /></td>
                  <td className="px-4 py-2"><Cell value={f.b2b ?? false} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Segments */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">2 customer segments</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SEGMENTS.map((s) => (
            <div key={s.id} className="rounded-xl border border-zinc-200 p-5">
              <p className="font-semibold text-zinc-900">{s.name}</p>
              <p className="mt-1 text-sm text-zinc-600">{s.description}</p>
              <p className="mt-3 text-sm text-zinc-700">
                <span className="font-semibold">How they pay:</span> {s.model}
              </p>
              {s.id === "b2b" && (
                <p className="mt-1 text-sm text-zinc-700">
                  <span className="font-semibold">Assumed price:</span> MXN{" "}
                  {B2B_DEFAULT_PRICE_PER_SEAT} per seat per month.
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <Link
          href="/pricing"
          className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
        >
          Try the pricing simulator
        </Link>
      </div>
    </main>
  );
}
