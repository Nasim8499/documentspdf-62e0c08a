import { FileText, Zap, Clock, ChevronDown } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, IconTile } from "@/components/ui-bits";

const bars = [40, 65, 50, 80, 55, 90, 70, 95, 60, 75, 85, 100];
const months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

const Analytics = () => {
  return (
    <MobileShell>
      <PageHeader title="Analytics" subtitle="Your productivity insights" />
      <div className="px-6 space-y-4">
        <button className="glass-card p-3 px-4 flex items-center justify-between w-full btn-press">
          <span className="text-sm font-semibold">June 2026</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="grid grid-cols-3 gap-2">
          <Stat icon={FileText} g="primary" v="32" l="Documents" />
          <Stat icon={Zap} g="sunset" v="8,550" l="Credits" />
          <Stat icon={Clock} g="mint" v="24.5h" l="Time Saved" />
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-muted-foreground">Documents Generated</p>
              <p className="text-2xl font-bold gradient-text">+ 248%</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">↑ vs last month</span>
          </div>
          <div className="flex items-end justify-between h-32 gap-1">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-lg gradient-primary transition-all" style={{ height: `${h}%`, opacity: 0.5 + (h / 200) }} />
                <span className="text-[9px] text-muted-foreground font-semibold">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <p className="text-sm font-bold mb-3">Most Used Templates</p>
          {[
            { name: "Proposal", pct: 82, g: "primary" },
            { name: "Report", pct: 64, g: "sunset" },
            { name: "Resume", pct: 38, g: "mint" },
          ].map((r) => (
            <div key={r.name} className="mb-3 last:mb-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-semibold">{r.name}</span>
                <span className="text-muted-foreground">{r.pct}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full gradient-${r.g} rounded-full transition-all`} style={{ width: `${r.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
};

const Stat = ({ icon: Icon, g, v, l }: any) => (
  <div className="glass-card p-3 text-center">
    <IconTile gradient={g} size="sm">
      <Icon className="w-4 h-4" />
    </IconTile>
    <p className="font-bold text-base mt-2">{v}</p>
    <p className="text-[10px] text-muted-foreground">{l}</p>
  </div>
);

export default Analytics;
