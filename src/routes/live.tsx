import React, { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Lock,
  Radio,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useBetrix, type Selection } from "@/store/betrix";
import { teamById, leagueById, matches as seedMatches, type Match } from "@/data/football";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/live")({
  head: () => ({
    meta: [
      { title: "Live In-Play Sports — BETRIX" },
      { name: "description", content: "Real-time live in-play sports betting, scores, and odds updates." },
    ],
  }),
  component: LivePage,
});

// Expanded Mock Live Matches across different sports to fulfill Tennis, Football, Basketball, etc.
const extraLiveSportsMatches = [
  {
    id: "live-tennis-1",
    sportId: "tennis",
    leagueName: "ATP Challenger Columbus, USA Men Singles",
    period: "set 2",
    homeName: "Kozlov, Stefan",
    awayName: "Trotter, James Kent",
    homeScore: 1,
    awayScore: 0,
    markets: [
      {
        id: "1x2",
        name: "1X2",
        options: [
          { id: "opt-t1-1", label: "1", multiplier: 0, locked: true },
          { id: "opt-t1-[#]", label: "X", multiplier: 12.00, locked: false },
          { id: "opt-t1-2", label: "2", multiplier: 0, locked: true },
        ],
      },
      {
        id: "over_under",
        name: "Over/Under",
        options: [
          { id: "opt-t1-o", label: "Over 21.5", multiplier: 1.85, locked: false },
          { id: "opt-t1-u", label: "Under 21.5", multiplier: 1.95, locked: false },
        ],
      },
    ],
  },
  {
    id: "live-tennis-2",
    sportId: "tennis",
    leagueName: "SRL Fall Invitational Tulsa (OK), USA",
    period: "set 1",
    homeName: "Duckworth, James (Srl)",
    awayName: "Sonego, Lorenzo (Srl)",
    homeScore: 0,
    awayScore: 0,
    markets: [
      {
        id: "1x2",
        name: "1X2",
        options: [
          { id: "opt-t2-1", label: "1", multiplier: 2.15, locked: false },
          { id: "opt-t2-2", label: "2", multiplier: 1.70, locked: false },
        ],
      },
      {
        id: "over_under",
        name: "Over/Under",
        options: [
          { id: "opt-t2-o", label: "Over 22.5", multiplier: 1.90, locked: false },
          { id: "opt-t2-u", label: "Under 22.5", multiplier: 1.90, locked: false },
        ],
      },
    ],
  },
  {
    id: "live-tennis-3",
    sportId: "tennis",
    leagueName: "WTA Tokyo, Japan Women Singles",
    period: "set 3",
    homeName: "Osaka, Naomi",
    awayName: "Gauff, Coco",
    homeScore: 1,
    awayScore: 1,
    markets: [
      {
        id: "1x2",
        name: "1X2",
        options: [
          { id: "opt-t3-1", label: "1", multiplier: 1.95, locked: false },
          { id: "opt-t3-2", label: "2", multiplier: 1.85, locked: false },
        ],
      },
    ],
  },
  {
    id: "live-bb-1",
    sportId: "basketball",
    leagueName: "NBA Regular Season",
    period: "Q3 04:12",
    homeName: "Los Angeles Lakers",
    awayName: "Golden State Warriors",
    homeScore: 84,
    awayScore: 79,
    markets: [
      {
        id: "1x2",
        name: "1X2",
        options: [
          { id: "opt-b1-1", label: "1", multiplier: 1.45, locked: false },
          { id: "opt-b1-2", label: "2", multiplier: 2.75, locked: false },
        ],
      },
    ],
  },
  {
    id: "live-bb-2",
    sportId: "basketball",
    leagueName: "EuroLeague Men",
    period: "Q4 01:45",
    homeName: "Real Madrid Baloncesto",
    awayName: "Fenerbahçe Beko",
    homeScore: 72,
    awayScore: 75,
    markets: [
      {
        id: "1x2",
        name: "1X2",
        options: [
          { id: "opt-b2-1", label: "1", multiplier: 3.20, locked: false },
          { id: "opt-b2-2", label: "2", multiplier: 1.32, locked: false },
        ],
      },
    ],
  },
  {
    id: "live-fb-1",
    sportId: "football",
    leagueName: "UEFA Champions League",
    period: "68'",
    homeName: "Real Madrid",
    awayName: "Manchester City",
    homeScore: 2,
    awayScore: 1,
    markets: [
      {
        id: "1x2",
        name: "1X2",
        options: [
          { id: "opt-f1-1", label: "1", multiplier: 1.55, locked: false },
          { id: "opt-f1-x", label: "X", multiplier: 3.80, locked: false },
          { id: "opt-f1-2", label: "2", multiplier: 5.50, locked: false },
        ],
      },
    ],
  },
  {
    id: "live-fb-2",
    sportId: "football",
    leagueName: "English Premier League",
    period: "54'",
    homeName: "Arsenal",
    awayName: "Chelsea",
    homeScore: 1,
    awayScore: 0,
    markets: [
      {
        id: "1x2",
        name: "1X2",
        options: [
          { id: "opt-f2-1", label: "1", multiplier: 1.40, locked: false },
          { id: "opt-f2-x", label: "X", multiplier: 4.20, locked: false },
          { id: "opt-f2-2", label: "2", multiplier: 7.00, locked: false },
        ],
      },
    ],
  },
];

