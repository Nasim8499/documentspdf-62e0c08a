import { CreditCard, Crown, BarChart2, Settings, HelpCircle, LogOut, ChevronRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, IconTile } from "@/components/ui-bits";

const menu = [
  { icon: CreditCard, label: "Billing Details", g: "primary" as const },
  { icon: Crown, label: "Subscription", g: "sunset" as const },
  { icon: BarChart2, label: "Usage Analytics", g: "ocean" as const, to: "/analytics" },
  { icon: Settings, label: "Settings", g: "candy" as const },
  { icon: HelpCircle, label: "Help Center", g: "mint" as const },
];

const Profile = () => {
  const nav = useNavigate();
  return (
    <MobileShell>
      <PageHeader title="Profile & Credits" back={false} />
      <div className="px-6 space-y-5">
        <div className="rounded-3xl p-5 gradient-hero text-white relative overflow-hidden" style={{ boxShadow: "var(--shadow-glow)" }}>
          <Sparkles className="absolute top-4 right-4 w-5 h-5 opacity-70" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-4 relative">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl font-bold">
              JW
            </div>
            <div>
              <p className="text-lg font-bold">Jenny Wilson</p>
              <p className="text-xs text-white/80">jenny.wilson@email.com</p>
              <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20">PRO PLAN</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-5 relative">
            {[
              { k: "137k", v: "AI Credits" },
              { k: "33", v: "Documents" },
              { k: "331", v: "Generations" },
            ].map((s) => (
              <div key={s.v} className="bg-white/15 backdrop-blur rounded-2xl p-3 text-center">
                <p className="font-bold text-lg">{s.k}</p>
                <p className="text-[10px] text-white/80">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {menu.map((m) => (
            <button
              key={m.label}
              onClick={() => m.to && nav(m.to)}
              className="w-full glass-card p-3.5 flex items-center gap-3 btn-press text-left"
            >
              <IconTile gradient={m.g} size="sm">
                <m.icon className="w-4 h-4" />
              </IconTile>
              <span className="flex-1 text-sm font-semibold">{m.label}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button className="w-full py-3.5 rounded-2xl bg-white border border-border text-destructive font-semibold flex items-center justify-center gap-2 btn-press">
          <LogOut className="w-4 h-4" /> Log Out
        </button>
      </div>
    </MobileShell>
  );
};

export default Profile;
