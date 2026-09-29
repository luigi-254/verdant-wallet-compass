import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Admin users — KaziPesa" }, { name: "description", content: "Admin users on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Admin users" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
