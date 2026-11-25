import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — KaziPesa" },
      { name: "description", content: "Get in touch with the KaziPesa support team." },
      { property: "og:title", content: "Contact — KaziPesa" },
      { property: "og:description", content: "Get in touch with the KaziPesa support team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Contact"
        title="Talk to us"
        description="Questions about a task, a submission or a withdrawal? Reach the support team."
      />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <div className="surface-card space-y-4 p-6 text-sm">
          <p className="text-muted-foreground">
            Support contact details have not been set yet. Add the real email address, phone number
            and support hours you want shown here and I will put them in.
          </p>
          <p className="text-muted-foreground">
            When you contact support about a payment, include the transaction reference shown on
            your transactions page so it can be traced quickly.
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
