import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — KaziPesa" }, { name: "description", content: "Notifications on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Notifications" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
