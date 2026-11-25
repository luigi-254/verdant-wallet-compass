import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — KaziPesa" },
      {
        name: "description",
        content: "The four steps to earning on KaziPesa: register, find tasks, submit work, withdraw.",
      },
      { property: "og:title", content: "How It Works — KaziPesa" },
      {
        property: "og:description",
        content: "Register, find tasks, submit your work and withdraw approved earnings by M-Pesa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: HowItWorks,
});

const STEPS = [
  {
    title: "Create an Account",
    body: "Register using your full name, phone number, email and a password. You can add a referral code if someone invited you.",
  },
  {
    title: "Find Available Tasks",
    body: "Your dashboard lists the tasks currently open, with the reward and estimated time for each one.",
  },
  {
    title: "Complete Tasks",
    body: "Read the instructions carefully, do the work, then submit it for review. Rewards stay pending until reviewed.",
  },
  {
    title: "Earn & Withdraw",
    body: "Approved rewards are added to your available balance. Request an M-Pesa withdrawal whenever you reach the minimum.",
  },
];

function HowItWorks() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Getting started"
        title="How KaziPesa works"
        description="A simple four-step process from sign up to payout. Earnings depend on the tasks available and on completing them successfully."
      />
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-14">
        {STEPS.map((s, i) => (
          <div key={s.title} className="surface-card flex gap-4 p-6">
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary">
              {i + 1}
            </span>
            <div>
              <h2 className="text-base font-bold text-secondary">{s.title}</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </SiteLayout>
  );
}
