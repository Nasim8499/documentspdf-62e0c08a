import { Download, Share2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader } from "@/components/ui-bits";

const PdfPreview = () => {
  const nav = useNavigate();
  return (
    <MobileShell>
      <PageHeader
        title="Preview"
        subtitle="Page 1 of 8"
        right={
          <button onClick={() => nav("/export")} className="px-4 py-2 rounded-xl gradient-primary text-white text-xs font-semibold btn-press">
            Export
          </button>
        }
      />
      <div className="px-6 space-y-4">
        {/* A4 document */}
        <div className="bg-white rounded-3xl shadow-xl p-6 aspect-[210/297] overflow-hidden border border-border">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <p className="text-[10px] text-muted-foreground">BUSINESS PROPOSAL</p>
            <p className="text-[10px] text-muted-foreground">2026</p>
          </div>
          <h2 className="text-lg font-bold gradient-text">Digital Transformation Solution</h2>
          <p className="text-[10px] text-muted-foreground mt-1">Prepared for Acme Corp · Jenny Wilson</p>

          <div className="mt-5">
            <p className="text-xs font-bold mb-1">Executive Summary</p>
            <p className="text-[10px] leading-relaxed text-foreground/80">
              This proposal outlines a comprehensive digital transformation strategy designed to modernize operations, accelerate growth, and unlock new revenue streams through AI-driven automation and cloud-native infrastructure.
            </p>
          </div>

          <div className="mt-4">
            <p className="text-xs font-bold mb-1">Key Benefits</p>
            <ul className="text-[10px] space-y-1 text-foreground/80">
              <li>• 40% faster operational throughput</li>
              <li>• 28% reduction in manual workload</li>
              <li>• Real-time analytics and forecasting</li>
              <li>• Scalable architecture for future growth</li>
            </ul>
          </div>

          <div className="mt-4 h-16 rounded-xl gradient-candy opacity-70" />
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div className="h-10 rounded-lg bg-muted" />
            <div className="h-10 rounded-lg bg-muted" />
            <div className="h-10 rounded-lg bg-muted" />
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card p-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2">1 / 8</span>
            <button className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2">100%</span>
            <button className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center btn-press">
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => nav("/export")} className="py-3.5 rounded-2xl gradient-primary text-white font-semibold btn-press flex items-center justify-center gap-2" style={{ boxShadow: "var(--shadow-button)" }}>
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="py-3.5 rounded-2xl bg-white border border-border font-semibold btn-press flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </div>
    </MobileShell>
  );
};

export default PdfPreview;
