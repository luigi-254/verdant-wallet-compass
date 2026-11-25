import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/withdrawals")({
  head: () => ({ meta: [
    { title: "Admin withdrawals — KaziPesa" },
    { name: "description", content: "Review and manage KaziPesa withdrawal requests." },
    { property: "og:title", content: "Admin withdrawals — KaziPesa" },
    { property: "og:description", content: "Review and manage KaziPesa withdrawal requests." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Admin withdrawals" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
