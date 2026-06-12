import { MapPin, Calendar, Sun, Compass, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton, IconTile } from "@/components/ui-bits";

const Itinerary = () => {
  const nav = useNavigate();
  return (
    <MobileShell>
      <PageHeader title="Smart Itinerary" subtitle="AI-crafted travel plans" />
      <div className="px-6 space-y-5">
        <div className="rounded-3xl overflow-hidden relative h-44" style={{ background: "linear-gradient(135deg, hsl(190 90% 60%), hsl(245 100% 70%), hsl(320 100% 65%))" }}>
          <Sparkles className="absolute top-4 right-4 w-5 h-5 text-white/70" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute top-3 left-3 text-white/70 text-[10px] font-bold px-2 py-1 bg-white/20 backdrop-blur rounded-full">DESTINATION</div>
          <div className="absolute bottom-4 left-4 text-white">
            <p className="text-2xl font-bold">Bali, Indonesia</p>
            <p className="text-xs opacity-90 flex items-center gap-1"><MapPin className="w-3 h-3" /> Ubud · Seminyak · Nusa Penida</p>
          </div>
          <div className="absolute bottom-4 right-4">
            <Sun className="w-12 h-12 text-white animate-floaty" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Mini label="Days" value="7" g="primary" />
          <Mini label="Nights" value="6" g="sunset" />
          <Mini label="Activities" value="14" g="mint" />
        </div>

        <div className="glass-card p-5 space-y-3">
          <p className="text-sm font-bold">Trip Overview</p>
          <div className="flex items-start gap-3">
            <IconTile gradient="primary" size="sm"><Calendar className="w-4 h-4" /></IconTile>
            <div>
              <p className="text-sm font-semibold">Jul 14 — Jul 21, 2026</p>
              <p className="text-xs text-muted-foreground">High season · sunny weather</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <IconTile gradient="sunset" size="sm"><Compass className="w-4 h-4" /></IconTile>
            <div>
              <p className="text-sm font-semibold">Adventure · Culture · Relax</p>
              <p className="text-xs text-muted-foreground">Balanced itinerary mix</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-4 space-y-3">
          <p className="text-sm font-bold mb-1">Highlights</p>
          {[
            { d: "Day 1", t: "Arrival · Seminyak sunset dinner" },
            { d: "Day 3", t: "Ubud rice terraces & temple tour" },
            { d: "Day 5", t: "Nusa Penida snorkeling day" },
          ].map((h) => (
            <div key={h.d} className="flex gap-3 items-center">
              <div className="text-[10px] font-bold px-2 py-1 rounded-lg gradient-primary text-white">{h.d}</div>
              <p className="text-xs">{h.t}</p>
            </div>
          ))}
        </div>

        <GradientButton variant="sunset" onClick={() => nav("/generating")}>Generate Itinerary</GradientButton>
      </div>
    </MobileShell>
  );
};

const Mini = ({ label, value, g }: any) => (
  <div className="glass-card p-3 text-center">
    <p className={`text-xl font-bold gradient-text`}>{value}</p>
    <p className="text-[10px] text-muted-foreground">{label}</p>
  </div>
);

export default Itinerary;
