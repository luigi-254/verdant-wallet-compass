import { createFileRoute } from "@tanstack/react-router";

import { EmptyState, PageTitle } from "@/components/app/bits";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — KaziPesa" }, { name: "description", content: "Profile on KaziPesa." }] }),
  component: () => (
    <div>
      <PageTitle title="Profile" />
      <EmptyState title="Coming soon" description="This section is still being built." />
    </div>
  ),
});
