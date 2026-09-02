export type MatchStatus = "SCHEDULED" | "LIVE" | "FINISHED" | "POSTPONED" | "CANCELLED";

export interface League {
  id: string;
  slug: string;
  name: string;
  country: string;
  short: string;
  color: string;
  active: boolean;
}

export interface Team {
  id: string;
  name: string;
  short: string;
  country: string;
  leagueId: string;
  color: string;
  /** Simple form string, most recent first */
  form: string[];
}

export interface MarketOption {
  id: string;
  label: string;
  multiplier: number;
}

export interface Market {
  id: string;
  name: string;
  status: "ACTIVE" | "SUSPENDED" | "CLOSED";
  options: MarketOption[];
}

export interface Match {
  id: string;
  leagueId: string;
  homeId: string;
  awayId: string;
  kickoff: string; // ISO, server-authoritative in production
  status: MatchStatus;
  minute?: number;
  homeScore?: number;
  awayScore?: number;
  venue: string;
  markets: Market[];
}

export const leagues: League[] = [
  { id: "l1", slug: "premier-league", name: "Premier League", country: "England", short: "PL", color: "#3D195B", active: true },
  { id: "l2", slug: "la-liga", name: "La Liga", country: "Spain", short: "LL", color: "#E01A22", active: true },
  { id: "l3", slug: "serie-a", name: "Serie A", country: "Italy", short: "SA", color: "#0B5EA8", active: true },
  { id: "l4", slug: "bundesliga", name: "Bundesliga", country: "Germany", short: "BL", color: "#D20515", active: true },
  { id: "l5", slug: "ligue-1", name: "Ligue 1", country: "France", short: "L1", color: "#0A1A3C", active: true },
  { id: "l6", slug: "champions-league", name: "Champions League", country: "Europe", short: "UCL", color: "#0B1F5C", active: true },
];

const t = (
  id: string,
  name: string,
  short: string,
  country: string,
  leagueId: string,
  color: string,
  form: string,
): Team => ({ id, name, short, country, leagueId, color, form: form.split("") });

export const teams: Team[] = [
  t("t1", "Manchester United", "MUN", "England", "l1", "#DA291C", "WWLDW"),
  t("t2", "Arsenal", "ARS", "England", "l1", "#EF0107", "WWWDL"),
  t("t3", "Liverpool", "LIV", "England", "l1", "#C8102E", "WDWWW"),
  t("t4", "Manchester City", "MCI", "England", "l1", "#6CABDD", "WWWWD"),
  t("t5", "Chelsea", "CHE", "England", "l1", "#034694", "LWDWL"),
  t("t6", "Tottenham Hotspur", "TOT", "England", "l1", "#132257", "WLWDW"),
  t("t7", "Newcastle United", "NEW", "England", "l1", "#241F20", "DWLWW"),
  t("t8", "Aston Villa", "AVL", "England", "l1", "#95BFE5", "WWDLW"),
  t("t9", "Real Madrid", "RMA", "Spain", "l2", "#FEBE10", "WWWWW"),
  t("t10", "Barcelona", "BAR", "Spain", "l2", "#A50044", "WWDWL"),
  t("t11", "Atlético Madrid", "ATM", "Spain", "l2", "#CB3524", "DWWLW"),
  t("t12", "Sevilla", "SEV", "Spain", "l2", "#D9042B", "LDWLW"),
  t("t13", "Inter Milan", "INT", "Italy", "l3", "#0068A8", "WWWDW"),
  t("t14", "AC Milan", "MIL", "Italy", "l3", "#FB090B", "WLWWD"),
  t("t15", "Juventus", "JUV", "Italy", "l3", "#000000", "DDWWL"),
  t("t16", "Napoli", "NAP", "Italy", "l3", "#12A0D7", "WWLDW"),
  t("t17", "Bayern Munich", "BAY", "Germany", "l4", "#DC052D", "WWWWL"),
  t("t18", "Borussia Dortmund", "BVB", "Germany", "l4", "#FDE100", "WDWLW"),
  t("t19", "RB Leipzig", "RBL", "Germany", "l4", "#DD0741", "LWWDW"),
  t("t20", "Bayer Leverkusen", "B04", "Germany", "l4", "#E32221", "WWWWW"),
  t("t21", "Paris Saint-Germain", "PSG", "France", "l5", "#004170", "WWDWW"),
  t("t22", "Olympique Marseille", "OM", "France", "l5", "#2FAEE0", "DLWWD"),
  t("t23", "AS Monaco", "ASM", "France", "l5", "#E51B22", "WWLWD"),
  t("t24", "Olympique Lyonnais", "OL", "France", "l5", "#1A2B5E", "LWDWW"),
];

export const teamById = (id: string) => teams.find((x) => x.id === id)!;
export const leagueById = (id: string) => leagues.find((x) => x.id === id)!;
export const leagueBySlug = (slug: string) => leagues.find((x) => x.slug === slug);

