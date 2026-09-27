import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/responsible-use")({
  head: () => ({
    meta: [
      { title: "Responsible Use — KaziPesa" },
      { name: "description", content: "How to use KaziPesa responsibly and what to expect from online task work." },
      { property: "og:title", content: "Responsible Use — KaziPesa" },
      { property: "og:description", content: "How to use KaziPesa responsibly and what to expect from online task work." },
    ],
  }),
  component: ResponsibleUse,
});

function ResponsibleUse() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Trust" title="Responsible use" />
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-14 text-sm leading-relaxed text-muted-foreground">
        <p>
          Online task work is a supplement, not a salary. Treat any platform that promises
          guaranteed daily income with caution — including this one, which does not make that claim.
        </p>
        <p>
          Only complete tasks you genuinely understand. If instructions are unclear, ask support
          before submitting.
        </p>
        <p>
          Never share your password. Support will never ask for it, and will never ask you to send
          money to release a withdrawal.
        </p>
        <p>
          If a task asks you to do something unlawful, misleading or unsafe, do not complete it and
          report it.
        </p>
      </div>
    </SiteLayout>
  );
}
