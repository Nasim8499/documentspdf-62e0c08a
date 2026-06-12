import { useMemo, useRef, useState } from "react";
import { Download, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/ui-bits";
import { A4Document } from "@/components/A4Document";
import { exportA4ToPdf, getDoc, PDF_FILENAME, shareDoc } from "@/lib/docStore";

const PdfPreview = () => {
  const nav = useNavigate();
  const doc = getDoc();
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(40);
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = useMemo(() => {
    let n = doc.sections.length;
    if (doc.options.cover) n += 1;
    if (doc.options.toc) n += 1;
    return n;
  }, [doc]);

  const handleExport = async () => {
    if (!containerRef.current) return;
    setBusy(true);
    toast.loading("Generating PDF...", { id: "pdf" });
    try {
      await exportA4ToPdf(containerRef.current);
      toast.success("PDF downloaded", { id: "pdf", description: PDF_FILENAME });
    } catch (e) {
      toast.error("Export failed", { id: "pdf" });
    } finally {
      setBusy(false);
    }
  };

  const handleShare = async () => {
    const res = await shareDoc();
    toast.success(res === "shared" ? "Shared successfully" : "Link copied");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/preview`);
    toast.success("Link copied");
  };

  const scale = zoom / 100;

  return (
    <MobileShell>
      <PageHeader
        title="Preview"
        subtitle={`Page ${page} of ${totalPages}`}
        right={
          <button
            onClick={() => nav("/export")}
            className="px-4 py-2 rounded-xl gradient-primary text-white text-xs font-semibold btn-press shadow-md"
          >
            Export
          </button>
        }
      />
      <div className="px-6 space-y-4">
        {/* A4 viewport */}
        <div
          className="rounded-3xl overflow-hidden border border-border bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4"
          style={{ aspectRatio: "210 / 297" }}
        >
          <div className="w-full h-full overflow-auto flex justify-center">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                width: 794,
              }}
            >
              <A4Document ref={containerRef} doc={doc} activePage={page} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press disabled:opacity-40"
              disabled={page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 tabular-nums">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press disabled:opacity-40"
              disabled={page >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom((z) => Math.max(20, z - 10))}
              className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 tabular-nums">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(120, z + 10))}
              className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            disabled={busy}
            onClick={handleExport}
            className="py-3.5 rounded-2xl gradient-primary text-white font-semibold btn-press flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ boxShadow: "var(--shadow-button)" }}
          >
            <Download className="w-4 h-4" /> {busy ? "..." : "PDF"}
          </button>
          <button
            onClick={handleShare}
            className="py-3.5 rounded-2xl bg-white border border-border font-semibold btn-press flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handleCopy}
            className="py-3.5 rounded-2xl bg-white border border-border font-semibold btn-press flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
        </div>
      </div>
    </MobileShell>
  );
};

export default PdfPreview;
