import { createFileRoute, notFound } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { LiveBadge } from "@/components/match/LiveMatchCard";
import { TeamCrest } from "@/components/common/TeamCrest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useBetrix } from "@/store/betrix";
import { cn } from "@/lib/utils";
import { formatDate, formatKickoff, leagueById, matchById, teamById } from "@/data/football";

export const Route = createFileRoute("/match/$matchId")({
  loader: ({ params }) => {
    const match = matchById(params.matchId);
    if (!match) throw notFound();
    return { match };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Match not found — BETRIX" }, { name: "robots", content: "noindex" }] };
    }
    const { match } = loaderData;
    const title = `${teamById(match.homeId).name} vs ${teamById(match.awayId).name} — BETRIX`;
    return {
      meta: [
        { title },
        { name: "description", content: `${leagueById(match.leagueId).name} match preview, prediction markets, statistics, lineups and form.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `Prediction markets, statistics and form for ${teamById(match.homeId).short} vs ${teamById(match.awayId).short}.` },
      ],
    };
  },
  component: MatchPage,
});

function StatBar({ label, home, away }: { label: string; home: number; away: number }) {
  const total = home + away || 1;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="tabular font-semibold">{home}</span>
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular font-semibold">{away}</span>
      </div>
      <div className="mt-1.5 flex h-1.5 overflow-hidden rounded-full bg-muted">
        <span className="bg-primary" style={{ width: `${(home / total) * 100}%` }} />
        <span className="flex-1 bg-chart-2" />
      </div>
    </div>
  );
}

function MatchPage() {
  const { match } = Route.useLoaderData();
  const { toggleSelection, isSelected } = useBetrix();
  const home = teamById(match.homeId);
  const away = teamById(match.awayId);
  const league = leagueById(match.leagueId);
  const seed = Number(match.id.replace("m", ""));

  return (
    <div className="space-y-5">
      <header className="surface-card rounded-3xl p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 rounded-[3px]" style={{ backgroundColor: league.color }} />
            {league.name}
          </span>
          {match.status === "LIVE" ? (
            <LiveBadge minute={match.minute} />
          ) : (
            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
              {match.status}
            </Badge>
          )}
        </div>

        <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <TeamCrest team={home} size="lg" />
            <span className="truncate text-sm font-semibold">{home.name}</span>
          </div>
          <div className="text-center">
            {match.homeScore != null ? (
              <p className="tabular text-3xl font-extrabold">
                {match.homeScore} <span className="text-muted-foreground">—</span> {match.awayScore}
              </p>
            ) : (
              <p className="text-lg font-extrabold tracking-widest text-muted-foreground">VS</p>
            )}
            <p className="tabular mt-1 text-xs text-muted-foreground">
              {formatDate(match.kickoff)} · {formatKickoff(match.kickoff)}
            </p>
          </div>
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <TeamCrest team={away} size="lg" />
            <span className="truncate text-sm font-semibold">{away.name}</span>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted-foreground">{match.venue}</p>
      </header>

      <Tabs defaultValue="predictions">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="lineups">Lineups</TabsTrigger>
          <TabsTrigger value="form">Form</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-3">
          <div className="surface-card space-y-2 rounded-2xl p-4 text-sm">
            <Row label="Competition" value={league.name} />
            <Row label="Venue" value={match.venue} />
            <Row label="Kickoff (server time)" value={`${formatDate(match.kickoff)} · ${formatKickoff(match.kickoff)}`} />
            <Row label="Status" value={match.status} />
            <Row label="Markets open" value={String(match.markets.filter((m) => m.status === "ACTIVE").length)} />
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="mt-4 space-y-3">
          {match.markets.map((market) => {
            const disabled = market.status !== "ACTIVE";
            return (
              <section key={market.id} className="surface-card rounded-2xl p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{market.name}</h3>
                  {disabled ? (
                    <Badge variant="outline" className="gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                      <Lock className="h-3 w-3" /> {market.status}
                    </Badge>
                  ) : null}
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {market.options.map((opt) => {
                    const active = isSelected(match.id, market.id, opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={disabled}
                        aria-pressed={active}
                        onClick={() =>
                          toggleSelection({
                            matchId: match.id,
                            marketId: market.id,
                            marketName: market.name,
                            optionId: opt.id,
                            optionLabel: opt.label,
                            multiplier: opt.multiplier,
                          })
                        }
                        className={cn(
                          "flex items-center justify-between gap-2 rounded-xl border border-border bg-surface-2/60 px-3 py-3 text-left transition-all duration-150 active:scale-[0.98]",
                          "disabled:cursor-not-allowed disabled:opacity-40",
                          active ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary/50",
                        )}
                      >
                        <span className="truncate text-xs font-semibold">{opt.label}</span>
                        <span className="tabular text-sm font-extrabold">{opt.multiplier.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <div className="surface-card space-y-4 rounded-2xl p-5">
            <StatBar label="Possession %" home={48 + (seed % 8)} away={52 - (seed % 8)} />
            <StatBar label="Shots" home={9 + (seed % 5)} away={7 + (seed % 4)} />
            <StatBar label="Shots on target" home={4 + (seed % 3)} away={3 + (seed % 3)} />
            <StatBar label="Corners" home={5 + (seed % 4)} away={4 + (seed % 3)} />
            <StatBar label="Fouls" home={10 + (seed % 4)} away={12 - (seed % 4)} />
          </div>
        </TabsContent>

        <TabsContent value="lineups" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {[home, away].map((team) => (
              <div key={team.id} className="surface-card rounded-2xl p-4">
                <div className="flex items-center gap-2">
                  <TeamCrest team={team} size="sm" />
                  <p className="truncate text-sm font-semibold">{team.name}</p>
                  <span className="ml-auto text-xs text-muted-foreground">4-3-3</span>
                </div>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {Array.from({ length: 11 }).map((_, i) => (
                    <li key={i} className="flex items-center gap-3 border-b border-border/50 py-1 last:border-0">
                      <span className="tabular w-6 text-xs text-muted-foreground">{i + 1}</span>
                      <span className="truncate">
                        {team.short} Player {i + 1}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="form" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {[home, away].map((team) => (
              <div key={team.id} className="surface-card rounded-2xl p-4">
                <p className="text-sm font-semibold">{team.name}</p>
                <p className="text-xs text-muted-foreground">Last 5 matches</p>
                <div className="mt-3 flex gap-1.5">
                  {team.form.map((f, i) => (
                    <span
                      key={i}
                      className={cn(
                        "grid h-8 w-8 place-items-center rounded-lg text-xs font-bold",
                        f === "W" ? "bg-success/20 text-success" : f === "D" ? "bg-muted text-muted-foreground" : "bg-destructive/20 text-destructive",
                      )}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/50 py-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-medium">{value}</span>
    </div>
  );
}
