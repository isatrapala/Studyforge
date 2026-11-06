"use client";

import { useState } from "react";
import { saveMarketingAsset } from "@/lib/supabaseClient";

// Save button for one piece of content. It asks for a title first and blocks
// an empty title. On success it calls onSaved() so the page can reload the list.
export default function SaveAssetButton({ assetType, content, onSaved }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // { type: "ok" | "error", text }

  async function handleSave(e) {
    e.preventDefault();
    if (busy) return;
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setMessage({ type: "error", text: "Give it a title first." });
      return;
    }
    setBusy(true);
    const { error } = await saveMarketingAsset({ assetType, title: cleanTitle, content });
    setBusy(false);
    if (error) {
      setMessage({ type: "error", text: `Could not save: ${error.message}` });
      return;
    }
    setMessage({ type: "ok", text: "Saved." });
    setTitle("");
    setOpen(false);
    if (onSaved) onSaved();
  }

  if (!open) {
    return (
      <span className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setMessage(null);
          }}
          className="rounded-md border border-zinc-300 px-3 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
        >
          Save
        </button>
        {message && message.type === "ok" && (
          <span className="text-xs text-emerald-700" role="status">
            {message.text}
          </span>
        )}
      </span>
    );
  }

  return (
    <form onSubmit={handleSave} className="flex flex-wrap items-center gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        aria-label="Asset title"
        className="w-40 rounded-md border border-zinc-300 px-2 py-1 text-xs"
      />
      <button
        type="submit"
        disabled={busy}
        className="rounded-md bg-zinc-900 px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-zinc-700 disabled:bg-zinc-300"
      >
        {busy ? "Saving..." : "Confirm"}
      </button>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-xs text-zinc-600 underline"
      >
        Cancel
      </button>
      {message && message.type === "error" && (
        <span className="w-full text-xs text-red-700" role="alert">
          {message.text}
        </span>
      )}
    </form>
  );
}
