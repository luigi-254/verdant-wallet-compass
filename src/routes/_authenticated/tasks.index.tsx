import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/tasks/")({
  head: () => ({ meta: [{ title: "Tasks — KaziPesa" }, { name: "description", content: "Tasks on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Tasks" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