const sportsList = [
  { id: "football", name: "Football", count: 11, emoji: "⚽" },
  { id: "basketball", name: "Basketball", count: 8, emoji: "🏀" },
  { id: "tennis", name: "Tennis", count: 21, emoji: "🎾" },
  { id: "baseball", name: "Baseball", count: 1, emoji: "⚾" },
  { id: "mma", name: "MMA", count: 3, emoji: "🥊" },
  { id: "esports", name: "eSports", count: 4, emoji: "🎮" },
  { id: "icehockey", name: "Ice Hockey", count: 6, emoji: "🏒" },
  { id: "volleyball", name: "Volleyball", count: 2, emoji: "🏐" },
];

const marketTypes = ["1X2", "Over/Under", "BTTS", "Double Chance"];

function LivePage() {
  const navigate = useNavigate();
  const { isSelected, toggleSelection, allMatches } = useBetrix();

  const [activeSport, setActiveSport] = useState("tennis");
  const [activeMarket, setActiveMarket] = useState("1X2");
  const [collapsedLeagues, setCollapsedLeagues] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"Leagues" | "Time">("Leagues");
  const [collapseAll, setCollapseAll] = useState(false);

  // Combine real store live matches with extra sports matches
  const storeLive = useMemo(() => {
    return allMatches
      .filter((m) => m.status === "LIVE")
      .map((m) => {
        const h = teamById(m.homeId)?.name || "Home";
        const a = teamById(m.awayId)?.name || "Away";
        const lg = leagueById(m.leagueId)?.name || "Live Tournament";
        return {
          id: m.id,
          sportId: m.sportId || "football",
          leagueName: lg,
          period: `${m.minute || 45}'`,
          homeName: h,
          awayName: a,
          homeScore: m.homeScore ?? 0,
          awayScore: m.awayScore ?? 0,
          markets: m.markets || [
            {
              id: "1x2",
              name: "1X2",
              options: [
                { id: `${m.id}-1`, label: "1", multiplier: 2.10, locked: false },
                { id: `${m.id}-x`, label: "X", multiplier: 3.20, locked: false },
                { id: `${m.id}-2`, label: "2", multiplier: 3.40, locked: false },
              ],
            },
          ],
        };
      });
  }, [allMatches]);

  const currentSportMatches = useMemo(() => {
    const combined = [...extraLiveSportsMatches, ...storeLive];
    return combined.filter((m) => m.sportId === activeSport);
  }, [activeSport, storeLive]);

  // Group current matches by league
  const groupedLeagues = useMemo(() => {
    const groups: Record<string, typeof currentSportMatches> = {};
    for (const m of currentSportMatches) {
      if (!groups[m.leagueName]) {
        groups[m.leagueName] = [];
      }
      groups[m.leagueName].push(m);
    }
    return groups;
  }, [currentSportMatches]);

  const toggleLeagueCollapse = (leagueName: string) => {
    setCollapsedLeagues((prev) => ({
      ...prev,
      [leagueName]: !prev[leagueName],
    }));
  };

  const handleToggleCollapseAll = () => {
    const next = !collapseAll;
    setCollapseAll(next);
    const newCollapsed: Record<string, boolean> = {};
    Object.keys(groupedLeagues).forEach((lg) => {
      newCollapsed[lg] = next;
    });
    setCollapsedLeagues(newCollapsed);
  };

  // Total live matches count across all sports
  const totalLiveCount = 76;

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col pb-20 select-none">
      {/* 1. Yellow Live Header Bar */}
      <div className="bg-[#F5C400] text-black px-4 py-2.5 flex items-center justify-between shadow-md">
        <button
          onClick={() => navigate({ to: "/" })}
          className="flex items-center text-black hover:opacity-75 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6 stroke-[3]" />
        </button>

        <div className="flex items-center space-x-2 font-black text-base tracking-tight">
          <span className="w-2.5 h-2.5 rounded-full bg-white border-2 border-black inline-block" />
          <span>Live</span>
          <span className="font-semibold text-black/80">({totalLiveCount})</span>
        </div>

        <button
          onClick={() => navigate({ to: "/" })}
          className="font-black text-xs uppercase text-black hover:underline"
        >
          Schedule
        </button>
      </div>

      {/* 2. Sport Icons Horizontal Bar */}
      <div className="bg-[#0c0f16] border-b border-[#181d2a] px-2 py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-3 min-w-max px-2">
          {sportsList.map((sp) => {
            const isActive = activeSport === sp.id;
            return (
              <button
                key={sp.id}
                onClick={() => setActiveSport(sp.id)}
                className="flex flex-col items-center group relative px-2 transition-transform active:scale-95"
              >
                {/* Badge Count above icon */}
                <span
                  className={cn(
                    "text-[10px] font-black leading-none mb-1",
                    isActive ? "text-[#F5C400]" : "text-gray-400 group-hover:text-gray-200"
                  )}
                >
                  {sp.count}
                </span>

                {/* Circular Sport Icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-sm border transition-all",
                    isActive
                      ? "bg-[#181e2b] border-[#F5C400] text-[#F5C400] shadow-[#F5C400]/20"
                      : "bg-[#121622] border-[#22293a] text-gray-400 group-hover:border-gray-500"
                  )}
                >
                  {sp.emoji}
                </div>

                {/* Sport Name */}
                <span
                  className={cn(
                    "text-[11px] font-bold mt-1.5 transition-colors",
                    isActive ? "text-[#F5C400]" : "text-gray-400 group-hover:text-gray-200"
                  )}
                >
                  {sp.name}
                </span>

                {/* Active Underline Bar */}
                {isActive && (
                  <div className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#F5C400] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Market Types Selector Bar */}
      <div className="bg-[#000000] border-b border-[#181d26] px-4 pt-3 flex items-center space-x-6 text-xs font-bold uppercase tracking-wider overflow-x-auto no-scrollbar">
        {marketTypes.map((mkt) => {
          const isActive = activeMarket === mkt;
          return (
            <button
              key={mkt}
              onClick={() => setActiveMarket(mkt)}
              className={cn(
                "pb-2.5 transition-colors relative whitespace-nowrap",
                isActive ? "text-[#F5C400] font-black" : "text-gray-400 hover:text-gray-200"
              )}
            >
              {mkt}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5C400]" />
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Sub-header Actions (Collapse All & Sort Dropdown) */}
      <div className="bg-[#000000] px-4 py-2 flex items-center justify-between text-xs border-b border-[#141822]">
        <button
          onClick={handleToggleCollapseAll}
          className="flex items-center space-x-1.5 text-[#F5C400] font-bold hover:opacity-80 transition-opacity"
        >
          {collapseAll ? (
            <ChevronUp className="w-4 h-4 stroke-[3]" />
          ) : (
            <ChevronDown className="w-4 h-4 stroke-[3]" />
          )}
          <span>{collapseAll ? "Expand All" : "Collapse All"}</span>
        </button>

        <div className="flex items-center space-x-1 text-gray-400">
          <span className="text-[11px]">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#121622] text-gray-200 text-xs font-bold rounded px-2 py-0.5 border border-[#22293a] focus:outline-none focus:border-[#F5C400]"
          >
            <option value="Leagues">Leagues</option>
            <option value="Time">Time</option>
          </select>
        </div>
      </div>

      {/* 5. Column Headers Row (1 X 2) */}
      <div className="bg-[#080b11] px-4 py-1.5 flex items-center justify-end text-[11px] font-mono font-bold text-gray-400 border-b border-[#121622]">
        <div className="grid grid-cols-3 gap-2 w-48 text-center pr-1">
          <span>1</span>
          <span>X</span>
          <span>2</span>
        </div>
      </div>

      {/* 6. Collapsible Leagues List */}
      <div className="flex-1 divide-y divide-[#141824]">
        {Object.keys(groupedLeagues).length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <Radio className="w-8 h-8 mx-auto text-gray-600 animate-pulse" />
            <p className="font-bold text-sm text-gray-400">No live matches right now</p>
            <p className="text-xs">Check back soon for upcoming live fixtures in {activeSport}.</p>
          </div>
        ) : (
          Object.entries(groupedLeagues).map(([leagueName, matchesList]) => {
            const isCollapsed = collapsedLeagues[leagueName] ?? false;

            return (
              <div key={leagueName} className="bg-[#000000]">
                {/* League Header */}
                <button
                  onClick={() => toggleLeagueCollapse(leagueName)}
                  className="w-full bg-[#0a0d14] hover:bg-[#10141f] px-4 py-2.5 flex items-center justify-between text-left transition-colors border-b border-[#141926]"
                >
                  <div className="flex items-center space-x-2">
                    {isCollapsed ? (
                      <ChevronUp className="w-4 h-4 text-[#F5C400]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#F5C400]" />
                    )}
                    <span className="font-extrabold text-xs text-white tracking-wide">
                      {leagueName}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-gray-400 font-bold">
                    {matchesList.length}
                  </span>
                </button>

                {/* League Match Rows */}
                {!isCollapsed && (
                  <div className="divide-y divide-[#121622]">
                    {matchesList.map((m) => {
                      const market1X2 = m.markets?.find((mk) => mk.id === "1x2" || mk.name === "1X2") || m.markets?.[0];
                      const options = market1X2?.options || [];

                      return (
                        <div
                          key={m.id}
                          className="px-4 py-3 bg-[#000000] hover:bg-[#07090e] transition-colors flex items-center justify-between"
                        >
                          {/* Match Info & Teams */}
                          <div className="flex-1 pr-3 space-y-1">
                            {/* Live period indicator */}
                            <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[#F5C400]">
                              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                              <span className="uppercase font-mono tracking-wider">{m.period}</span>
                            </div>

                            {/* Competitor 1 */}
                            <div className="flex items-center justify-between text-xs font-bold text-gray-100">
                              <span className="truncate max-w-[150px] sm:max-w-[200px]">
                                {m.homeName}
                              </span>
                              <span className="font-mono font-black text-white pl-2">
                                {m.homeScore}
                              </span>
                            </div>

                            {/* Competitor 2 */}
                            <div className="flex items-center justify-between text-xs font-bold text-gray-100">
                              <span className="truncate max-w-[150px] sm:max-w-[200px]">
                                {m.awayName}
                              </span>
                              <span className="font-mono font-black text-white pl-2">
                                {m.awayScore}
                              </span>
                            </div>

                            {/* +2 markets link */}
                            <Link
                              to="/match/$matchId"
                              params={{ matchId: m.id }}
                              className="inline-block text-[10px] font-bold text-[#F5C400] hover:underline pt-0.5"
                            >
                              +2 markets &gt;
                            </Link>
                          </div>

                          {/* Odds Buttons Column (3 items for 1 X 2) */}
                          <div className="grid grid-cols-3 gap-1.5 w-48 shrink-0">
                            {[0, 1, 2].map((optIdx) => {
                              const opt = options[optIdx];
                              if (!opt) {
                                return (
                                  <div
                                    key={optIdx}
                                    className="h-12 bg-[#12151f] rounded-lg border border-[#1b202e] opacity-40"
                                  />
                                );
                              }

                              const isLocked = opt.locked || opt.multiplier <= 0;
                              const selectionPayload: Selection = {
                                matchId: m.id,
                                marketId: market1X2?.id || "1x2",
                                marketName: market1X2?.name || "1X2",
                                optionId: opt.id,
                                optionLabel: opt.label,
                                multiplier: opt.multiplier,
                              };

                              const active = isSelected(m.id, market1X2?.id || "1x2", opt.id);

                              return (
                                <button
                                  key={opt.id || optIdx}
                                  disabled={isLocked}
                                  onClick={() => toggleSelection(selectionPayload)}
                                  className={cn(
                                    "h-12 rounded-lg flex items-center justify-center font-mono font-bold text-xs transition-all border",
                                    isLocked
                                      ? "bg-[#111520] border-[#1a2030] text-gray-600 cursor-not-allowed"
                                      : active
                                      ? "bg-[#F5C400] border-[#F5C400] text-black shadow-md shadow-[#F5C400]/20 font-black scale-95"
                                      : "bg-[#121622] border-[#1f283d] text-white hover:border-[#F5C400]/50 hover:bg-[#182030]"
                                  )}
                                >
                                  {isLocked ? (
                                    <Lock className="w-3.5 h-3.5 text-gray-500" />
                                  ) : (
                                    opt.multiplier.toFixed(2)
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
