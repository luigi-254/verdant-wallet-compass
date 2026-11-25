import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — KaziPesa" },
      { name: "description", content: "The terms that apply to using the KaziPesa task platform." },
      { property: "og:title", content: "Terms & Conditions — KaziPesa" },
      { property: "og:description", content: "The terms that apply to using the KaziPesa task platform." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Terms & Conditions" />
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-14 text-sm leading-relaxed text-muted-foreground">
        <p>
          By creating a KaziPesa account you agree to complete tasks honestly and to follow the
          instructions given for each task.
        </p>
        <p>
          Earnings are not guaranteed. What you earn depends on the tasks available at the time and
          on your submissions being approved after review.
        </p>
        <p>
          Submissions that are incomplete, copied, automated or impossible to verify may be
          rejected. Repeated abuse may lead to an account being suspended.
        </p>
        <p>
          Withdrawals are paid to the M-Pesa number on your account. A processing fee is deducted
          and shown before you confirm a request.
        </p>
        <p>
          This is placeholder legal text. Have it reviewed and replaced with terms written for your
          business before accepting real users or real money.
        </p>
      </div>
    </SiteLayout>
  );
}
