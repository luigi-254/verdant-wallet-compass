import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [{ title: "Admin settings — KaziPesa" }, { name: "description", content: "Admin settings on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Admin settings" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