function markets(seed: number): Market[] {
  const j = (n: number) => Math.round((n + ((seed % 7) - 3) * 0.08) * 100) / 100;
  return [
    {
      id: "1x2",
      name: "Match Result",
      status: "ACTIVE",
      options: [
        { id: "home", label: "Home", multiplier: j(2.1) },
        { id: "draw", label: "Draw", multiplier: j(3.3) },
        { id: "away", label: "Away", multiplier: j(2.9) },
      ],
    },
    {
      id: "dc",
      name: "Double Chance",
      status: seed % 9 === 0 ? "SUSPENDED" : "ACTIVE",
      options: [
        { id: "1x", label: "Home or Draw", multiplier: j(1.32) },
        { id: "12", label: "Home or Away", multiplier: j(1.28) },
        { id: "x2", label: "Draw or Away", multiplier: j(1.45) },
      ],
    },
    {
      id: "ou",
      name: "Total Goals",
      status: "ACTIVE",
      options: [
        { id: "o15", label: "Over 1.5", multiplier: j(1.28) },
        { id: "o25", label: "Over 2.5", multiplier: j(1.85) },
        { id: "u25", label: "Under 2.5", multiplier: j(1.95) },
      ],
    },
    {
      id: "btts",
      name: "Both Teams To Score",
      status: seed % 11 === 0 ? "CLOSED" : "ACTIVE",
      options: [
        { id: "yes", label: "Yes", multiplier: j(1.72) },
        { id: "no", label: "No", multiplier: j(2.05) },
      ],
    },
  ];
}

const DAY = 86400000;
/** Fixed base date so demo data is deterministic across server and client renders. */
const base = new Date();
base.setHours(0, 0, 0, 0);

const pairs: Array<[string, string, string, number, MatchStatus, string]> = [
  ["t1", "t2", "l1", 0, "LIVE", "Old Trafford"],
  ["t3", "t5", "l1", 0, "LIVE", "Anfield"],
  ["t9", "t11", "l2", 0, "LIVE", "Santiago Bernabéu"],
  ["t17", "t19", "l4", 0, "LIVE", "Allianz Arena"],
  ["t4", "t6", "l1", 0, "SCHEDULED", "Etihad Stadium"],
  ["t7", "t8", "l1", 0, "SCHEDULED", "St James' Park"],
  ["t10", "t12", "l2", 0, "SCHEDULED", "Spotify Camp Nou"],
  ["t13", "t14", "l3", 1, "SCHEDULED", "San Siro"],
  ["t15", "t16", "l3", 1, "SCHEDULED", "Allianz Stadium"],
  ["t18", "t20", "l4", 1, "SCHEDULED", "Signal Iduna Park"],
  ["t21", "t22", "l5", 1, "SCHEDULED", "Parc des Princes"],
  ["t23", "t24", "l5", 2, "SCHEDULED", "Stade Louis II"],
  ["t9", "t17", "l6", 2, "SCHEDULED", "Santiago Bernabéu"],
  ["t3", "t21", "l6", 3, "SCHEDULED", "Anfield"],
  ["t2", "t13", "l6", 3, "SCHEDULED", "Emirates Stadium"],
  ["t5", "t8", "l1", 4, "SCHEDULED", "Stamford Bridge"],
  ["t16", "t13", "l3", 4, "SCHEDULED", "Stadio Maradona"],
  ["t20", "t17", "l4", 5, "SCHEDULED", "BayArena"],
  ["t1", "t3", "l1", -1, "FINISHED", "Old Trafford"],
  ["t10", "t9", "l2", -1, "FINISHED", "Spotify Camp Nou"],
  ["t14", "t15", "l3", -2, "FINISHED", "San Siro"],
  ["t21", "t23", "l5", -2, "FINISHED", "Parc des Princes"],
];

export const matches: Match[] = pairs.map(([homeId, awayId, leagueId, day, status, venue], i) => {
  const kickoff = new Date(base.getTime() + day * DAY + (14 + (i % 6)) * 3600000);
  const live = status === "LIVE";
  const finished = status === "FINISHED";
  return {
    id: `m${i + 1}`,
    leagueId,
    homeId,
    awayId,
    kickoff: kickoff.toISOString(),
    status,
    minute: live ? 20 + ((i * 17) % 65) : undefined,
    homeScore: live || finished ? (i * 3) % 4 : undefined,
    awayScore: live || finished ? (i * 5) % 3 : undefined,
    venue,
    markets: markets(i + 1),
  };
});

export const matchById = (id: string) => matches.find((m) => m.id === id);
export const liveMatches = () => matches.filter((m) => m.status === "LIVE");
export const upcomingMatches = () =>
  matches
    .filter((m) => m.status === "SCHEDULED")
    .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
export const finishedMatches = () => matches.filter((m) => m.status === "FINISHED");

export function standingsFor(leagueId: string) {
  return teams
    .filter((x) => x.leagueId === leagueId)
    .map((team, i) => {
      const played = 24;
      const won = 17 - i * 2;
      const drawn = 4 + (i % 3);
      const lost = played - won - drawn;
      return {
        team,
        played,
        won,
        drawn,
        lost,
        gf: 52 - i * 5,
        ga: 20 + i * 4,
        points: won * 3 + drawn,
      };
    })
    .sort((a, b) => b.points - a.points);
}

export function dayBucket(iso: string): "Today" | "Tomorrow" | "Upcoming" {
  const d = new Date(iso);
  const diff = Math.floor((d.getTime() - base.getTime()) / DAY);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return "Upcoming";
}

export function formatKickoff(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
