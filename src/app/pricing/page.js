"use client";

import { useEffect, useState } from "react";
import {
  SCENARIOS,
  SCENARIO_ORDER,
  ASSUMPTIONS,
} from "@/lib/pricingData";
import { calcRevenue, formatMXN } from "@/lib/pricingEngine";
import { saveScenario, listScenarios } from "@/lib/supabaseClient";

const FIELDS = [
  { key: "users", label: "Individual students (users)", suffix: "" },
  { key: "freePct", label: "Free users", suffix: "%" },
  { key: "plusPct", label: "Plus users", suffix: "%" },
  { key: "proPct", label: "Pro users", suffix: "%" },
  { key: "schools", label: "Universities / schools", suffix: "" },
  { key: "seatsPerSchool", label: "Seats per school", suffix: "" },
  { key: "pricePerSeat", label: "Price per seat (MXN / month)", suffix: "" },
];

export default function PricingPage() {
  const [scenarioKey, setScenarioKey] = useState("expected");
  const [inputs, setInputs] = useState({ ...SCENARIOS.expected.inputs });

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }
  const [saved, setSaved] = useState([]);
  const [loadError, setLoadError] = useState(null);

  const result = calcRevenue(inputs);

  async function refreshSaved() {
    const { data, error } = await listScenarios(10);
    setSaved(data);
    setLoadError(error ? error.message : null);
  }

  useEffect(() => {
    let active = true;
    listScenarios(10).then(({ data, error }) => {
      if (!active) return;
      setSaved(data);
      setLoadError(error ? error.message : null);
    });
    return () => {
      active = false;
    };
  }, []);

  async function handleSave() {
    if (saving) return;
    if (!result.ok) {
      setMessage({ type: "error", text: "Fix the inputs before saving." });
      return;
    }
    const cleanName = name.trim();
    if (!cleanName) {
      setMessage({ type: "error", text: "Give the scenario a name first." });
      return;
    }
    setSaving(true);
    setMessage(null);
    const { error } = await saveScenario({
      name: cleanName,
      scenario: scenarioKey,
      inputs,
      monthlyRevenue: result.monthly,
      annualRevenue: result.annual,
    });
    setSaving(false);
    if (error) {
      setMessage({ type: "error", text: `Could not save: ${error.message}` });
      return;
    }
    setMessage({ type: "ok", text: "Saved to Supabase." });
    setName("");
    await refreshSaved();
  }

  function chooseScenario(key) {
    setScenarioKey(key);
    setInputs({ ...SCENARIOS[key].inputs });
  }

  function changeField(key, value) {
    setInputs((prev) => ({ ...prev, [key]: value }));
    setScenarioKey("custom");
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
        Pricing
      </span>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-900">
        Pricing simulator
      </h1>
      <p className="mt-2 max-w-2xl text-zinc-600">
        Change the numbers and see the monthly and annual revenue. All values
        are MXN and are the team&apos;s own assumptions, not real market data.
      </p>

      {/* Scenario toggle */}
      <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Scenario">
        <span className="text-sm font-semibold text-zinc-700">Scenario:</span>
        {SCENARIO_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => chooseScenario(key)}
            aria-pressed={scenarioKey === key}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              scenarioKey === key
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-zinc-300 text-zinc-700 hover:border-zinc-400"
            }`}
          >
            {SCENARIOS[key].label}
          </button>
        ))}
        {scenarioKey === "custom" && (
          <span className="text-sm text-zinc-500">Custom (edited by hand)</span>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Inputs */}
        <section className="rounded-xl border border-zinc-200 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Calculator inputs</h2>
          <div className="mt-4 space-y-3">
            {FIELDS.map((f) => (
              <label key={f.key} className="block text-sm">
                <span className="font-medium text-zinc-700">{f.label}</span>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={inputs[f.key]}
                    onChange={(e) => changeField(f.key, e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
                  />
                  {f.suffix && <span className="text-zinc-500">{f.suffix}</span>}
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Results */}
        <section className="rounded-xl border border-zinc-200 p-5">
          <h2 className="text-lg font-semibold text-zinc-900">Revenue</h2>
          {result.ok ? (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-indigo-50 p-4">
                  <p className="text-xs font-semibold uppercase text-indigo-700">Monthly</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900" data-testid="monthly">
                    {formatMXN(result.monthly)}
                  </p>
                </div>
                <div className="rounded-lg bg-indigo-50 p-4">
                  <p className="text-xs font-semibold uppercase text-indigo-700">Annual</p>
                  <p className="mt-1 text-2xl font-bold text-zinc-900" data-testid="annual">
                    {formatMXN(result.annual)}
                  </p>
                </div>
              </div>
              <table className="min-w-full text-sm">
                <tbody className="divide-y divide-zinc-100">
                  <tr>
                    <td className="py-2 text-zinc-600">Free users (pay $0)</td>
                    <td className="py-2 text-right text-zinc-900">{result.individual.freeUsers}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-zinc-600">Plus users</td>
                    <td className="py-2 text-right text-zinc-900">{result.individual.plusUsers}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-zinc-600">Pro users</td>
                    <td className="py-2 text-right text-zinc-900">{result.individual.proUsers}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-zinc-600">Individual revenue / month</td>
                    <td className="py-2 text-right text-zinc-900">{formatMXN(result.individual.monthly)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-zinc-600">B2B seats</td>
                    <td className="py-2 text-right text-zinc-900">{result.b2b.seats}</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-zinc-600">B2B revenue / month</td>
                    <td className="py-2 text-right text-zinc-900">{formatMXN(result.b2b.monthly)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="border-t border-zinc-200 pt-4">
                <label className="block text-sm">
                  <span className="font-medium text-zinc-700">Scenario name</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Example: Plan for 2 schools"
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="mt-3 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save scenario"}
                </button>
              </div>
            </div>
          ) : (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            >
              <p className="font-semibold">Fix the inputs to see revenue:</p>
              <ul className="mt-1 list-disc pl-5">
                {result.errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>

      {/* Message */}
      {message && (
        <p
          role="status"
          className={`mt-4 text-sm font-medium ${
            message.type === "ok" ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {message.text}
        </p>
      )}

      {/* Saved scenarios */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">Saved scenarios</h2>
        <p className="mt-1 text-sm text-zinc-600">The 10 most recent, read from Supabase.</p>
        {loadError && (
          <p className="mt-2 text-sm text-red-700">Could not load: {loadError}</p>
        )}
        {saved.length === 0 && !loadError ? (
          <p className="mt-4 rounded-xl border border-dashed border-zinc-300 p-5 text-sm text-zinc-500">
            No saved scenarios yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
            <table className="min-w-full divide-y divide-zinc-200 text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-zinc-700">Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-zinc-700">Scenario</th>
                  <th className="px-4 py-2 text-right font-semibold text-zinc-700">Monthly</th>
                  <th className="px-4 py-2 text-right font-semibold text-zinc-700">Annual</th>
                  <th className="px-4 py-2 text-left font-semibold text-zinc-700">Saved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {saved.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-2 font-medium text-zinc-800">{row.name}</td>
                    <td className="px-4 py-2 capitalize text-zinc-600">{row.scenario}</td>
                    <td className="px-4 py-2 text-right text-zinc-800">{formatMXN(row.monthly_revenue)}</td>
                    <td className="px-4 py-2 text-right text-zinc-800">{formatMXN(row.annual_revenue)}</td>
                    <td className="px-4 py-2 text-zinc-500">
                      {new Date(row.created_at).toLocaleString("en-US")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Assumptions */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold text-zinc-900">Assumptions</h2>
        <p className="mt-1 text-sm text-zinc-600">
          These are our own guesses for the simulation.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200 text-sm">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Assumption</th>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Value</th>
                <th className="px-4 py-2 text-left font-semibold text-zinc-700">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {ASSUMPTIONS.map((a) => (
                <tr key={a.name}>
                  <td className="px-4 py-2 font-medium text-zinc-800">{a.name}</td>
                  <td className="px-4 py-2 text-zinc-700">{a.value}</td>
                  <td className="px-4 py-2 text-zinc-600">{a.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
