import { useState } from "react";
import { Search, FileSignature, Mail, BookUser, Plane, Wrench, FileCheck2, Briefcase, Receipt, FileBarChart, BarChart3, ClipboardList, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, Chip, IconTile } from "@/components/ui-bits";

const cats = ["Builders", "Business", "Marketing", "HR"];

const builders = [
  { to: "/builder/contract", name: "Employment Contract", desc: "Country-aware contract", icon: FileSignature, g: "primary" as const, badge: "Country" },
  { to: "/builder/offer", name: "Offer Letter", desc: "Hiring offer by jurisdiction", icon: Mail, g: "sunset" as const, badge: "Country" },
  { to: "/builder/passport", name: "Passport Application", desc: "Auto-filled application", icon: BookUser, g: "ocean" as const, badge: "Auto-Fill" },
  { to: "/builder/visa", name: "Visa Form", desc: "Country-specific visa", icon: Plane, g: "candy" as const, badge: "Country" },
  { to: "/builder/workorder", name: "Work Order", desc: "Official job / work order", icon: Wrench, g: "mint" as const, badge: "PDF" },
  { to: "/builder/acknowledgement", name: "Acknowledgement", desc: "Receipt / handover", icon: FileCheck2, g: "primary" as const, badge: "PDF" },
];

const items = [
  { name: "Business Proposal", desc: "Professional sales-ready proposal", icon: Briefcase, g: "primary" as const },
  { name: "Project Report", desc: "Status reports with charts", icon: FileBarChart, g: "ocean" as const },
  { name: "Business Plan", desc: "Investor-ready plan", icon: ClipboardList, g: "sunset" as const },
  { name: "Resume", desc: "Modern CV with sections", icon: FileText, g: "candy" as const },
  { name: "Invoice", desc: "Clean billing invoice", icon: Receipt, g: "mint" as const },
  { name: "Marketing Strategy", desc: "Go-to-market playbook", icon: BarChart3, g: "primary" as const },
];

const Templates = () => {
  const [active, setActive] = useState("Builders");
  const nav = useNavigate();

  return (
    <MobileShell>
      <PageHeader title="Templates" subtitle="Builders & curated starters" />
      <div className="px-6 space-y-4 pb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input placeholder="Search templates…" className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-white/60 text-sm outline-none" />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {cats.map((c) => (
            <Chip key={c} active={active === c} onClick={() => setActive(c)}>
              {c}
            </Chip>
          ))}
        </div>

        {active === "Builders" ? (
          <div className="space-y-3">
            {builders.map((t) => (
              <button
                key={t.to}
                onClick={() => nav(t.to)}
                className="w-full glass-card p-4 flex items-center gap-3 text-left btn-press hover:scale-[1.01] transition-transform"
              >
                <IconTile gradient={t.g} size="lg">
                  <t.icon className="w-6 h-6" />
                </IconTile>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-primary/10 text-primary">
                      {t.badge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <span className="text-xs font-bold px-3 py-2 rounded-xl gradient-primary text-white">
                  Open
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((t) => (
              <div key={t.name} className="glass-card p-4 flex items-center gap-3">
                <IconTile gradient={t.g} size="lg">
                  <t.icon className="w-6 h-6" />
                </IconTile>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
                <button onClick={() => nav("/settings")} className="text-xs font-bold px-3 py-2 rounded-xl gradient-primary text-white btn-press">
                  Use
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileShell>
  );
};

export default Templates;
