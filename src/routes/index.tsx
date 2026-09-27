import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Clock,
  Gift,
  LineChart,
  ListChecks,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KaziPesa — Earn online, complete tasks, get paid" },
      {
        name: "description",
        content:
          "Complete simple online tasks on KaziPesa, track your earnings and withdraw conveniently through M-Pesa.",
      },
      { property: "og:title", content: "KaziPesa — Earn online, complete tasks, get paid" },
      {
        property: "og:description",
        content: "Complete simple online tasks, build your earnings and withdraw through M-Pesa.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  { title: "Create an Account", body: "Register with your name, phone number, email and password." },
  { title: "Find Available Tasks", body: "Browse the tasks available on your dashboard." },
  { title: "Complete Tasks", body: "Follow the instructions and submit your completed work." },
  { title: "Earn & Withdraw", body: "Receive approved earnings and request an M-Pesa withdrawal." },
];

const FEATURES = [
  { icon: ListChecks, title: "Online Tasks", body: "Surveys, data entry, research and more." },
  { icon: LineChart, title: "Fast Earnings Tracking", body: "See approved and pending earnings." },
  { icon: Wallet, title: "M-Pesa Withdrawals", body: "Request payouts to your M-Pesa number." },
  { icon: Gift, title: "Referral Rewards", body: "Earn when people you invite complete tasks." },
  { icon: Clock, title: "Transaction History", body: "Every movement on your account, recorded." },
  { icon: ShieldCheck, title: "Secure Account", body: "Protected sign-in and private account data." },
  { icon: Smartphone, title: "Mobile Friendly", body: "Built for phones first." },
  { icon: BadgeCheck, title: "24/7 Access", body: "Work whenever it suits your schedule." },
];

function Index() {
  return (
    <SiteLayout>
      <section className="hero-gradient text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Earn Online. Complete Tasks. Get Paid.
            </h1>
            <p className="mt-4 max-w-lg text-base text-primary-foreground/80">
              Complete simple online tasks, build your earnings, and withdraw conveniently through
              M-Pesa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-primary-foreground/60">
              Earnings depend on the tasks available and on completing them successfully.
            </p>
          </div>

          <div className="surface-card p-5 text-foreground">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Your dashboard
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["Available balance", "Total earnings", "Pending earnings", "Withdrawals"].map(
                (label, i) => (
                  <div key={label} className="rounded-xl border border-border bg-muted/50 p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <div
                      className={`mt-3 h-2 rounded-full ${i % 2 === 0 ? "w-3/4 bg-primary" : "w-1/2 bg-secondary/40"}`}
                    />
                  </div>
                ),
              )}
            </div>
            <div className="mt-4 space-y-2">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
                >
                  <div className="h-2 w-24 rounded-full bg-muted" />
                  <div className="h-2 w-12 rounded-full bg-primary/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">How it works</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="surface-card p-5">
              <span className="inline-flex size-9 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary">
                {i + 1}
              </span>
              <h3 className="mt-4 text-base font-bold text-secondary">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl font-extrabold text-secondary sm:text-3xl">
            Everything you need to work and get paid
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="surface-card p-5">
                <f.icon className="size-6 text-primary" />
                <h3 className="mt-3 text-sm font-bold text-secondary">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="surface-card flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-secondary">Ready to start earning?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a free account and browse the tasks available today.
            </p>
          </div>
          <Button size="lg" asChild>
            <Link to="/register">Create Account</Link>
          </Button>
        </div>
      </section>
    </SiteLayout>
  );
}
