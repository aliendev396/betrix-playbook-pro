import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Activity, ArrowLeft, ShieldCheck, Users2, Ticket, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BetrixWordmark } from "@/components/brand/Logo";
import { EmptyState, SectionHeading } from "@/components/common/States";
import { adminUsers, auditLog, growthSeries, partners } from "@/data/admin";
import { matches, teamById, leagueById } from "@/data/football";
import { formatPoints } from "@/store/betrix";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — BETRIX" },
      { name: "description", content: "BETRIX operations console: platform metrics, user management, match settlement and audit trail." },
      { property: "og:title", content: "Admin Dashboard — BETRIX" },
      { property: "og:description", content: "Manage users, matches, partners and platform activity on BETRIX." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [q, setQ] = useState("");
  const filteredUsers = adminUsers.filter((u) =>
    `${u.name} ${u.username} ${u.email}`.toLowerCase().includes(q.trim().toLowerCase()),
  );
  const maxSlips = Math.max(...growthSeries.map((g) => g.slips));

  const stats = [
    { label: "Total users", value: "4,812", icon: Users2 },
    { label: "Slips this week", value: "4,190", icon: Ticket },
    { label: "Live matches", value: String(matches.filter((m) => m.status === "LIVE").length), icon: Activity },
    { label: "Points in play", value: formatPoints(1284000), icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 lg:px-6">
          <BetrixWordmark />
          <Badge variant="secondary" className="w-fit gap-1 text-[10px] uppercase tracking-wider">
            <ShieldCheck className="h-3 w-3" /> Admin console
          </Badge>
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link to="/">
              <ArrowLeft className="h-4 w-4" /> Exit
            </Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-5 px-4 py-6 lg:px-6">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="surface-card rounded-2xl p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <s.icon className="h-4 w-4 text-primary" />
                <p className="truncate text-[11px]">{s.label}</p>
              </div>
              <p className="tabular mt-2 text-2xl font-extrabold">{s.value}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="partners">Partners</TabsTrigger>
            <TabsTrigger value="audit">Audit log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <div className="surface-card rounded-2xl p-4">
              <SectionHeading title="Weekly activity" subtitle="New users and slips submitted" />
              <div className="flex h-44 items-end gap-3">
                {growthSeries.map((g) => (
                  <div key={g.label} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div className="flex h-full w-full items-end justify-center gap-1">
                      <div className="w-1/3 rounded-t bg-primary/30" style={{ height: `${(g.users / maxSlips) * 100}%` }} aria-hidden />
                      <div className="w-1/3 rounded-t bg-primary" style={{ height: `${(g.slips / maxSlips) * 100}%` }} aria-hidden />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{g.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">Light bars: new users · Solid bars: slips submitted</p>
            </div>
          </TabsContent>

          <TabsContent value="users" className="mt-4 space-y-3">
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users by name, handle or email" aria-label="Search users" className="h-11" />
            {filteredUsers.length === 0 ? (
              <EmptyState title="No users match that search" description="Try a different name or email." />
            ) : (
              <div className="surface-card overflow-x-auto rounded-2xl">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 text-right font-medium">Points</th>
                      <th className="px-4 py-3 text-right font-medium">Slips</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border/50 last:border-0">
                        <td className="px-4 py-3">
                          <p className="font-medium">{u.name}</p>
                          <p className="text-xs text-muted-foreground">@{u.username} · {u.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{u.role}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn("text-xs font-semibold", u.status === "ACTIVE" ? "text-success" : "text-destructive")}>{u.status}</span>
                        </td>
                        <td className="tabular px-4 py-3 text-right font-semibold">{formatPoints(u.points)}</td>
                        <td className="tabular px-4 py-3 text-right">{u.slips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="matches" className="mt-4 space-y-2">
            {matches.slice(0, 12).map((m) => (
              <div key={m.id} className="surface-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {teamById(m.homeId).short} vs {teamById(m.awayId).short}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {leagueById(m.leagueId).name} · {m.markets.length} markets
                  </p>
                </div>
                <Badge
                  className={cn(
                    "shrink-0 text-[10px] uppercase tracking-wider",
                    m.status === "LIVE" && "bg-live/20 text-live",
                    m.status === "FINISHED" && "bg-success/20 text-success",
                    m.status === "SCHEDULED" && "bg-muted text-muted-foreground",
                  )}
                >
                  {m.status}
                </Badge>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="partners" className="mt-4 space-y-2">
            {partners.map((p) => (
              <div key={p.id} className="surface-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="tabular truncate text-xs text-muted-foreground">{p.code} · {p.signups} signups · {p.activeUsers} active</p>
                </div>
                <div className="text-right">
                  <p className="tabular text-sm font-bold text-primary">{formatPoints(p.rewardPoints)} pts</p>
                  <p className="text-[11px] text-muted-foreground">{p.tier} tier</p>
                </div>
              </div>
            ))}
            <p className="px-1 text-[11px] text-muted-foreground">Partner rewards are virtual points only — no monetary commissions are paid.</p>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <div className="surface-card rounded-2xl p-2">
              {auditLog.map((a) => (
                <div key={a.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 border-b border-border/50 px-3 py-3 last:border-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{a.action}</p>
                    <p className="text-xs text-muted-foreground">by {a.actor}</p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">{a.at}</span>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
