// Simple in-memory document store + PDF/DOCX/TXT export utilities
import { jsPDF } from "jspdf";

export type DocFormat = "PDF" | "DOCX" | "TXT" | "PPTX";

export interface DocSection {
  heading: string;
  body: string;
}

export interface DocData {
  title: string;
  subtitle: string;
  author: string;
  client: string;
  date: string;
  sections: DocSection[];
  options: {
    cover: boolean;
    toc: boolean;
    pageNumbers: boolean;
    branding: boolean;
    charts: boolean;
    images: boolean;
  };
  brand: {
    name: string;
    color: string; // hex
    accent: string;
  };
}

const defaultDoc: DocData = {
  title: "Digital Transformation Proposal",
  subtitle: "A comprehensive roadmap to AI-powered operations",
  author: "Jenny Wilson",
  client: "Acme Corporation",
  date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
  sections: [
    {
      heading: "Executive Summary",
      body:
        "This proposal outlines a comprehensive digital transformation strategy designed to modernize operations, accelerate growth, and unlock new revenue streams through AI-driven automation and cloud-native infrastructure. Our approach prioritizes measurable outcomes, rapid iteration, and a people-first change-management framework.",
    },
    {
      heading: "Key Benefits",
      body:
        "• 40% faster operational throughput across all departments\n• 28% reduction in repetitive manual workload\n• Real-time analytics and predictive forecasting\n• Scalable, secure architecture engineered for future growth\n• Unified customer experience across every channel",
    },
    {
      heading: "Proposed Solution",
      body:
        "We will deploy a modular platform built on serverless cloud services, integrated with your existing CRM and ERP. A dedicated AI layer handles document generation, customer triage, and predictive insights. Phased rollout in three sprints keeps risk low and momentum high.",
    },
    {
      heading: "Timeline & Milestones",
      body:
        "Phase 1 — Discovery & architecture (weeks 1–3)\nPhase 2 — Build & integrate (weeks 4–9)\nPhase 3 — Launch, train & optimize (weeks 10–12)\nOngoing — Quarterly reviews and capability expansion.",
    },
    {
      heading: "Investment",
      body:
        "Total program investment: $148,000 across 12 weeks, inclusive of platform licensing, integration, training, and 90 days of post-launch hypercare. Detailed line items are available in Appendix A.",
    },
  ],
  options: {
    cover: true,
    toc: true,
    pageNumbers: true,
    branding: true,
    charts: true,
    images: true,
  },
  brand: {
    name: "Lumen AI Studio",
    color: "#6366f1",
    accent: "#ec4899",
  },
};

let current: DocData = { ...defaultDoc };

export const getDoc = () => current;
export const setDoc = (patch: Partial<DocData>) => {
  current = { ...current, ...patch };
};
export const setOption = (key: keyof DocData["options"], value: boolean) => {
  current = { ...current, options: { ...current.options, [key]: value } };
};
export const resetDoc = () => {
  current = { ...defaultDoc };
};

// ---------- PDF generation ----------
function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}

