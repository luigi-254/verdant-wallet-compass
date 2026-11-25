import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/tasks/")({
  head: () => ({ meta: [
    { title: "Tasks — KaziPesa" },
    { name: "description", content: "Browse tasks available to complete on KaziPesa." },
    { property: "og:title", content: "Tasks — KaziPesa" },
    { property: "og:description", content: "Browse tasks available to complete on KaziPesa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Tasks" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
