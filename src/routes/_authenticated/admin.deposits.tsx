import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/deposits")({
  head: () => ({ meta: [{ title: "Admin deposits — KaziPesa" }, { name: "description", content: "Admin deposits on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Admin deposits" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
