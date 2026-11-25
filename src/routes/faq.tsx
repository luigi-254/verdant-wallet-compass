import { createFileRoute } from "@tanstack/react-router";

import { PageHeader, SiteLayout } from "@/components/site/SiteLayout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — KaziPesa" },
      { name: "description", content: "Answers to common questions about tasks, earnings and M-Pesa withdrawals on KaziPesa." },
      { property: "og:title", content: "FAQ — KaziPesa" },
      { property: "og:description", content: "Common questions about tasks, earnings and withdrawals." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Faq,
});

const ITEMS = [
  {
    q: "How much can I earn?",
    a: "There is no guaranteed amount. Each task shows its own reward, and your earnings depend on which tasks are available and how many you complete successfully.",
  },
  {
    q: "When is a reward added to my balance?",
    a: "After you submit a task it is reviewed. While it waits it shows as pending. Once approved, the reward moves into your available balance.",
  },
  {
    q: "How do withdrawals work?",
    a: "You request a withdrawal to your M-Pesa number from the wallet page. The amount, the fee and what you will receive are shown before you confirm.",
  },
  {
    q: "Is there a withdrawal fee?",
    a: "Yes, a small processing fee is deducted from each withdrawal. The exact fee is shown before you submit the request.",
  },
  {
    q: "How does the referral reward work?",
    a: "You get a personal referral code. When someone signs up with it and completes their first approved task, a referral reward is added to your balance. You cannot refer yourself.",
  },
  {
    q: "Why was my submission rejected?",
    a: "Submissions are rejected when the instructions were not followed or the work could not be verified. The reviewer can leave a note explaining why.",
  },
];

function Faq() {
  return (
    <SiteLayout>
      <PageHeader eyebrow="Support" title="Frequently asked questions" />
      <div className="mx-auto max-w-3xl px-4 py-14">
        <Accordion type="single" collapsible className="surface-card divide-y divide-border px-5">
          {ITEMS.map((item) => (
            <AccordionItem key={item.q} value={item.q} className="border-none">
              <AccordionTrigger className="text-left text-sm font-semibold text-secondary">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SiteLayout>
  );
}
