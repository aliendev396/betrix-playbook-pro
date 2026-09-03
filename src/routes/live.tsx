import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Radio } from "lucide-react";
import { LiveMatchCard } from "@/components/match/LiveMatchCard";
import { CardSkeleton, EmptyState } from "@/components/common/States";
import { liveMatches } from "@/data/football";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live Football — BETRIX" },
      { name: "description", content: "Live football scores updating in real time across Europe's top leagues." },
      { property: "og:title", content: "Live Football — BETRIX" },
      { property: "og:description", content: "Live scores, minutes and match status updating without a refresh." },
    ],
  }),
  component: LivePage,
});

function LivePage() {
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 450);
    const i = setInterval(() => setTick((x) => x + 1), 15000);
    return () => {
      clearTimeout(t);
      clearInterval(i);
    };
  }, []);

  const live = liveMatches().map((m) => ({ ...m, minute: Math.min(90, (m.minute ?? 0) + tick) }));

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-live/15 text-live">
          <Radio className="h-5 w-5" />
        </span>
        <div>
          <h1 className="text-2xl font-extrabold">Live Now</h1>
          <p className="text-sm text-muted-foreground">Scores refresh automatically — no reload needed.</p>
        </div>
      </header>

      {loading ? (
        <CardSkeleton rows={3} />
      ) : live.length === 0 ? (
        <EmptyState title="No live matches right now" description="Live fixtures will appear here as soon as they kick off." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {live.map((m) => (
            <LiveMatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
