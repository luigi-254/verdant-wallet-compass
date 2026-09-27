import type { ReactNode } from "react";

import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="border-b border-border bg-primary-soft/50">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        ) : null}
        <h1 className="mt-2 text-3xl font-extrabold text-secondary sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </section>
  );
}
