"use client";

import { useState } from "react";
import CopyButton from "@/components/CopyButton";
import AbTester from "@/components/AbTester";
import { BRAND, PERSONA, TONES, AB_TESTS } from "@/lib/brandData";
import {
  validateInputs,
  generateMarketingKit,
  postToText,
  scriptToText,
  landingToText,
  calendarToText,
} from "@/lib/marketingEngine";

const DEFAULT_INPUTS = {
  brandName: BRAND.name,
  productLine: BRAND.oneLiner,
  tone: "Friendly",
};

export default function MarketingPage() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [errors, setErrors] = useState([]);
  const [kit, setKit] = useState(null);

  function handleChange(field, value) {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }

  function handleGenerate(e) {
    e.preventDefault();
    const found = validateInputs(inputs);
    setErrors(found);
    if (found.length > 0) return;
    setKit(generateMarketingKit(inputs));
  }

  return (
    <main className="flex-1">
      <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Week 4 &middot; Marketing Engine + Content System
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
            Marketing Engine
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-600">
            Type your brand, get a small marketing kit: landing copy, 10 social
            posts, 3 video scripts and a 14-day calendar.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-10 px-6 py-10">
        {/* Input + brand + persona */}
        <section className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleGenerate}
            className="rounded-xl border border-zinc-200 p-6"
          >
            <h2 className="text-lg font-semibold text-zinc-900">Your input</h2>

            <label className="mt-4 block text-sm font-medium text-zinc-700" htmlFor="brandName">
              Brand name
            </label>
            <input
              id="brandName"
              value={inputs.brandName}
              onChange={(e) => handleChange("brandName", e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="e.g. StudyForge AI"
            />

            <label className="mt-4 block text-sm font-medium text-zinc-700" htmlFor="productLine">
              Product description (one sentence)
            </label>
            <input
              id="productLine"
              value={inputs.productLine}
              onChange={(e) => handleChange("productLine", e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
              placeholder="One sentence about your product..."
            />

            <label className="mt-4 block text-sm font-medium text-zinc-700" htmlFor="tone">
              Tone
            </label>
            <select
              id="tone"
              value={inputs.tone}
              onChange={(e) => handleChange("tone", e.target.value)}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {errors.length > 0 && (
              <ul className="mt-4 space-y-1 text-sm text-red-700" role="alert">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700"
            >
              Generate content
            </button>
          </form>

          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900">Brand system</h2>
              <p className="mt-3 text-sm text-zinc-700">
                <span className="font-semibold">Name:</span> {BRAND.name}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-semibold">Tagline:</span> {BRAND.tagline}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-semibold">Voice words:</span>{" "}
                {BRAND.voiceWords.join(", ")}
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {BRAND.colors.map((c) => (
                  <div key={c.hex} className="flex items-center gap-2 text-xs text-zinc-700">
                    <span
                      className="inline-block h-6 w-6 rounded-full border border-zinc-300"
                      style={{ backgroundColor: c.hex }}
                    />
                    {c.name} {c.hex}
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-4 text-sm text-zinc-700 sm:grid-cols-2">
                <div>
                  <p className="font-semibold">Do</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {BRAND.dos.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Don&apos;t</p>
                  <ul className="mt-1 list-disc space-y-1 pl-5">
                    {BRAND.donts.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 p-6">
              <h2 className="text-lg font-semibold text-zinc-900">Target persona</h2>
              <p className="mt-1 text-xs text-zinc-500">{PERSONA.label}</p>
              <p className="mt-3 text-sm text-zinc-700">
                <span className="font-semibold">{PERSONA.name}, {PERSONA.age}:</span>{" "}
                {PERSONA.profile}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-semibold">Situation:</span> {PERSONA.situation}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-semibold">Goal:</span> {PERSONA.goal}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-semibold">Pain point:</span> {PERSONA.painPoint}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-semibold">Channels:</span> {PERSONA.channels.join(", ")}
              </p>
              <p className="mt-1 text-sm text-zinc-700">
                <span className="font-semibold">Objection:</span> &ldquo;{PERSONA.objection}&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Generated kit */}
        {!kit ? (
          <p className="rounded-xl border border-dashed border-zinc-300 p-6 text-sm text-zinc-600">
            Click &ldquo;Generate content&rdquo; to build the kit.
          </p>
        ) : (
          <>
            <p className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              {kit.label}
            </p>

            {/* Landing copy */}
            <section className="rounded-xl border border-zinc-200 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-900">Landing page copy</h2>
                <CopyButton text={landingToText(kit.landing)} />
              </div>
              <p className="mt-3 text-xl font-bold text-zinc-900">{kit.landing.headline}</p>
              <p className="mt-1 text-zinc-700">{kit.landing.subheadline}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                {kit.landing.benefits.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="mt-3 inline-block rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                {kit.landing.buttonText}
              </p>
              <div className="mt-4 space-y-2 text-sm text-zinc-700">
                {kit.landing.faq.map((f) => (
                  <p key={f.q}>
                    <span className="font-semibold">{f.q}</span> {f.a}
                  </p>
                ))}
              </div>
            </section>

            {/* Posts */}
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">
                Social posts ({kit.posts.length})
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {kit.posts.map((post) => (
                  <article key={post.id} className="rounded-xl border border-zinc-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-700">
                        {post.channel}
                      </span>
                      <CopyButton text={postToText(post)} />
                    </div>
                    <p className="mt-3 text-sm text-zinc-800">{post.text}</p>
                    <p className="mt-2 text-xs text-indigo-700">{post.hashtags.join(" ")}</p>
                  </article>
                ))}
              </div>
            </section>

            {/* Scripts */}
            <section>
              <h2 className="text-lg font-semibold text-zinc-900">
                Video scripts ({kit.scripts.length})
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {kit.scripts.map((script) => (
                  <article key={script.id} className="rounded-xl border border-zinc-200 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-zinc-900">{script.title}</p>
                      <CopyButton text={scriptToText(script)} />
                    </div>
                    <p className="mt-1 text-xs text-zinc-500">{script.seconds} seconds</p>
                    <p className="mt-3 text-sm text-zinc-800">
                      <span className="font-semibold">Hook:</span> {script.hook}
                    </p>
                    <p className="mt-1 text-sm text-zinc-800">
                      <span className="font-semibold">Body:</span> {script.body}
                    </p>
                    <p className="mt-1 text-sm text-zinc-800">
                      <span className="font-semibold">Call to action:</span> {script.cta}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* Calendar */}
            <section className="rounded-xl border border-zinc-200 p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-zinc-900">14-day campaign calendar</h2>
                <CopyButton text={calendarToText(kit.calendar)} />
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 text-zinc-700">
                      <th className="py-2 pr-4 font-semibold">Day</th>
                      <th className="py-2 pr-4 font-semibold">Channel</th>
                      <th className="py-2 pr-4 font-semibold">Content</th>
                      <th className="py-2 pr-4 font-semibold">Piece</th>
                      <th className="py-2 font-semibold">Goal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kit.calendar.map((row) => (
                      <tr key={row.day} className="border-b border-zinc-100 text-zinc-700">
                        <td className="py-2 pr-4">{row.day}</td>
                        <td className="py-2 pr-4">{row.channel}</td>
                        <td className="py-2 pr-4">{row.content}</td>
                        <td className="py-2 pr-4">{row.piece}</td>
                        <td className="py-2">{row.goal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* A/B tests */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-900">A/B tests</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Vote for the version you like more. Votes are saved in Supabase and
            come from real people.
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            {AB_TESTS.map((test) => (
              <AbTester key={test.id} test={test} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
