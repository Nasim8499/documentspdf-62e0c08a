import { useState } from "react";
import { BarChart3, Image as ImageIcon, Palette, List, Hash, Sparkles, Lightbulb, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton, IconTile, Toggle } from "@/components/ui-bits";
import { getDoc, setOption, type DocData } from "@/lib/docStore";

type Key = keyof DocData["options"];

const opts: { key: Key; icon: any; label: string; desc: string; g: "primary" | "sunset" | "candy" | "ocean" | "mint" }[] = [
  { key: "cover", icon: FileText, label: "Cover Page", desc: "Branded title page", g: "primary" },
  { key: "toc", icon: List, label: "Table of Contents", desc: "Auto-generated TOC", g: "ocean" },
  { key: "charts", icon: BarChart3, label: "Include Charts", desc: "Auto-generate data visuals", g: "sunset" },
  { key: "images", icon: ImageIcon, label: "Add Images", desc: "AI illustration placeholders", g: "candy" },
  { key: "branding", icon: Palette, label: "Branding", desc: "Apply brand colors & header", g: "mint" },
  { key: "pageNumbers", icon: Hash, label: "Page Numbers", desc: "Numbered pages in footer", g: "primary" },
];

const AdditionalOptions = () => {
  const nav = useNavigate();
  const [, force] = useState(0);
  const doc = getDoc();

  const set = (k: Key, v: boolean) => {
    setOption(k, v);
    force((x) => x + 1);
  };

  return (
    <MobileShell>
      <PageHeader title="Additional Options" subtitle="Refine your document" />
      <div className="px-6 space-y-3">
        {opts.map((o) => (
          <div key={o.key} className="glass-card p-4 flex items-center gap-3">
            <IconTile gradient={o.g}>
              <o.icon className="w-5 h-5" />
            </IconTile>
            <div className="flex-1">
              <p className="font-semibold text-sm">{o.label}</p>
              <p className="text-xs text-muted-foreground">{o.desc}</p>
            </div>
            <Toggle on={doc.options[o.key]} onChange={(v) => set(o.key, v)} />
          </div>
        ))}

        <div
          className="rounded-3xl p-4 border border-white/60 flex gap-3"
          style={{ background: "linear-gradient(135deg, hsl(33 100% 95%), hsl(320 100% 96%))" }}
        >
          <div className="w-10 h-10 rounded-2xl gradient-sunset flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-sm flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" /> Pro Tip
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Toggles update your real PDF instantly. Enable charts and branding for the most polished output.
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
