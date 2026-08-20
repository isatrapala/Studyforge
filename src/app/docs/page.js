export const metadata = {
  title: "Docs — StudyForge AI",
  description: "Documentation placeholder for StudyForge AI.",
};

export default function DocsPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <p className="text-sm font-medium uppercase tracking-wide text-indigo-600">
        Documentation
      </p>
      <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
        Docs are coming soon
      </h1>
      <p className="mt-4 text-zinc-600">
        This page is a placeholder for the Setup Sprint (Builder
        Infrastructure) week. As StudyForge AI grows week over week, this is
        where setup instructions, feature guides, and API notes for the
        project will live.
      </p>

      <div className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6">
        <h2 className="text-sm font-semibold text-zinc-900">
          Planned sections
        </h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-zinc-600">
          <li>Getting started &amp; local setup</li>
          <li>How the AI-native study plan generator works</li>
          <li>Data model (Supabase tables)</li>
          <li>Testing checklist</li>
        </ul>
      </div>
    </main>
  );
}
