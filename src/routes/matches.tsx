import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MatchCard } from "@/components/match/MatchCard";
import { EmptyState } from "@/components/common/States";
import { cn } from "@/lib/utils";
import { dayBucket, leagues, upcomingMatches } from "@/data/football";

export const Route = createFileRoute("/matches")({
  head: () => ({
    meta: [
      { title: "Football Fixtures — BETRIX" },
      { name: "description", content: "Browse upcoming football fixtures by day and league, then build your prediction slip." },
      { property: "og:title", content: "Football Fixtures — BETRIX" },
      { property: "og:description", content: "Today, tomorrow and upcoming football fixtures with prediction markets." },
    ],
  }),
  component: MatchesPage,
});

const buckets = ["Today", "Tomorrow", "Upcoming"] as const;

function MatchesPage() {
  const [league, setLeague] = useState<string>("all");
  const all = upcomingMatches().filter((m) => league === "all" || m.leagueId === league);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Matches</h1>
        <p className="text-sm text-muted-foreground">Select outcomes to add them to your prediction slip.</p>
      </header>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
        {[{ id: "all", name: "All leagues", color: "#9EE93B" }, ...leagues].map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => setLeague(l.id)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors",
              league === l.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <span className="h-2.5 w-2.5 rounded-[4px]" style={{ backgroundColor: l.color }} />
            {l.name}
          </button>
        ))}
      </div>

      {all.length === 0 ? (
        <EmptyState title="No upcoming matches available." description="Try a different league filter." />
      ) : (
        <div className="space-y-6">
          {buckets.map((b) => {
            const group = all.filter((m) => dayBucket(m.kickoff) === b);
            if (group.length === 0) return null;
            return (
              <section key={b}>
                <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">{b}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {group.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
