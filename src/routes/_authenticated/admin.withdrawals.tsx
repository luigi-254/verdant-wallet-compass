import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/withdrawals")({
  head: () => ({ meta: [{ title: "Admin withdrawals — KaziPesa" }, { name: "description", content: "Admin withdrawals on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Admin withdrawals" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
