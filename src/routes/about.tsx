import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — KaziPesa" },
      {
        name: "description",
        content: "KaziPesa is an online task platform for people in Kenya who want to earn from simple digital work.",
      },
      { property: "og:title", content: "About — KaziPesa" },
      {
        property: "og:description",
        content: "An online task platform for people in Kenya who want to earn from simple digital work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="About us"
        title="A straightforward way to work online"
        description="KaziPesa connects people with small, clearly described online tasks and keeps the earnings side transparent."
      />
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-14 text-sm leading-relaxed text-muted-foreground">
        <p>
          KaziPesa exists to make online task work clear and predictable. Every task shows what is
          required, how long it should take and exactly what it pays before you start.
        </p>
        <p>
          Submitted work is reviewed before a reward is approved. Once approved, the amount moves
          into your available balance and can be withdrawn to your M-Pesa number.
        </p>
        <p>
          We do not promise a fixed income. What you earn depends entirely on the tasks available at
          the time and on completing them to the standard described.
        </p>
      </div>
    </SiteLayout>
  );
}
