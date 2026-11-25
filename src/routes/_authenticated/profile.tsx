import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [
    { title: "Profile — KaziPesa" },
    { name: "description", content: "Manage your personal details and account settings on KaziPesa." },
    { property: "og:title", content: "Profile — KaziPesa" },
    { property: "og:description", content: "Manage your personal details and account settings on KaziPesa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: () => (
    <div>
      <PageTitle title="Profile" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
