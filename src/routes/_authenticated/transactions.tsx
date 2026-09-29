import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/transactions")({
  head: () => ({ meta: [{ title: "Transactions — KaziPesa" }, { name: "description", content: "Transactions on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Transactions" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
