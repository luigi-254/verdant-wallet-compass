import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/tasks")({
  head: () => ({ meta: [{ title: "Admin tasks — KaziPesa" }, { name: "description", content: "Admin tasks on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Admin tasks" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
