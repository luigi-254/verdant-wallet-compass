import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/transactions")({
  head: () => ({ meta: [
    { title: "Admin transactions — KaziPesa" },
    { name: "description", content: "Review transaction records in KaziPesa administration." },
    { property: "og:title", content: "Admin transactions — KaziPesa" },
    { property: "og:description", content: "Review transaction records in KaziPesa administration." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Admin transactions" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
