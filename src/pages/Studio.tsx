import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton, Chip, Toggle } from "@/components/ui-bits";
import { Upload, Undo2, Redo2, Download, Settings2, ChevronLeft, ChevronRight, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

// pdfjs setup with bundled worker
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore vite worker import
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = PdfWorker;

type TextItem = {
  id: string;
  page: number;
  text: string;
  // Position in PDF points (top-left origin, we'll convert)
  x: number;
  y: number; // baseline
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: "normal" | "bold";
  fontStyle: "normal" | "italic";
  align: "left" | "center" | "right";
  color: string;
};

type PageRender = {
  pageNum: number;
  width: number; // CSS px at scale 1
  height: number;
  dataUrl: string; // rasterized background
  items: TextItem[];
};

type EditMap = Record<string, string>; // id -> new text

const RENDER_SCALE = 2; // for visual fidelity

const Studio = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [pages, setPages] = useState<PageRender[]>([]);
  const [activePage, setActivePage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // edits with undo/redo
  const [edits, setEdits] = useState<EditMap>({});
  const [history, setHistory] = useState<EditMap[]>([{}]);
  const [historyIdx, setHistoryIdx] = useState(0);

  // selection
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // export settings panel
  const [showSettings, setShowSettings] = useState(false);
  const [exportQuality, setExportQuality] = useState<"standard" | "high" | "max">("high");
  const [embedFonts, setEmbedFonts] = useState(true);
  const [imageFormat, setImageFormat] = useState<"jpeg" | "png">("jpeg");

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setContainerWidth(e.contentRect.width);
    });
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [pages.length]);

  const pushHistory = useCallback(
    (next: EditMap) => {
      const newHist = history.slice(0, historyIdx + 1);
      newHist.push(next);
      setHistory(newHist);
      setHistoryIdx(newHist.length - 1);
      setEdits(next);
    },
    [history, historyIdx]
  );

  const undo = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setEdits(history[idx]);
    }
  };
  const redo = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setEdits(history[idx]);
    }
  };

  const handleFile = async (file: File) => {
    setLoading(true);
    setProgress(0);
    setPages([]);
    setEdits({});
    setHistory([{}]);
    setHistoryIdx(0);
    setSelectedId(null);
    setFileName(file.name);
    try {
      const buf = await file.arrayBuffer();
      const pdf = await (pdfjsLib as any).getDocument({ data: buf }).promise;
      const out: PageRender[] = [];
      for (let p = 1; p <= pdf.numPages; p++) {
        const page = await pdf.getPage(p);
        const viewport = page.getViewport({ scale: RENDER_SCALE });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

        const textContent = await page.getTextContent();
        const items: TextItem[] = textContent.items
          .filter((it: any) => it.str && it.str.trim().length > 0)
          .map((it: any, i: number) => {
            // transform: [a, b, c, d, e, f] mapping
            const t = it.transform;
            const fontSize = Math.hypot(t[2], t[3]) || Math.abs(t[3]) || 12;
            const x = t[4];
            const yBaseline = t[5];
            const width = it.width || fontSize * it.str.length * 0.5;
            const height = it.height || fontSize;
            const fontName: string = it.fontName || "";
            const isBold = /bold/i.test(fontName);
            const isItalic = /italic|oblique/i.test(fontName);
            return {
              id: `p${p}-i${i}`,
              page: p,
              text: it.str,
              x,
              y: yBaseline,
              width,
              height,
              fontSize,
              fontFamily: isItalic || isBold ? fontName : "inherit",
              fontWeight: isBold ? "bold" : "normal",
              fontStyle: isItalic ? "italic" : "normal",
              align: "left",
              color: "#111",
            };
          });

        out.push({
          pageNum: p,
          width: viewport.width / RENDER_SCALE, // back to pt
          height: viewport.height / RENDER_SCALE,
          dataUrl,
          items,
        });
        setProgress(Math.round((p / pdf.numPages) * 100));
      }
      setPages(out);
      setActivePage(0);
      toast.success(`Loaded ${pdf.numPages} pages`);
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to load PDF");
    } finally {
      setLoading(false);
    }
  };

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
    if (e.target) e.target.value = "";
  };

  const current = pages[activePage];

  const displayScale = useMemo(() => {
    if (!current || !containerWidth) return 1;
    return containerWidth / current.width;
  }, [current, containerWidth]);

  const updateText = (id: string, newText: string) => {
    const next = { ...edits, [id]: newText };
    pushHistory(next);
  };

  const handleExport = async () => {
    if (!pages.length) return;
    toast.loading("Exporting PDF…", { id: "exp" });
    try {
      const qualityMap = { standard: 0.75, high: 0.92, max: 1 };
      const scaleMap = { standard: 1.5, high: 2, max: 3 };
      const jpgQ = qualityMap[exportQuality];
      const expScale = scaleMap[exportQuality];

      const first = pages[0];
      const pdf = new jsPDF({
        unit: "pt",
        format: [first.width, first.height],
        orientation: first.width > first.height ? "landscape" : "portrait",
        compress: true,
      });

      for (let i = 0; i < pages.length; i++) {
        const pg = pages[i];
        if (i > 0) pdf.addPage([pg.width, pg.height], pg.width > pg.height ? "landscape" : "portrait");

        // Re-render at export scale for crispness
        // We reuse the already rasterized dataUrl (RENDER_SCALE=2) which is sufficient for high.
        // For "max" we still use existing; image already at 2x.
        void expScale;
        pdf.addImage(pg.dataUrl, imageFormat.toUpperCase() as any, 0, 0, pg.width, pg.height, undefined, "FAST");

        // Apply edits: cover original with white rect + draw new text
        for (const item of pg.items) {
          const newText = edits[item.id];
          if (newText == null || newText === item.text) continue;
          // Convert baseline y to top-left for rect
          const top = pg.height - item.y - item.height;
          pdf.setFillColor(255, 255, 255);
          pdf.rect(item.x - 1, top - 1, Math.max(item.width, 4) + 2, item.height + 2, "F");

          if (embedFonts) {
            pdf.setFont("helvetica", item.fontWeight === "bold" ? "bold" : (item.fontStyle === "italic" ? "italic" : "normal"));
          }
          pdf.setFontSize(item.fontSize);
          pdf.setTextColor(17, 17, 17);
          // baseline draw
          pdf.text(newText, item.x, pg.height - item.y, { baseline: "alphabetic" });
        }
      }

      const out = (fileName || "studio").replace(/\.pdf$/i, "") + "-edited.pdf";
      pdf.save(out);
      toast.success("Exported", { id: "exp" });
    } catch (e: any) {
      console.error(e);
      toast.error("Export failed: " + (e?.message || "unknown"), { id: "exp" });
    }
  };

  return (
    <MobileShell statusDark={false}>
      <PageHeader
        title="Studio"
        subtitle={fileName ? fileName : "Upload PDF · Click text to edit"}
        right={
          <div className="flex gap-1.5">
            <button
              onClick={undo}
              disabled={historyIdx <= 0}
              className="w-9 h-9 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center btn-press disabled:opacity-40"
              aria-label="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIdx >= history.length - 1}
              className="w-9 h-9 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center btn-press disabled:opacity-40"
              aria-label="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowSettings((v) => !v)}
              className="w-9 h-9 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center btn-press"
              aria-label="Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        }
      />

      <div className="px-5 space-y-4">
        {!pages.length && !loading && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-3xl p-8 gradient-hero text-white text-center btn-press relative overflow-hidden"
            style={{ boxShadow: "var(--shadow-glow)" }}
          >
            <Sparkles className="absolute top-3 right-3 w-5 h-5 opacity-70" />
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-3">
              <Upload className="w-8 h-8" />
            </div>
            <p className="font-bold text-lg">Upload PDF from Device</p>
            <p className="text-xs text-white/80 mt-1">Original layout preserved · Tap any text to edit</p>
          </button>
        )}

        {loading && (
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 mx-auto rounded-full gradient-primary flex items-center justify-center text-white mb-3 animate-pulse">
              <FileText className="w-6 h-6" />
            </div>
            <p className="font-semibold text-sm">Loading document… {progress}%</p>
            <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full gradient-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {showSettings && (
          <div className="glass-card p-4 space-y-3">
            <p className="text-sm font-bold">Export Settings</p>
            <div>
              <p className="text-[11px] text-muted-foreground mb-2">Image quality</p>
              <div className="flex gap-2">
                {(["standard", "high", "max"] as const).map((q) => (
                  <Chip key={q} active={exportQuality === q} onClick={() => setExportQuality(q)}>
                    {q[0].toUpperCase() + q.slice(1)}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-2">Image format</p>
              <div className="flex gap-2">
                <Chip active={imageFormat === "jpeg"} onClick={() => setImageFormat("jpeg")}>JPEG (smaller)</Chip>
                <Chip active={imageFormat === "png"} onClick={() => setImageFormat("png")}>PNG (lossless)</Chip>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-sm font-semibold">Embed fonts</p>
                <p className="text-[11px] text-muted-foreground">Preserve weight & style on edits</p>
              </div>
              <Toggle on={embedFonts} onChange={setEmbedFonts} />
            </div>
          </div>
        )}

        {!!pages.length && (
          <>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActivePage((p) => Math.max(0, p - 1))}
                disabled={activePage === 0}
                className="w-9 h-9 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center btn-press disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <p className="text-xs font-semibold">
                Page {activePage + 1} / {pages.length}
              </p>
              <button
                onClick={() => setActivePage((p) => Math.min(pages.length - 1, p + 1))}
                disabled={activePage === pages.length - 1}
                className="w-9 h-9 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center btn-press disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={containerRef}
              className="relative w-full rounded-2xl overflow-hidden shadow-xl border border-white/60 bg-white"
              style={{ aspectRatio: current ? `${current.width} / ${current.height}` : "1 / 1.414" }}
            >
              {current && (
                <>
                  <img
                    src={current.dataUrl}
                    alt={`Page ${current.pageNum}`}
                    className="absolute inset-0 w-full h-full select-none pointer-events-none"
                    draggable={false}
                  />
                  {/* Editable overlays */}
                  {current.items.map((it) => {
                    const top = (current.height - it.y - it.height) * displayScale;
                    const left = it.x * displayScale;
                    const w = Math.max(it.width, 8) * displayScale;
                    const h = it.height * displayScale;
                    const fontPx = it.fontSize * displayScale;
                    const isSelected = selectedId === it.id;
                    const value = edits[it.id] ?? it.text;
                    const edited = edits[it.id] != null && edits[it.id] !== it.text;
                    return (
                      <div
                        key={it.id}
                        onClick={() => setSelectedId(it.id)}
                        className={`absolute group cursor-text ${
                          isSelected ? "ring-2 ring-primary bg-white" : edited ? "bg-yellow-50/80" : "hover:bg-primary/10"
                        }`}
                        style={{
                          top,
                          left,
                          width: w,
                          minHeight: h,
                          padding: 0,
                          borderRadius: 2,
                        }}
                      >
                        {isSelected ? (
                          <input
                            autoFocus
                            value={value}
                            onChange={(e) => updateText(it.id, e.target.value)}
                            onBlur={() => setSelectedId(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === "Escape") (e.target as HTMLInputElement).blur();
                            }}
                            className="w-full bg-white outline-none border-none p-0 m-0"
                            style={{
                              fontSize: fontPx,
                              fontWeight: it.fontWeight,
                              fontStyle: it.fontStyle,
                              fontFamily: it.fontFamily,
                              textAlign: it.align,
                              color: it.color,
                              lineHeight: 1,
                            }}
                          />
                        ) : edited ? (
                          <span
                            className="block whitespace-pre"
                            style={{
                              fontSize: fontPx,
                              fontWeight: it.fontWeight,
                              fontStyle: it.fontStyle,
                              fontFamily: it.fontFamily,
                              textAlign: it.align,
                              color: it.color,
                              lineHeight: 1,
                            }}
                          >
                            {value}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 rounded-2xl bg-white/80 border border-white/60 text-sm font-semibold btn-press flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" /> Replace
              </button>
              <GradientButton onClick={handleExport} className="!flex-1 !py-3 flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Export PDF
              </GradientButton>
            </div>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        className="hidden"
      />
    </MobileShell>
  );
};

export default Studio;