export function buildPdf(doc: DocData = current): jsPDF {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();
  const margin = 56;
  const [pr, pg, pb] = hexToRgb(doc.brand.color);
  const [ar, ag, ab] = hexToRgb(doc.brand.accent);

  let pageIndex = 0;
  const tocEntries: { title: string; page: number }[] = [];

  const addPageFrame = (isCover = false) => {
    pageIndex += 1;
    if (doc.options.branding) {
      // top accent bar
      pdf.setFillColor(pr, pg, pb);
      pdf.rect(0, 0, pageW, isCover ? 0 : 6, "F");
      if (!isCover) {
        pdf.setFontSize(8);
        pdf.setTextColor(140);
        pdf.text(doc.brand.name.toUpperCase(), margin, 28);
        pdf.text(doc.title, pageW - margin, 28, { align: "right" });
      }
    }
    if (doc.options.pageNumbers && !isCover) {
      pdf.setFontSize(9);
      pdf.setTextColor(150);
      pdf.text(`${pageIndex}`, pageW / 2, pageH - 24, { align: "center" });
    }
  };

  // -------- Cover page --------
  if (doc.options.cover) {
    addPageFrame(true);
    // Gradient-ish background using two rectangles
    pdf.setFillColor(pr, pg, pb);
    pdf.rect(0, 0, pageW, pageH * 0.55, "F");
    pdf.setFillColor(ar, ag, ab);
    pdf.rect(0, pageH * 0.5, pageW, pageH * 0.08, "F");

    pdf.setTextColor(255);
    pdf.setFontSize(11);
    pdf.text(doc.brand.name.toUpperCase(), margin, 80);
    pdf.setFontSize(34);
    pdf.setFont("helvetica", "bold");
    const titleLines = pdf.splitTextToSize(doc.title, pageW - margin * 2);
    pdf.text(titleLines, margin, 160);
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    const subLines = pdf.splitTextToSize(doc.subtitle, pageW - margin * 2);
    pdf.text(subLines, margin, 160 + titleLines.length * 36 + 10);

    pdf.setTextColor(40);
    pdf.setFontSize(10);
    pdf.text(`Prepared for`, margin, pageH - 160);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.text(doc.client, margin, pageH - 142);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`By  ${doc.author}`, margin, pageH - 118);
    pdf.text(doc.date, margin, pageH - 102);
  }

  // -------- TOC placeholder (fill later) --------
  let tocPageNumber = 0;
  if (doc.options.toc) {
    pdf.addPage();
    addPageFrame();
    tocPageNumber = pageIndex;
    // we'll re-render later
  }

  // -------- Content sections --------
  const drawSection = (s: DocSection) => {
    pdf.addPage();
    addPageFrame();
    tocEntries.push({ title: s.heading, page: pageIndex });

    pdf.setTextColor(pr, pg, pb);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text(s.heading, margin, 90);

    pdf.setDrawColor(pr, pg, pb);
    pdf.setLineWidth(2);
    pdf.line(margin, 100, margin + 40, 100);

    pdf.setTextColor(50);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    const lines = pdf.splitTextToSize(s.body, pageW - margin * 2);
    pdf.text(lines, margin, 130, { lineHeightFactor: 1.55 });

    // Optional chart/image placeholder for first content sections
    if (doc.options.charts && tocEntries.length === 1) {
      const cy = 130 + lines.length * 15 + 30;
      pdf.setFillColor(245, 247, 255);
      pdf.roundedRect(margin, cy, pageW - margin * 2, 140, 12, 12, "F");
      pdf.setTextColor(120);
      pdf.setFontSize(9);
      pdf.text("FIG. 1 — Projected operational uplift", margin + 14, cy + 22);
      // bars
      const barBase = cy + 120;
      const heights = [40, 70, 55, 95, 80, 110];
      const barW = 28;
      heights.forEach((h, i) => {
        pdf.setFillColor(pr, pg, pb);
        pdf.roundedRect(margin + 20 + i * (barW + 14), barBase - h, barW, h, 4, 4, "F");
      });
    }
    if (doc.options.images && tocEntries.length === 2) {
      const iy = 130 + lines.length * 15 + 30;
      pdf.setFillColor(ar, ag, ab);
      pdf.roundedRect(margin, iy, pageW - margin * 2, 120, 12, 12, "F");
      pdf.setTextColor(255);
      pdf.setFontSize(11);
      pdf.text("[ AI-generated illustration ]", pageW / 2, iy + 68, { align: "center" });
    }
  };

  doc.sections.forEach(drawSection);

  // -------- Render TOC now that we know page numbers --------
  if (doc.options.toc && tocPageNumber > 0) {
    pdf.setPage(doc.options.cover ? 2 : 1);
    pdf.setTextColor(pr, pg, pb);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);
    pdf.text("Table of Contents", margin, 100);
    pdf.setDrawColor(pr, pg, pb);
    pdf.line(margin, 110, margin + 40, 110);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    pdf.setTextColor(40);
    tocEntries.forEach((e, i) => {
      const y = 150 + i * 28;
      pdf.text(`${i + 1}.  ${e.title}`, margin, y);
      pdf.text(`${e.page}`, pageW - margin, y, { align: "right" });
      pdf.setDrawColor(220);
      pdf.setLineDashPattern([1, 2], 0);
      pdf.line(margin + pdf.getTextWidth(`${i + 1}.  ${e.title}`) + 8, y - 3, pageW - margin - 18, y - 3);
      pdf.setLineDashPattern([], 0);
    });
  }

  return pdf;
}

export function downloadPdf(doc: DocData = current) {
  const pdf = buildPdf(doc);
  pdf.save(`${doc.title.replace(/\s+/g, "_")}.pdf`);
}

export function pdfDataUri(doc: DocData = current): string {
  return buildPdf(doc).output("datauristring");
}

export function pdfBlobUrl(doc: DocData = current): string {
  const blob = buildPdf(doc).output("blob");
  return URL.createObjectURL(blob);
}

export function downloadTxt(doc: DocData = current) {
  const text =
    `${doc.title}\n${doc.subtitle}\n\nPrepared for: ${doc.client}\nBy: ${doc.author}\nDate: ${doc.date}\n\n` +
    doc.sections.map((s) => `${s.heading}\n${"-".repeat(s.heading.length)}\n${s.body}\n`).join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  triggerDownload(blob, `${doc.title.replace(/\s+/g, "_")}.txt`);
}

export function downloadDocx(doc: DocData = current) {
  // Minimal Word-readable HTML wrapped in .doc — opens in Word/Google Docs
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(doc.title)}</title></head>
  <body style="font-family:Calibri,Arial,sans-serif;color:#222;">
    <h1 style="color:${doc.brand.color};">${escapeHtml(doc.title)}</h1>
    <h3 style="color:#666;font-weight:normal;">${escapeHtml(doc.subtitle)}</h3>
    <p><b>Prepared for:</b> ${escapeHtml(doc.client)}<br/><b>By:</b> ${escapeHtml(doc.author)}<br/><b>Date:</b> ${escapeHtml(doc.date)}</p>
    <hr/>
    ${doc.sections
      .map(
        (s) =>
          `<h2 style="color:${doc.brand.color};">${escapeHtml(s.heading)}</h2><p style="white-space:pre-wrap;line-height:1.6;">${escapeHtml(s.body)}</p>`
      )
      .join("")}
  </body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  triggerDownload(blob, `${doc.title.replace(/\s+/g, "_")}.doc`);
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function shareDoc(doc: DocData = current) {
  const url = `${window.location.origin}/preview`;
  const shareData = { title: doc.title, text: `${doc.title} — ${doc.subtitle}`, url };
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return "shared";
    } catch {
      // fall through to copy
    }
  }
  await navigator.clipboard.writeText(url);
  return "copied";
}
