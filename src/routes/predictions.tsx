import { createFileRoute } from "@tanstack/react-router";
import { SlipContent } from "@/components/slip/PredictionSlip";
import { SectionHeading } from "@/components/common/States";

export const Route = createFileRoute("/predictions")({
  head: () => ({
    meta: [
      { title: "My Prediction Slip — BETRIX" },
      { name: "description", content: "Review your BETRIX prediction slip, adjust your virtual points stake and generate a shareable prediction code." },
      { property: "og:title", content: "My Prediction Slip — BETRIX" },
      { property: "og:description", content: "Build football predictions with virtual points and share your prediction code." },
    ],
  }),
  component: PredictionsPage,
});

function PredictionsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <SectionHeading title="My prediction slip" subtitle="Virtual points only — no real money involved." />
      <div className="surface-card rounded-3xl p-4">
        <SlipContent />
      </div>
    </div>
  );
}
