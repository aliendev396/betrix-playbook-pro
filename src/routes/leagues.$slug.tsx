import { createFileRoute, notFound } from "@tanstack/react-router";
import { MatchCard } from "@/components/match/MatchCard";
import { TeamCrest } from "@/components/common/TeamCrest";
import { EmptyState } from "@/components/common/States";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatDate,
  leagueBySlug,
  matches,
  standingsFor,
  teamById,
  teams,
} from "@/data/football";

export const Route = createFileRoute("/leagues/$slug")({
  loader: ({ params }) => {
    const league = leagueBySlug(params.slug);
    if (!league) throw notFound();
    return { league };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "League not found — BETRIX" }, { name: "robots", content: "noindex" }] };
    }
    const { league } = loaderData;
    return {
      meta: [
        { title: `${league.name} Fixtures & Standings — BETRIX` },
        { name: "description", content: `${league.name} (${league.country}) fixtures, results, standings and teams on BETRIX.` },
        { property: "og:title", content: `${league.name} — BETRIX` },
        { property: "og:description", content: `${league.name} fixtures, results, standings and teams.` },
      ],
    };
  },
  component: LeaguePage,
});

function LeaguePage() {
  const { league } = Route.useLoaderData();
  const fixtures = matches.filter((m) => m.leagueId === league.id && m.status === "SCHEDULED");
  const results = matches.filter((m) => m.leagueId === league.id && m.status === "FINISHED");
  const table = standingsFor(league.id);
  const squad = teams.filter((t) => t.leagueId === league.id);

  return (
    <div className="space-y-5">
      <header className="surface-card flex items-center gap-4 rounded-2xl p-5">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-sm font-extrabold text-white"
          style={{ backgroundColor: league.color }}
        >
          {league.short}
        </span>
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-extrabold">{league.name}</h1>
          <p className="text-sm text-muted-foreground">
            {league.country} · {fixtures.length} upcoming · {squad.length} teams
          </p>
        </div>
      </header>

      <Tabs defaultValue="fixtures">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="fixtures">Fixtures</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
        </TabsList>

        <TabsContent value="fixtures" className="mt-4">
          {fixtures.length === 0 ? (
            <EmptyState title="No upcoming fixtures available." />
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {fixtures.map((m) => (
                <MatchCard key={m.id} match={m} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="results" className="mt-4 space-y-2">
          {results.length === 0 ? (
            <EmptyState title="No results yet." />
          ) : (
            results.map((m) => (
              <div key={m.id} className="surface-card flex items-center justify-between gap-3 rounded-xl px-4 py-3">
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">{teamById(m.homeId).name}</span>
                <span className="tabular rounded-lg bg-surface-2 px-3 py-1 text-sm font-extrabold">
                  {m.homeScore} - {m.awayScore}
                </span>
                <span className="min-w-0 flex-1 truncate text-right text-sm font-semibold">{teamById(m.awayId).name}</span>
                <span className="hidden w-24 shrink-0 text-right text-xs text-muted-foreground sm:block">
                  {formatDate(m.kickoff)}
                </span>
              </div>
            ))
          )}
        </TabsContent>

        <TabsContent value="standings" className="mt-4">
          <div className="surface-card overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 font-medium">#</th>
                  <th className="px-2 py-3 font-medium">Team</th>
                  <th className="px-2 py-3 text-center font-medium">P</th>
                  <th className="px-2 py-3 text-center font-medium">W</th>
                  <th className="px-2 py-3 text-center font-medium">D</th>
                  <th className="px-2 py-3 text-center font-medium">L</th>
                  <th className="px-2 py-3 text-center font-medium">GD</th>
                  <th className="px-4 py-3 text-center font-medium">Pts</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row, i) => (
                  <tr key={row.team.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <TeamCrest team={row.team} size="sm" />
                        <span className="truncate font-medium">{row.team.name}</span>
                      </div>
                    </td>
                    <td className="tabular px-2 py-3 text-center">{row.played}</td>
                    <td className="tabular px-2 py-3 text-center">{row.won}</td>
                    <td className="tabular px-2 py-3 text-center">{row.drawn}</td>
                    <td className="tabular px-2 py-3 text-center">{row.lost}</td>
                    <td className="tabular px-2 py-3 text-center">{row.gf - row.ga}</td>
                    <td className="tabular px-4 py-3 text-center font-bold text-primary">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="teams" className="mt-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {squad.map((team) => (
              <div key={team.id} className="surface-card flex items-center gap-3 rounded-2xl p-4">
                <TeamCrest team={team} size="lg" />
                <div className="min-w-0">
                  <p className="truncate font-semibold">{team.name}</p>
                  <p className="text-xs text-muted-foreground">{team.country}</p>
                  <div className="mt-1.5 flex gap-1">
                    {team.form.map((f, i) => (
                      <span
                        key={i}
                        className={`grid h-5 w-5 place-items-center rounded text-[10px] font-bold ${
                          f === "W"
                            ? "bg-success/20 text-success"
                            : f === "D"
                              ? "bg-muted text-muted-foreground"
                              : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
