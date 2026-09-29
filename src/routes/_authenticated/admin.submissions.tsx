import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/submissions")({
  head: () => ({ meta: [{ title: "Admin submissions — KaziPesa" }, { name: "description", content: "Admin submissions on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Admin submissions" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
