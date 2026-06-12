import { Cpu, Globe, FileType, Mic2, FileText, Gauge, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton, IconTile } from "@/components/ui-bits";

const items = [
  { icon: Cpu, label: "AI Model", value: "GPT-4o", g: "primary" as const },
  { icon: Globe, label: "Language", value: "English (US)", g: "ocean" as const },
  { icon: FileType, label: "Output Format", value: "DOCX", g: "sunset" as const },
  { icon: Mic2, label: "Tone", value: "Professional", g: "candy" as const },
  { icon: FileText, label: "Page Size", value: "A4 (210 × 297 mm)", g: "mint" as const },
  { icon: Gauge, label: "Complexity", value: "Standard", g: "primary" as const },
];

const DocumentSettings = () => {
  const nav = useNavigate();
  return (
    <MobileShell>
      <PageHeader title="Document Settings" subtitle="Tune the output" />
      <div className="px-6 space-y-3">
        {items.map((it) => (
          <button key={it.label} className="w-full glass-card p-4 flex items-center gap-3 btn-press text-left">
            <IconTile gradient={it.g}>
              <it.icon className="w-5 h-5" />
            </IconTile>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{it.label}</p>
              <p className="font-semibold text-sm">{it.value}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
        <div className="pt-4">
          <GradientButton onClick={() => nav("/options")}>Next</GradientButton>
        </div>
      </div>
    </MobileShell>
  );
};

export default DocumentSettings;
