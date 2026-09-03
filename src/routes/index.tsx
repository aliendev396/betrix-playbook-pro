import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Ticket, TrendingUp, Trophy } from "lucide-react";
import { LiveMatchCard } from "@/components/match/LiveMatchCard";
import { MatchCard } from "@/components/match/MatchCard";
import { EmptyState, SectionHeading } from "@/components/common/States";
import { Button } from "@/components/ui/button";
import { formatPoints, useBetrix } from "@/store/betrix";
import { dayBucket, leagues, liveMatches, upcomingMatches } from "@/data/football";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BETRIX — Football Predictions with Virtual Points" },
      { name: "description", content: "Follow live football, build prediction slips and compete with virtual points on BETRIX." },
      { property: "og:title", content: "BETRIX — Football Predictions with Virtual Points" },
      { property: "og:description", content: "Live scores, upcoming fixtures and prediction slips powered by virtual points." },
    ],
  }),
  component: HomePage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function HomePage() {
  const { points, profile, slip } = useBetrix();
  const live = liveMatches();
  const upcoming = upcomingMatches();
  const buckets: Array<"Today" | "Tomorrow" | "Upcoming"> = ["Today", "Tomorrow", "Upcoming"];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="surface-card rise-in overflow-hidden rounded-3xl p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">{greeting()},</p>
            <h1 className="truncate text-2xl font-extrabold sm:text-3xl">{profile.name.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {slip.length > 0 ? `${slip.length} selection${slip.length > 1 ? "s" : ""} in your slip` : "Ready to make your next call?"}
            </p>
          </div>
          <div className="rounded-2xl border border-primary/25 bg-primary/10 px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">Virtual Points</p>
            <p className="tabular mt-1 text-3xl font-extrabold text-primary">
              {formatPoints(points)} <span className="text-sm font-bold opacity-70">PTS</span>
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/matches">
              <Trophy className="mr-2 h-4 w-4" /> Predict now
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/code">
              <Ticket className="mr-2 h-4 w-4" /> Load code
            </Link>
          </Button>
          <Button asChild size="sm" variant="ghost">
            <Link to="/points">
              <TrendingUp className="mr-2 h-4 w-4" /> Points overview
            </Link>
          </Button>
        </div>
      </section>

      {/* Live now */}
      <section>
        <SectionHeading
          title="Live Now"
          action={
            <Link to="/live" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        {live.length === 0 ? (
          <EmptyState title="No live matches right now" description="Check the upcoming fixtures below." />
        ) : (
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 lg:mx-0 lg:grid lg:grid-cols-3 lg:px-0">
            {live.map((m) => (
              <LiveMatchCard key={m.id} match={m} className="w-[240px] shrink-0 snap-start lg:w-auto" />
            ))}
          </div>
        )}
      </section>

      {/* Leagues strip */}
      <section>
        <SectionHeading
          title="Leagues"
          action={
            <Link to="/leagues" className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
              All leagues <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
          {leagues.map((l) => (
            <Link
              key={l.id}
              to="/leagues/$slug"
              params={{ slug: l.slug }}
              className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold transition-colors hover:border-primary/50"
            >
              <span className="h-2.5 w-2.5 rounded-[4px]" style={{ backgroundColor: l.color }} />
              {l.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Upcoming */}
      <section>
        <SectionHeading title="Upcoming Matches" />
        <div className="space-y-6">
          {buckets.map((bucket) => {
            const group = upcoming.filter((m) => dayBucket(m.kickoff) === bucket);
            if (group.length === 0) return null;
            return (
              <div key={bucket}>
                <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">{bucket}</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {group.map((m) => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            );
          })}
          {upcoming.length === 0 ? <EmptyState title="No upcoming matches available." /> : null}
        </div>
      </section>
    </div>
  );
}
