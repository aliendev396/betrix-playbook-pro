import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, Coins, History, LogOut, Shield, User, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/common/States";
import { formatPoints, useBetrix } from "@/store/betrix";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — BETRIX" },
      { name: "description", content: "Manage your BETRIX account details, favourite league, notifications and virtual points overview." },
      { property: "og:title", content: "Your Profile — BETRIX" },
      { property: "og:description", content: "Account details, preferences and prediction activity on BETRIX." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, points, history } = useBetrix();

  return (
    <div className="space-y-4">
      <section className="surface-card rounded-3xl p-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary text-xl font-extrabold text-primary-foreground">
            {profile.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold">{profile.name}</h1>
            <p className="truncate text-xs text-muted-foreground">
              @{profile.username} · {profile.email}
            </p>
            <Badge variant="secondary" className="mt-1.5 gap-1 text-[10px] uppercase tracking-wider">
              <Shield className="h-3 w-3" /> {profile.role}
            </Badge>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Points", value: formatPoints(points) },
          { label: "Slips", value: String(history.length) },
          { label: "Wins", value: String(history.filter((h) => h.status === "WON").length) },
        ].map((s) => (
          <div key={s.label} className="surface-card rounded-2xl p-4 text-center">
            <p className="tabular text-lg font-bold">{s.value}</p>
            <p className="text-[11px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionHeading title="Account" />
      <nav className="surface-card rounded-2xl p-2">
        {[
          { to: "/points", label: "Virtual points", icon: Coins },
          { to: "/history", label: "Prediction history", icon: History },
          { to: "/notifications", label: "Notifications", icon: Bell },
          { to: "/partners", label: "Partners & referrals", icon: Users2 },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            <item.icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="surface-card rounded-2xl p-4">
        <p className="text-sm font-semibold">Preferences</p>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Favourite league</span>
          <span className="font-medium">{profile.favoriteLeague}</span>
        </div>
      </div>

      <Button variant="outline" className="w-full gap-2">
        <User className="h-4 w-4" /> Edit profile
      </Button>
      <Button variant="ghost" className="w-full gap-2 text-muted-foreground">
        <LogOut className="h-4 w-4" /> Sign out
      </Button>
      <p className="pb-2 text-center text-[11px] text-muted-foreground">
        BETRIX is a free-to-play prediction game using virtual points only.
      </p>
    </div>
  );
}
