import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [
    { title: "Transactions — KaziPesa" },
    { name: "description", content: "Review your KaziPesa deposits, withdrawals and task earnings." },
    { property: "og:title", content: "Transactions — KaziPesa" },
    { property: "og:description", content: "Review your KaziPesa deposits, withdrawals and task earnings." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Transactions" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
