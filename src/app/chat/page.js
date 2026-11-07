"use client";

import { useEffect, useRef, useState } from "react";
import {
  INTAKE_QUESTIONS,
  SIMULATED_LABEL,
  validateAnswer,
  checkGuardrails,
  buildStudyPlan,
  summarizeSession,
} from "@/lib/chatEngine";
import { saveChatSession } from "@/lib/supabaseClient";

const GREETING =
  "Hi! I am the StudyForge guided assistant. I will ask you 3 short questions about your exam and then give you a simple study plan.";

function firstMessages() {
  return [
    { role: "assistant", kind: "normal", text: GREETING },
    { role: "assistant", kind: "normal", text: INTAKE_QUESTIONS[0].text, hint: INTAKE_QUESTIONS[0].hint },
  ];
}

export default function ChatPage() {
  const [messages, setMessages] = useState(firstMessages);
  const [step, setStep] = useState(0); // 0..2 = intake questions, 3 = plan done, 4 = ended early
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const [saveStatus, setSaveStatus] = useState(null); // { type: "ok" | "error", text }
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current && bottomRef.current.scrollIntoView) {
      bottomRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  function add(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  async function finishSession({ outcome, category, finalAnswers }) {
    const summary = summarizeSession({ answers: finalAnswers, outcome, category });
    const { error } = await saveChatSession({ answers: finalAnswers, outcome, summary });
    setSaveStatus(
      error
        ? { type: "error", text: `The session was not saved: ${error.message}` }
        : { type: "ok", text: "Session saved." }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || step >= 4) return;
    setInput("");
    add({ role: "user", kind: "normal", text });

    // Guardrails run on every message. After the plan, free text must be about studying.
    const guard = checkGuardrails(text, { requireStudyTopic: step === 3 });
    if (guard.type !== "ok") {
      add({ role: "assistant", kind: guard.type === "human" ? "human" : "guardrail", text: guard.message });
      setStep(4);
      await finishSession({ outcome: guard.type, category: guard.category, finalAnswers: answers });
      return;
    }

    if (step === 3) {
      add({
        role: "assistant",
        kind: "normal",
        text: "In this simple version I can only give the plan above. Press Start over to make a new plan.",
      });
      return;
    }

    const q = INTAKE_QUESTIONS[step];
    const result = validateAnswer(q.id, text);
    if (!result.ok) {
      add({ role: "assistant", kind: "normal", text: `${result.error} ${q.text}`, hint: q.hint });
      return;
    }

    const nextAnswers = { ...answers, [q.id]: result.value };
    setAnswers(nextAnswers);

    if (step < 2) {
      const next = INTAKE_QUESTIONS[step + 1];
      setStep(step + 1);
      add({ role: "assistant", kind: "normal", text: next.text, hint: next.hint });
      return;
    }

    const plan = buildStudyPlan(nextAnswers);
    setStep(3);
    add({ role: "assistant", kind: "plan", text: "Here is your study plan:", plan });
    await finishSession({ outcome: "plan", finalAnswers: nextAnswers });
  }

  function handleStartOver() {
    setMessages(firstMessages());
    setStep(0);
    setAnswers({});
    setInput("");
    setSaveStatus(null);
  }

  const stepLabel = step < 3 ? `Question ${step + 1} of 3` : "Done";

  return (
    <main className="flex-1">
      <section className="border-b border-zinc-200 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            Week 5 &middot; Public Chatbot / Guided Assistant
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">Study helper</h1>
          <p className="mt-2 text-zinc-600">
            Answer 3 questions and get a simple study plan for your exam.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
        <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900">
          {SIMULATED_LABEL}
        </p>

        <div className="rounded-xl border border-zinc-200">
          <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-2 text-xs text-zinc-600">
            <span>{stepLabel}</span>
            <button
              type="button"
              onClick={handleStartOver}
              className="rounded-md border border-zinc-300 px-3 py-1 font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Start over
            </button>
          </div>

          <div className="max-h-[28rem] space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((m, i) => (
              <Bubble key={i} message={m} />
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-zinc-200 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={step >= 4}
              aria-label="Your message"
              placeholder={step >= 4 ? "This session ended. Press Start over." : "Type your answer..."}
              className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm disabled:bg-zinc-100"
            />
            <button
              type="submit"
              disabled={step >= 4 || !input.trim()}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:bg-zinc-300"
            >
              Send
            </button>
          </form>
        </div>

        {saveStatus && (
          <p
            className={`text-sm ${saveStatus.type === "ok" ? "text-emerald-700" : "text-red-700"}`}
            role={saveStatus.type === "ok" ? "status" : "alert"}
          >
            {saveStatus.text}
          </p>
        )}
      </div>
    </main>
  );
}

function Bubble({ message }) {
  const isUser = message.role === "user";
  if (isUser) {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-zinc-900 px-4 py-2 text-sm text-white">
          {message.text}
        </p>
      </div>
    );
  }

  const style =
    message.kind === "guardrail"
      ? "border border-red-300 bg-red-50 text-red-900"
      : message.kind === "human"
        ? "border border-indigo-300 bg-indigo-50 text-indigo-900"
        : "bg-zinc-100 text-zinc-900";

  return (
    <div className="flex justify-start">
      <div className={`max-w-[90%] rounded-2xl rounded-bl-sm px-4 py-2 text-sm ${style}`}>
        {message.kind === "guardrail" && <p className="mb-1 font-semibold">Guardrail</p>}
        {message.kind === "human" && <p className="mb-1 font-semibold">Human checkpoint</p>}
        <p>{message.text}</p>
        {message.hint && <p className="mt-1 text-xs text-zinc-500">{message.hint}</p>}
        {message.plan && (
          <div className="mt-3 rounded-lg border border-zinc-200 bg-white p-3">
            <p className="font-semibold text-zinc-900">{message.plan.title}</p>
            <ul className="mt-2 space-y-2">
              {message.plan.lines.map((line) => (
                <li key={line.day}>
                  <span className="font-semibold">{line.day}:</span> {line.text}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-zinc-600">{message.plan.summary}</p>
            <p className="mt-1 text-xs text-zinc-600">{message.plan.note}</p>
          </div>
        )}
      </div>
    </div>
  );
}
