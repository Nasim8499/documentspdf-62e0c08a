import { useState } from "react";
import { BarChart3, Image as ImageIcon, Palette, List, Hash, Sparkles, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton, IconTile, Toggle } from "@/components/ui-bits";

const opts = [
  { icon: BarChart3, label: "Include Charts", desc: "Auto-generate data visualizations", g: "primary" as const },
  { icon: ImageIcon, label: "Add Images", desc: "AI-generated illustrations", g: "sunset" as const },
  { icon: Palette, label: "Branding", desc: "Apply your brand colors & logo", g: "candy" as const },
  { icon: List, label: "Table of Contents", desc: "Auto-generated TOC", g: "ocean" as const },
  { icon: Hash, label: "Page Numbers", desc: "Numbered pages in footer", g: "mint" as const },
  { icon: Sparkles, label: "Custom Theme", desc: "Premium typography & layout", g: "primary" as const },
];

const AdditionalOptions = () => {
  const nav = useNavigate();
  const [state, setState] = useState<Record<string, boolean>>({
    "Include Charts": true,
    "Add Images": true,
    "Page Numbers": true,
  });
  return (
    <MobileShell>
      <PageHeader title="Additional Options" subtitle="Refine your document" />
      <div className="px-6 space-y-3">
        {opts.map((o) => (
          <div key={o.label} className="glass-card p-4 flex items-center gap-3">
            <IconTile gradient={o.g}>
              <o.icon className="w-5 h-5" />
            </IconTile>
            <div className="flex-1">
              <p className="font-semibold text-sm">{o.label}</p>
              <p className="text-xs text-muted-foreground">{o.desc}</p>
            </div>
            <Toggle on={!!state[o.label]} onChange={(v) => setState({ ...state, [o.label]: v })} />
          </div>
        ))}

        <div className="rounded-3xl p-4 gradient-candy/30 border border-white/60 flex gap-3" style={{ background: "linear-gradient(135deg, hsl(33 100% 95%), hsl(320 100% 96%))" }}>
          <div className="w-10 h-10 rounded-2xl gradient-sunset flex items-center justify-center text-white shrink-0">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm">Pro Tip</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enable charts and images for the most engaging documents. Branding unifies all exports.
            </p>
          </div>
        </div>

        <div className="pt-3">
          <GradientButton onClick={() => nav("/generating")}>Generate Document</GradientButton>
        </div>
      </div>
    </MobileShell>
  );
};

export default AdditionalOptions;
