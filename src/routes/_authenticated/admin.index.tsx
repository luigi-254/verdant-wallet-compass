import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [
    { title: "Admin overview — KaziPesa" },
    { name: "description", content: "Review the KaziPesa administration overview." },
    { property: "og:title", content: "Admin overview — KaziPesa" },
    { property: "og:description", content: "Review the KaziPesa administration overview." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Admin overview" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
