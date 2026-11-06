"use client";

import { useState } from "react";

// Copies text to the clipboard and shows "Copied" for 2 seconds.
// If the browser blocks the clipboard, it shows "Copy failed" instead.
export default function CopyButton({ text, label = "Copy" }) {
  const [state, setState] = useState("idle"); // idle | copied | failed

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
    >
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : label}
    </button>
  );
}
