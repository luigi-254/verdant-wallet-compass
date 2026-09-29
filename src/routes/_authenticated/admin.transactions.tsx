import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/transactions")({
  head: () => ({ meta: [{ title: "Admin transactions — KaziPesa" }, { name: "description", content: "Admin transactions on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Admin transactions" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
