import { useEffect, useMemo, useState } from "react";
import { Download, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Copy, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/ui-bits";
import { downloadPdf, getDoc, pdfBlobUrl, shareDoc } from "@/lib/docStore";

const PdfPreview = () => {
  const nav = useNavigate();
  const doc = getDoc();
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [blobUrl, setBlobUrl] = useState<string>("");

  const totalPages = useMemo(() => {
    let n = doc.sections.length;
    if (doc.options.cover) n += 1;
    if (doc.options.toc) n += 1;
    return n;
  }, [doc]);

  useEffect(() => {
    const url = pdfBlobUrl();
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async () => {
    const res = await shareDoc();
    toast.success(res === "shared" ? "Shared successfully" : "Link copied to clipboard");
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/preview`);
    toast.success("Link copied");
  };

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
        <div
          className="rounded-3xl overflow-hidden border border-border shadow-xl bg-white"
          style={{ aspectRatio: "210 / 297" }}
        >
          {blobUrl ? (
            <iframe
              title="PDF preview"
              src={`${blobUrl}#page=${page}&zoom=${zoom}&toolbar=0&navpanes=0`}
              className="w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
              <FileText className="w-5 h-5 mr-2" /> Rendering…
            </div>
          )}
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
              onClick={() => setZoom((z) => Math.max(50, z - 25))}
              className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 tabular-nums">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(200, z + 25))}
              className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              downloadPdf();
              toast.success("PDF downloaded");
            }}
            className="py-3.5 rounded-2xl gradient-primary text-white font-semibold btn-press flex items-center justify-center gap-2"
            style={{ boxShadow: "var(--shadow-button)" }}
          >
            <Download className="w-4 h-4" /> PDF
          </button>
          <button
            onClick={handleShare}
            className="py-3.5 rounded-2xl bg-white border border-border font-semibold btn-press flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={handleCopyLink}
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
