import { createFileRoute, Link } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { EmptyState, SectionHeading } from "@/components/common/States";
import { TeamCrest } from "@/components/common/TeamCrest";
import { formatDate, formatKickoff, leagues, matches, teamById, teams, leagueById } from "@/data/football";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search Matches, Teams & Leagues — BETRIX" },
      { name: "description", content: "Search BETRIX for football matches, teams and competitions to build your next prediction." },
      { property: "og:title", content: "Search — BETRIX" },
      { property: "og:description", content: "Find matches, teams and leagues across the BETRIX football catalogue." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (query.length < 2) return null;
    return {
      teams: teams.filter((t) => t.name.toLowerCase().includes(query) || t.short.toLowerCase().includes(query)).slice(0, 8),
      leagues: leagues.filter((l) => l.name.toLowerCase().includes(query) || l.country.toLowerCase().includes(query)),
      matches: matches
        .filter((m) => {
          const h = teamById(m.homeId);
          const a = teamById(m.awayId);
          return h.name.toLowerCase().includes(query) || a.name.toLowerCase().includes(query);
        })
        .slice(0, 10),
    };
  }, [query]);

  return (
    <div className="space-y-4">
      <SectionHeading title="Search" subtitle="Matches, teams and competitions" />

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search teams, leagues or fixtures"
          aria-label="Search BETRIX"
          className="h-12 pl-10"
        />
      </div>

      {!results ? (
        <EmptyState title="Start typing" description="Enter at least 2 characters to search." icon={<SearchIcon className="h-5 w-5" />} />
      ) : results.teams.length + results.leagues.length + results.matches.length === 0 ? (
        <EmptyState title="No results" description={`Nothing matched "${q}".`} icon={<SearchIcon className="h-5 w-5" />} />
      ) : (
        <div className="space-y-5">
          {results.matches.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold">Matches</h2>
              <div className="space-y-2">
                {results.matches.map((m) => (
                  <Link
                    key={m.id}
                    to="/match/$matchId"
                    params={{ matchId: m.id }}
                    className="surface-card flex items-center justify-between gap-3 rounded-2xl p-3"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">
                        {teamById(m.homeId).name} vs {teamById(m.awayId).name}
                      </span>
                      <span className="tabular block text-xs text-muted-foreground">
                        {leagueById(m.leagueId).name} · {formatDate(m.kickoff)} {formatKickoff(m.kickoff)}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {results.teams.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold">Teams</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {results.teams.map((t) => (
                  <div key={t.id} className="surface-card flex items-center gap-3 rounded-2xl p-3">
                    <TeamCrest team={t} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{t.name}</span>
                      <span className="block text-xs text-muted-foreground">{leagueById(t.leagueId).name}</span>
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {results.leagues.length > 0 ? (
            <section>
              <h2 className="mb-2 text-sm font-semibold">Leagues</h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {results.leagues.map((l) => (
                  <Link key={l.id} to="/leagues/$slug" params={{ slug: l.slug }} className="surface-card rounded-2xl p-3">
                    <span className="block text-sm font-semibold">{l.name}</span>
                    <span className="block text-xs text-muted-foreground">{l.country}</span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
