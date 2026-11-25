import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/tasks")({
  head: () => ({ meta: [
    { title: "Admin tasks — KaziPesa" },
    { name: "description", content: "Manage the tasks available to KaziPesa members." },
    { property: "og:title", content: "Admin tasks — KaziPesa" },
    { property: "og:description", content: "Manage the tasks available to KaziPesa members." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Admin tasks" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
