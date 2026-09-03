import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BetrixWordmark } from "@/components/brand/Logo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In or Join — BETRIX" },
      { name: "description", content: "Sign in to BETRIX or create a free account to make football predictions with virtual points." },
      { property: "og:title", content: "Sign In or Join — BETRIX" },
      { property: "og:description", content: "Free-to-play football predictions with virtual points only." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<null | "signin" | "signup">(null);

  const submit = (mode: "signin" | "signup") => (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(mode);
    setTimeout(() => {
      setLoading(null);
      toast.success(mode === "signin" ? "Welcome back to BETRIX" : "Account created — 10,000 points added");
      void navigate({ to: "/" });
    }, 700);
  };

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to app
        </Link>

        <div className="flex justify-center">
          <BetrixWordmark />
        </div>

        <div className="surface-card rounded-3xl p-6">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-5">
              <form className="space-y-4" onSubmit={submit("signin")}>
                <Field id="si-email" label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@example.com" />
                <Field id="si-password" label="Password" icon={<Lock className="h-4 w-4" />} type="password" placeholder="••••••••" />
                <Button type="submit" className="w-full" disabled={loading !== null}>
                  {loading === "signin" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-5">
              <form className="space-y-4" onSubmit={submit("signup")}>
                <Field id="su-name" label="Username" icon={<User className="h-4 w-4" />} type="text" placeholder="predictor10" />
                <Field id="su-email" label="Email" icon={<Mail className="h-4 w-4" />} type="email" placeholder="you@example.com" />
                <Field id="su-password" label="Password" icon={<Lock className="h-4 w-4" />} type="password" placeholder="At least 8 characters" />
                <Button type="submit" className="w-full" disabled={loading !== null}>
                  {loading === "signup" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create free account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          BETRIX is a free-to-play prediction game. Virtual points have no cash value and cannot be withdrawn or exchanged.
        </p>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon,
  type,
  placeholder,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>
        <Input id={id} type={type} placeholder={placeholder} required className="h-11 pl-9" />
      </div>
    </div>
  );
}
