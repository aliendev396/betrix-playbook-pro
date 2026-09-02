import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { matchById, type Match } from "@/data/football";

export interface Selection {
  matchId: string;
  marketId: string;
  marketName: string;
  optionId: string;
  optionLabel: string;
  multiplier: number;
}

export interface HistoryEntry {
  code: string;
  createdAt: string;
  stake: number;
  selections: Selection[];
  status: "PENDING" | "WON" | "LOST";
  payout: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  kind: "result" | "match" | "code" | "system";
}

export interface Profile {
  name: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "PARTNER";
  favoriteLeague: string;
}

interface BetrixState {
  profile: Profile;
  points: number;
  slip: Selection[];
  history: HistoryEntry[];
  notifications: AppNotification[];
  toggleSelection: (s: Selection) => void;
  isSelected: (matchId: string, marketId: string, optionId: string) => boolean;
  removeSelection: (matchId: string, marketId: string) => void;
  clearSlip: () => void;
  loadSlip: (selections: Selection[]) => void;
  confirmSlip: (stake: number) => HistoryEntry;
  markAllRead: () => void;
  markRead: (id: string) => void;
  totalMultiplier: number;
}

const Ctx = createContext<BetrixState | null>(null);
const STORAGE_KEY = "betrix.state.v1";

const seedNotifications: AppNotification[] = [
  { id: "n1", title: "Prediction result available", body: "Slip BTX-4M18T settled — 3 of 4 correct.", time: "12m ago", read: false, kind: "result" },
  { id: "n2", title: "Match starting soon", body: "Manchester City vs Tottenham kicks off in 30 minutes.", time: "48m ago", read: false, kind: "match" },
  { id: "n3", title: "Prediction code loaded", body: "You loaded code BTX-7K29Q with 3 selections.", time: "2h ago", read: true, kind: "code" },
  { id: "n4", title: "New platform announcement", body: "Champions League markets are now live on BETRIX.", time: "1d ago", read: true, kind: "system" },
];

function seedHistory(): HistoryEntry[] {
  const mk = (id: string, marketId: string, marketName: string, optionId: string, optionLabel: string, mult: number): Selection => ({
    matchId: id, marketId, marketName, optionId, optionLabel, multiplier: mult,
  });
  return [
    {
      code: "BTX-4M18T",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      stake: 500,
      status: "WON",
      payout: 1840,
      selections: [mk("m19", "1x2", "Match Result", "home", "Home", 2.1), mk("m20", "ou", "Total Goals", "o25", "Over 2.5", 1.75)],
    },
    {
      code: "BTX-9QZ2A",
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      stake: 300,
      status: "LOST",
      payout: 0,
      selections: [mk("m21", "btts", "Both Teams To Score", "yes", "Yes", 1.72), mk("m22", "1x2", "Match Result", "away", "Away", 2.9)],
    },
    {
      code: "BTX-7K29Q",
      createdAt: new Date().toISOString(),
      stake: 250,
      status: "PENDING",
      payout: 0,
      selections: [mk("m5", "1x2", "Match Result", "home", "Home", 2.1), mk("m8", "ou", "Total Goals", "o15", "Over 1.5", 1.28), mk("m11", "btts", "Both Teams To Score", "yes", "Yes", 1.72)],
    },
  ];
}

export function makeCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < 5; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `BTX-${out}`;
}

export function BetrixProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(12450);
  const [slip, setSlip] = useState<Selection[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>(seedHistory);
  const [notifications, setNotifications] = useState<AppNotification[]>(seedNotifications);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.points === "number") setPoints(parsed.points);
      if (Array.isArray(parsed.slip)) setSlip(parsed.slip);
      if (Array.isArray(parsed.history)) setHistory(parsed.history);
      if (Array.isArray(parsed.notifications)) setNotifications(parsed.notifications);
    } catch {
      /* ignore corrupted local state */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ points, slip, history, notifications }));
    } catch {
      /* storage unavailable */
    }
  }, [points, slip, history, notifications]);

  const toggleSelection = useCallback((s: Selection) => {
    setSlip((prev) => {
      const same = prev.find((p) => p.matchId === s.matchId && p.marketId === s.marketId);
      if (same && same.optionId === s.optionId) {
        return prev.filter((p) => !(p.matchId === s.matchId && p.marketId === s.marketId));
      }
      if (same) {
        return prev.map((p) => (p.matchId === s.matchId && p.marketId === s.marketId ? s : p));
      }
      return [...prev, s];
    });
  }, []);

  const isSelected = useCallback(
    (matchId: string, marketId: string, optionId: string) =>
      slip.some((p) => p.matchId === matchId && p.marketId === marketId && p.optionId === optionId),
    [slip],
  );

  const removeSelection = useCallback((matchId: string, marketId: string) => {
    setSlip((prev) => prev.filter((p) => !(p.matchId === matchId && p.marketId === marketId)));
  }, []);

  const clearSlip = useCallback(() => setSlip([]), []);
  const loadSlip = useCallback((selections: Selection[]) => setSlip(selections), []);

  const totalMultiplier = useMemo(
    () => Number(slip.reduce((acc, s) => acc * s.multiplier, 1).toFixed(2)),
    [slip],
  );

  const confirmSlip = useCallback(
    (stake: number) => {
      const entry: HistoryEntry = {
        code: makeCode(),
        createdAt: new Date().toISOString(),
        stake,
        selections: slip,
        status: "PENDING",
        payout: 0,
      };
      setHistory((h) => [entry, ...h]);
      setPoints((p) => Math.max(0, p - stake));
      setSlip([]);
      setNotifications((n) => [
        { id: entry.code, title: "Prediction confirmed", body: `Slip ${entry.code} placed with ${entry.selections.length} selections.`, time: "just now", read: false, kind: "result" },
        ...n,
      ]);
      return entry;
    },
    [slip],
  );

  const markAllRead = useCallback(() => setNotifications((n) => n.map((x) => ({ ...x, read: true }))), []);
  const markRead = useCallback((id: string) => setNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x))), []);

  const value: BetrixState = {
    profile: {
      name: "Daniel Mensah",
      username: "@danmensah",
      email: "daniel.mensah@betrix.app",
      role: "USER",
      favoriteLeague: "Premier League",
    },
    points,
    slip,
    history,
    notifications,
    toggleSelection,
    isSelected,
    removeSelection,
    clearSlip,
    loadSlip,
    confirmSlip,
    markAllRead,
    markRead,
    totalMultiplier,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBetrix() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBetrix must be used inside BetrixProvider");
  return ctx;
}

export function selectionMatch(s: Selection): Match | undefined {
  return matchById(s.matchId);
}

export const formatPoints = (n: number) => n.toLocaleString("en-US");
