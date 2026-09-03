import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { formatKickoff, leagues, matches, teamById, upcomingMatches } from "@/data/football";

export const Route = createFileRoute("/leagues/")({
  head: () => ({
    meta: [
      { title: "Football Leagues — BETRIX" },
      { name: "description", content: "Explore Premier League, La Liga, Serie A, Bundesliga, Ligue 1 and Champions League fixtures." },
      { property: "og:title", content: "Football Leagues — BETRIX" },
      { property: "og:description", content: "Fixtures, results, standings and teams across Europe's biggest competitions." },
    ],
  }),
  component: LeaguesPage,
});

function LeaguesPage() {
  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-extrabold">Leagues</h1>
        <p className="text-sm text-muted-foreground">Fixtures, results, standings and teams.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {leagues.map((l) => {
          const count = matches.filter((m) => m.leagueId === l.id).length;
          const next = upcomingMatches().filter((m) => m.leagueId === l.id).slice(0, 2);
          return (
            <Link
              key={l.id}
              to="/leagues/$slug"
              params={{ slug: l.slug }}
              className="surface-card group rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xs font-extrabold text-white"
                  style={{ backgroundColor: l.color }}
                >
                  {l.short}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{l.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {l.country} · {count} matches
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </div>
              <ul className="mt-3 space-y-1.5 border-t border-border pt-3">
                {next.length === 0 ? (
                  <li className="text-xs text-muted-foreground">No upcoming fixtures.</li>
                ) : (
                  next.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2 text-xs">
                      <span className="truncate text-muted-foreground">
                        {teamById(m.homeId).short} vs {teamById(m.awayId).short}
                      </span>
                      <span className="tabular shrink-0 font-medium">{formatKickoff(m.kickoff)}</span>
                    </li>
                  ))
                )}
              </ul>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
