import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [
    { title: "Notifications — KaziPesa" },
    { name: "description", content: "View account and task updates from KaziPesa." },
    { property: "og:title", content: "Notifications — KaziPesa" },
    { property: "og:description", content: "View account and task updates from KaziPesa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Notifications" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
