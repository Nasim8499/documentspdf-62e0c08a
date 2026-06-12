import { forwardRef } from "react";
import { DocData } from "@/lib/docStore";
import { BarChart3, Image as ImageIcon, Sparkles } from "lucide-react";

// A4 at 96dpi-ish for screen: 794 x 1123 px
const PAGE = "w-[794px] h-[1123px]";

const Page = ({
  children,
  number,
  total,
  doc,
  hideFooter = false,
}: {
  children: React.ReactNode;
  number: number;
  total: number;
  doc: DocData;
  hideFooter?: boolean;
}) => (
  <div
    className={`${PAGE} bg-white relative overflow-hidden shadow-[0_8px_40px_-12px_rgba(60,40,120,0.18)] mx-auto`}
    style={{ pageBreakAfter: "always" }}
  >
    {doc.options.branding && (
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: `linear-gradient(90deg, ${doc.brand.color}, ${doc.brand.accent})` }}
      />
    )}
    <div className="absolute top-6 left-12 right-12 flex justify-between text-[10px] text-neutral-400 uppercase tracking-widest">
      <span>{doc.brand.name}</span>
      <span>{doc.title}</span>
    </div>
    <div className="absolute inset-0 px-14 pt-20 pb-16 flex flex-col">{children}</div>
    {!hideFooter && doc.options.pageNumbers && (
      <div className="absolute bottom-6 left-0 right-0 flex justify-center text-[10px] text-neutral-400 tabular-nums">
        Page {number} of {total}
      </div>
    )}
  </div>
);

export const A4Document = forwardRef<HTMLDivElement, { doc: DocData; activePage?: number }>(
  ({ doc, activePage }, ref) => {
    const pages: React.ReactNode[] = [];
    let n = 0;
    const total =
      (doc.options.cover ? 1 : 0) + (doc.options.toc ? 1 : 0) + doc.sections.length;

    if (doc.options.cover) {
      n += 1;
      pages.push(
        <div
          key="cover"
          className={`${PAGE} relative overflow-hidden mx-auto shadow-[0_8px_40px_-12px_rgba(60,40,120,0.18)]`}
          style={{ pageBreakAfter: "always" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(140deg, ${doc.brand.color} 0%, ${doc.brand.accent} 100%)`,
            }}
          />
          <div className="absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-40 -left-24 w-[460px] h-[460px] rounded-full bg-white/10 blur-2xl" />
          <div className="relative h-full px-14 py-16 text-white flex flex-col">
            <div className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase opacity-90">
              <Sparkles className="w-4 h-4" /> {doc.brand.name}
            </div>
            <div className="mt-auto">
              <div className="text-[11px] uppercase tracking-[0.3em] opacity-80 mb-3">Proposal</div>
              <h1 className="text-[54px] leading-[1.05] font-bold tracking-tight">{doc.title}</h1>
              <p className="mt-5 text-lg opacity-90 max-w-[520px]">{doc.subtitle}</p>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 text-sm border-t border-white/30 pt-6">
              <div>
                <div className="opacity-70 text-[10px] uppercase tracking-widest">Prepared for</div>
                <div className="font-semibold mt-1">{doc.client}</div>
              </div>
              <div>
                <div className="opacity-70 text-[10px] uppercase tracking-widest">By</div>
                <div className="font-semibold mt-1">{doc.author}</div>
              </div>
              <div>
                <div className="opacity-70 text-[10px] uppercase tracking-widest">Date</div>
                <div className="font-semibold mt-1">{doc.date}</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (doc.options.toc) {
      n += 1;
      pages.push(
        <Page key="toc" number={n} total={total} doc={doc}>
          <h2 className="text-3xl font-bold" style={{ color: doc.brand.color }}>
            Table of Contents
          </h2>
          <div
            className="h-1 w-12 rounded-full mt-3 mb-8"
            style={{ background: `linear-gradient(90deg, ${doc.brand.color}, ${doc.brand.accent})` }}
          />
          <div className="space-y-4">
            {doc.sections.map((s, i) => {
              const pageNum = (doc.options.cover ? 1 : 0) + (doc.options.toc ? 1 : 0) + i + 1;
              return (
                <div key={i} className="flex items-baseline gap-3 text-[15px]">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: doc.brand.color }}
                  >
                    {i + 1}
                  </span>
                  <span className="font-medium text-neutral-800">{s.heading}</span>
                  <span className="flex-1 border-b border-dotted border-neutral-300 mx-2 translate-y-[-4px]" />
                  <span className="tabular-nums text-neutral-500">{pageNum}</span>
                </div>
              );
            })}
          </div>
        </Page>
      );
    }

    doc.sections.forEach((s, i) => {
      n += 1;
      pages.push(
        <Page key={`s-${i}`} number={n} total={total} doc={doc}>
          <div className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 mb-2">
            Section {String(i + 1).padStart(2, "0")}
          </div>
          <h2 className="text-3xl font-bold leading-tight" style={{ color: doc.brand.color }}>
            {s.heading}
          </h2>
          <div
            className="h-1 w-12 rounded-full mt-3 mb-6"
            style={{ background: `linear-gradient(90deg, ${doc.brand.color}, ${doc.brand.accent})` }}
          />
          <p className="text-[14px] leading-[1.75] text-neutral-700 whitespace-pre-line">{s.body}</p>

          {doc.options.charts && i === 0 && (
            <div className="mt-8 rounded-2xl p-5 bg-gradient-to-br from-indigo-50 to-pink-50 border border-indigo-100">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-neutral-500">
                <BarChart3 className="w-3.5 h-3.5" /> Fig. 1 — Projected uplift
              </div>
              <div className="mt-5 flex items-end gap-3 h-32">
                {[40, 65, 50, 88, 72, 100].map((h, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg"
                      style={{
                        height: `${h}%`,
                        background: `linear-gradient(180deg, ${doc.brand.color}, ${doc.brand.accent})`,
                      }}
                    />
                    <span className="text-[9px] text-neutral-400">Q{idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {doc.options.images && i === 1 && (
            <div
              className="mt-8 rounded-2xl h-40 flex items-center justify-center text-white"
              style={{
                background: `linear-gradient(135deg, ${doc.brand.color}, ${doc.brand.accent})`,
              }}
            >
              <div className="text-center">
                <ImageIcon className="w-8 h-8 mx-auto opacity-80" />
                <div className="text-sm mt-2 opacity-90">AI-generated illustration</div>
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 text-[10px] text-neutral-400 border-t border-neutral-100">
            {doc.brand.name} · Confidential · {doc.date}
          </div>
        </Page>
      );
    });

    return (
      <div ref={ref} className="space-y-8 bg-transparent">
        {pages.map((p, i) => (
          <div
            key={i}
            data-a4-page={i + 1}
            style={{ display: activePage && activePage !== i + 1 ? "none" : "block" }}
          >
            {p}
          </div>
        ))}
      </div>
    );
  }
);

A4Document.displayName = "A4Document";
