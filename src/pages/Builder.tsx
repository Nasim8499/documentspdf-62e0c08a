import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton } from "@/components/ui-bits";
import { A4Document } from "@/components/A4Document";
import { applyBuilder, BUILDERS, BuilderType, COUNTRIES } from "@/lib/builders";
import { getDoc } from "@/lib/docStore";
import { Eye, FileDown, Globe2 } from "lucide-react";

const Builder = () => {
  const { type } = useParams<{ type: BuilderType }>();
  const nav = useNavigate();
  const cfg = type && BUILDERS[type as BuilderType];

  const [country, setCountry] = useState("US");
  const [values, setValues] = useState<Record<string, string>>({});
  const [, force] = useState(0);

  const fields = useMemo(() => {
    if (!cfg) return [];
    const extra = cfg.extraByCountry?.[country] || [];
    return [...cfg.fields, ...extra];
  }, [cfg, country]);

  if (!cfg) {
    return (
      <MobileShell>
        <PageHeader title="Builder not found" />
        <div className="px-6 text-sm text-muted-foreground">Unknown builder type.</div>
      </MobileShell>
    );
  }

  const set = (k: string, v: string) => setValues((p) => ({ ...p, [k]: v }));

  const generate = (goPreview = true) => {
    const missing = cfg.fields.filter((f) => f.required && !values[f.key]?.trim());
    if (missing.length) {
      toast.error(`Please fill: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }
    applyBuilder(cfg.type, values, country);
    force((n) => n + 1);
    toast.success("Document generated");
    if (goPreview) nav("/preview");
  };

  const livePreview = () => {
    applyBuilder(cfg.type, values, country);
    force((n) => n + 1);
  };

  const doc = getDoc();

  return (
    <MobileShell>
      <PageHeader
        title={cfg.title}
        subtitle={cfg.description}
        right={
          <button
            onClick={() => generate(true)}
            className="px-3 py-2 rounded-xl gradient-primary text-white text-xs font-semibold btn-press shadow-md flex items-center gap-1"
          >
            <FileDown className="w-3.5 h-3.5" /> Preview
          </button>
        }
      />
      <div className="px-6 space-y-5 pb-6">
        {/* Country selector */}
        <div className="glass-card p-4">
          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 mb-2">
            <Globe2 className="w-3.5 h-3.5" /> COUNTRY / JURISDICTION
          </label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className={`shrink-0 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 btn-press transition-all ${
                  country === c.code
                    ? "gradient-primary text-white shadow-md"
                    : "bg-white border border-border"
                }`}
              >
                <span className="text-base leading-none">{c.flag}</span>
                {c.code}
              </button>
            ))}
          </div>
        </div>

        {/* Fields */}
        <div className="glass-card p-4 space-y-3">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                {f.label}
                {f.required && <span className="text-pink-500 ml-0.5">*</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea
                  value={values[f.key] || ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={3}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/80 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.key] || ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/80 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Select…</option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || "text"}
                  value={values[f.key] || ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="mt-1 w-full px-3 py-2.5 rounded-xl bg-white/80 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              )}
            </div>
          ))}
        </div>

        {/* Live A4 preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-primary" /> Live A4 Preview
            </p>
            <button
              onClick={livePreview}
              className="text-xs font-semibold text-primary"
            >
              Refresh
            </button>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border bg-slate-50 p-3">
            <div className="overflow-auto" style={{ maxHeight: 360 }}>
              <div
                style={{
                  transform: "scale(0.35)",
                  transformOrigin: "top center",
                  width: 794,
                  margin: "0 auto",
                }}
              >
                <A4Document doc={doc} activePage={1} />
              </div>
            </div>
          </div>
        </div>

        <GradientButton onClick={() => generate(true)} variant={(cfg.gradient === "candy" ? "primary" : cfg.gradient) as "primary" | "sunset" | "ocean" | "mint"}>
          Generate & Open Preview
        </GradientButton>
      </div>
    </MobileShell>
  );
};

export default Builder;
