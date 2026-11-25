import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — KaziPesa" },
      { name: "description", content: "How KaziPesa collects, uses and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — KaziPesa" },
      { property: "og:description", content: "How KaziPesa collects, uses and protects your personal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-14 text-sm leading-relaxed text-muted-foreground">
        <p>
          We collect the details you provide when registering — your name, email, phone number and
          M-Pesa number — plus the tasks you submit and the transactions on your account.
        </p>
        <p>
          This information is used to run your account, review your submissions and process
          payments. Your account data is private to you and to platform administrators.
        </p>
        <p>Passwords are never stored in readable form and are managed by our authentication system.</p>
        <p>
          This is placeholder legal text. Have it reviewed and replaced before accepting real users.
        </p>
      </div>
    </SiteLayout>
  );
}
