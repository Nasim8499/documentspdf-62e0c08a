import { useMemo, useRef, useState } from "react";
import { Download, Share2, FileText, Check, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton } from "@/components/ui-bits";
import { A4Document } from "@/components/A4Document";
import { downloadDocx, downloadTxt, exportA4ToPdf, getDoc, PDF_FILENAME, shareDoc } from "@/lib/docStore";

const formats = [
  { name: "PDF", g: "primary" },
  { name: "DOCX", g: "ocean" },
  { name: "TXT", g: "mint" },
  { name: "PPTX", g: "sunset" },
] as const;

const Export = () => {
  const [fmt, setFmt] = useState<(typeof formats)[number]["name"]>("PDF");
  const [quality, setQuality] = useState<"High" | "Standard" | "Compact">("High");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const doc = getDoc();

  const pageCount = useMemo(() => {
    let n = doc.sections.length;
    if (doc.options.cover) n += 1;
    if (doc.options.toc) n += 1;
    return n;
  }, [doc]);

  const handleExport = async () => {
    setBusy(true);
    try {
      if (fmt === "PDF") {
        downloadPdf();
      } else if (fmt === "DOCX") {
        downloadDocx();
      } else if (fmt === "TXT") {
        downloadTxt();
      } else {
        // PPTX → fall back to PDF (most viewers accept)
        downloadPdf();
      }
      toast.success(`${fmt} downloaded`, { description: `${doc.title}` });
    } catch (e) {
      toast.error("Export failed");
    } finally {
      setTimeout(() => setBusy(false), 400);
    }
  };

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
                className={`relative py-4 rounded-2xl text-xs font-bold btn-press border transition-all ${
                  fmt === f.name
                    ? `gradient-${f.g} text-white border-transparent shadow-md`
                    : "bg-white text-foreground border-border hover:border-primary/40"
                }`}
              >
                {f.name}
                {fmt === f.name && <Check className="absolute top-1 right-1 w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">QUALITY</p>
          <div className="grid grid-cols-3 gap-2">
            {(["High", "Standard", "Compact"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`py-3 rounded-2xl text-xs font-semibold btn-press border ${
                  quality === q ? "gradient-primary text-white border-transparent" : "bg-white border-border"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card p-4 space-y-2">
          <Row k="Document" v={doc.title} />
          <Row k="Pages" v={`${pageCount}`} />
          <Row k="Quality" v={quality} />
          <Row k="Format" v={fmt} />
        </div>

        <GradientButton onClick={handleExport}>
          <span className="flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> {busy ? "Preparing…" : "Export Now"}
          </span>
        </GradientButton>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={async () => {
              const res = await shareDoc();
              toast.success(res === "shared" ? "Shared" : "Link copied");
            }}
            className="py-3.5 rounded-2xl bg-white border border-border font-semibold btn-press flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(`${window.location.origin}/preview`);
              toast.success("Link copied");
            }}
            className="py-3.5 rounded-2xl bg-white border border-border font-semibold btn-press flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy Link
          </button>
        </div>
        <button
          onClick={() => nav("/preview")}
          className="w-full py-3 text-sm font-semibold text-primary"
        >
          ← Back to preview
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
