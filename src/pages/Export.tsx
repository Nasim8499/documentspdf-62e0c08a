import { useState } from "react";
import { Download, Share2, FileText, ChevronDown, Check } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton } from "@/components/ui-bits";
import { useToast } from "@/hooks/use-toast";

const formats = [
  { name: "PDF", g: "primary" },
  { name: "DOCX", g: "ocean" },
  { name: "TXT", g: "mint" },
  { name: "PPTX", g: "sunset" },
];

const Export = () => {
  const [fmt, setFmt] = useState("PDF");
  const { toast } = useToast();
  return (
    <MobileShell>
      <PageHeader title="Export Options" subtitle="Choose your perfect format" />
      <div className="px-6 space-y-5">
        <div className="flex flex-col items-center pt-2">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 gradient-hero rounded-3xl blur-2xl opacity-50" />
            <div className="relative w-full h-full rounded-3xl gradient-hero flex items-center justify-center animate-floaty">
              <FileText className="w-20 h-20 text-white" strokeWidth={1.2} />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">FORMAT</p>
          <div className="grid grid-cols-4 gap-2">
            {formats.map((f) => (
              <button
                key={f.name}
                onClick={() => setFmt(f.name)}
                className={`relative py-4 rounded-2xl text-xs font-bold btn-press border ${
                  fmt === f.name
                    ? `gradient-${f.g} text-white border-transparent`
                    : "bg-white text-foreground border-border"
                }`}
              >
                {f.name}
                {fmt === f.name && (
                  <Check className="absolute top-1 right-1 w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">QUALITY</p>
          <button className="w-full glass-card p-4 flex items-center justify-between btn-press">
            <span className="text-sm font-semibold">High Quality</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="glass-card p-4 space-y-2">
          <Row k="Document" v="Business Proposal" />
          <Row k="Pages" v="8" />
          <Row k="Size" v="~ 2.4 MB" />
          <Row k="Format" v={fmt} />
        </div>

        <GradientButton onClick={() => toast({ title: "Exported!", description: `${fmt} downloaded successfully.` })}>
          <span className="flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Export Now</span>
        </GradientButton>
        <button className="w-full py-3.5 rounded-2xl bg-white border border-border font-semibold btn-press flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Share Link
        </button>
      </div>
    </MobileShell>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-muted-foreground">{k}</span>
    <span className="font-semibold">{v}</span>
  </div>
);

export default Export;
