import { useState, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Lock, Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatGHS, useBetrix, selectionMatch } from "@/store/betrix";
import { teamById } from "@/data/football";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "My Bets & History — BETRIX" },
      { name: "description", content: "View your open bets, active cashout slips, and settled bet history." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const navigate = useNavigate();
  const { history, isLoggedIn, deposit } = useBetrix();

  // Top Tabs: 'open' | 'history'
  const [mainTab, setMainTab] = useState<"open" | "history">("open");

  // Sub-filters under Open Bets: 'all' | 'cashout' | 'live'
  const [subFilter, setSubFilter] = useState<"all" | "cashout" | "live">("all");

  const [cashedOutCodes, setCashedOutCodes] = useState<Record<string, number>>({});

  // Open Bets list (status === 'PENDING' and not cashed out)
  const openBets = useMemo(() => {
    return history.filter((h) => h.status === "PENDING" && !cashedOutCodes[h.code]);
  }, [history, cashedOutCodes]);

  // Settled History list (status !== 'PENDING' or cashed out)
  const settledBets = useMemo(() => {
    return history.filter((h) => h.status !== "PENDING" || !!cashedOutCodes[h.code]);
  }, [history, cashedOutCodes]);

  // Filtered open bets based on sub-filter
  const filteredOpenBets = useMemo(() => {
    if (subFilter === "cashout") return openBets.filter((b) => b.selections.length > 0);
    if (subFilter === "live") return openBets.filter((b) => b.selections.some((s) => s.matchId.includes("live") || s.matchId.includes("1")));
    return openBets;
  }, [openBets, subFilter]);

  const handleCashout = (code: string, stake: number, selectionsCount: number) => {
    const cashoutValue = Math.round(stake * (1.35 + selectionsCount * 0.4));
    setCashedOutCodes((prev) => ({ ...prev, [code]: cashoutValue }));
    deposit(cashoutValue);
    toast.success(`Bet ${code} cashed out for +${formatGHS(cashoutValue)}!`);
  };

  const visibleOpenCount = isLoggedIn ? openBets.length : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e11] text-white font-sans select-none">
      {/* 1. Segmented Main Tabs Bar (Primestakers Style) */}
      <div className="bg-[#0c0c0e] border-b border-[#1c1c24] p-3">
        <div className="grid grid-cols-2 gap-2 bg-[#17171d] p-1 rounded-xl border border-[#242430]">
          <button
            type="button"
            onClick={() => setMainTab("open")}
            className={cn(
              "py-2.5 text-xs font-black rounded-lg transition-all text-center",
              mainTab === "open"
                ? "bg-[#252530] text-white shadow-sm font-extrabold"
                : "text-gray-400 hover:text-gray-200"
            )}
          >
            Open Bets ({visibleOpenCount})
          </button>
          <button
            type="button"
            onClick={() => setMainTab("history")}
            className={cn(
              "py-2.5 text-xs font-black rounded-lg transition-all text-center",
              mainTab === "history"
                ? "bg-[#252530] text-white shadow-sm font-extrabold"
                : "text-gray-400 hover:text-gray-200"
            )}
          >
            Bet History
          </button>
        </div>
      </div>

      {/* 2. Sub-Filter Pills Bar */}
      {mainTab === "open" && (
        <div className="flex items-center gap-2 px-3 py-3 bg-[#121216] border-b border-[#1c1c24]">
          <button
            type="button"
            onClick={() => setSubFilter("all")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all",
              subFilter === "all"
                ? "bg-[#F5C400] text-black shadow-md"
                : "bg-[#1f1f28] text-gray-300 hover:bg-[#282834]"
            )}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setSubFilter("cashout")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all",
              subFilter === "cashout"
                ? "bg-[#F5C400] text-black shadow-md"
                : "bg-[#1f1f28] text-gray-300 hover:bg-[#282834]"
            )}
          >
            Cashout Available
          </button>

          <button
            type="button"
            onClick={() => setSubFilter("live")}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition-all",
              subFilter === "live"
                ? "bg-[#F5C400] text-black shadow-md"
                : "bg-[#1f1f28] text-gray-300 hover:bg-[#282834]"
            )}
          >
            Live Games
          </button>
        </div>
      )}

      {/* 3. Main Body Content */}
      <main className="flex-1 p-4 flex flex-col justify-center items-center min-h-[420px]">
        {!isLoggedIn ? (
          /* LOGGED OUT LOCK SCREEN (Mandatory Login to see open bets) */
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
            {/* Gold Lock Emblem */}
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-[#221f14] border border-[#3b341f] text-[#F5C400] shadow-[0_0_20px_rgba(245,196,0,0.15)]">
              <Lock className="h-8 w-8 text-[#F5C400]" />
            </div>

            <p className="text-xs font-semibold text-gray-400">Log in to see your open bets</p>

            <Link
              to="/auth"
              className="px-8 py-2 rounded-full border-2 border-[#F5C400] text-[#F5C400] hover:bg-[#F5C400] hover:text-black font-extrabold text-xs transition-all active:scale-95"
            >
              Login
            </Link>
          </div>
        ) : mainTab === "open" ? (
          /* OPEN BETS LIST (For Logged In Users) */
          <div className="w-full space-y-3">
            {filteredOpenBets.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 bg-[#16161c] rounded-2xl border border-[#252530] p-6 space-y-2">
                <Receipt className="h-8 w-8 mx-auto text-gray-600" />
                <p className="font-bold text-white">No Open Bets Found</p>
                <p>Tap any odds on live or upcoming matches to place a bet!</p>
              </div>
            ) : (
              filteredOpenBets.map((h) => {
                const cashoutVal = Math.round(h.stake * 1.75);

                return (
                  <div key={h.code} className="bg-[#16161c] border border-[#252530] rounded-2xl p-4 space-y-3 shadow-md">
                    <div className="flex items-center justify-between border-b border-[#242430] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-[#F5C400]">{h.code}</span>
                        <button
                          type="button"
                          onClick={() => {
                            void navigator.clipboard.writeText(h.code);
                            toast.success("Code copied!");
                          }}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        OPEN
                      </span>
                    </div>

                    {/* Selections List */}
                    <ul className="space-y-2 py-1">
                      {h.selections.map((s, i) => {
                        const m = selectionMatch(s);
                        return (
                          <li key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-300 font-semibold truncate">
                              {m ? `${teamById(m.homeId).name} vs ${teamById(m.awayId).name}` : "Match Pick"} · {s.marketName}:{" "}
                              <span className="text-[#F5C400] font-black">{s.optionLabel}</span>
                            </span>
                            <span className="font-mono font-black text-white ml-2">{s.multiplier.toFixed(2)}</span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Payout & Cashout Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#242430] text-xs">
                      <div>
                        <span className="text-gray-400">Stake: </span>
                        <span className="font-mono font-black text-white">{formatGHS(h.stake)}</span>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleCashout(h.code, h.stake, h.selections.length)}
                        className="bg-[#F5C400] text-black font-black text-xs px-3 py-1 shadow-sm hover:bg-[#e0b300] rounded-xl"
                      >
                        Cash Out ({formatGHS(cashoutVal)})
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* BET HISTORY LIST */
          <div className="w-full space-y-3">
            {settledBets.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 bg-[#16161c] rounded-2xl border border-[#252530] p-6">
                No settled bet history yet.
              </div>
            ) : (
              settledBets.map((h) => {
                const isCashedOut = !!cashedOutCodes[h.code];
                const cashoutVal = cashedOutCodes[h.code] || Math.round(h.stake * 1.85);

                const statusColor =
                  h.status === "WON" || isCashedOut
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30";

                return (
                  <div key={h.code} className="bg-[#16161c] border border-[#252530] rounded-2xl p-4 space-y-3 shadow-md">
                    <div className="flex items-center justify-between border-b border-[#242430] pb-2.5">
                      <span className="font-mono text-xs font-black text-gray-300">{h.code}</span>
                      <span className={cn("text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full", statusColor)}>
                        {isCashedOut ? "CASHED OUT" : h.status}
                      </span>
                    </div>

                    <ul className="space-y-2 py-1">
                      {h.selections.map((s, i) => (
                        <li key={i} className="flex items-center justify-between text-xs">
                          <span className="text-gray-300 font-semibold truncate">
                            {s.marketName}: <span className="text-[#F5C400] font-bold">{s.optionLabel}</span>
                          </span>
                          <span className="font-mono font-black text-white">{s.multiplier.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center justify-between pt-2 border-t border-[#242430] text-xs">
                      <div>
                        <span className="text-gray-400">Stake: </span>
                        <span className="font-mono font-bold text-white">{formatGHS(h.stake)}</span>
                      </div>
                      <div className="font-mono font-black text-right text-green-400">
                        +{formatGHS(isCashedOut ? cashoutVal : h.payout || Math.round(h.stake * 2.2))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </main>
    </div>
  );
}
