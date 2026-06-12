import { useState } from "react";
import { Search, FileText, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, Chip, Card, IconTile } from "@/components/ui-bits";

const filters = ["All", "PDF", "DOCX", "PPTX", "XLSX"];
const docs = [
  { name: "Business Proposal", type: "PDF", date: "Jun 10, 2026", g: "primary" as const },
  { name: "Project Report", type: "DOCX", date: "Jun 8, 2026", g: "sunset" as const },
  { name: "Marketing Strategy", type: "PDF", date: "Jun 5, 2026", g: "candy" as const },
  { name: "Financial Analysis", type: "XLSX", date: "May 30, 2026", g: "mint" as const },
  { name: "Team Handbook", type: "DOCX", date: "May 22, 2026", g: "ocean" as const },
];

const Library = () => {
  const [active, setActive] = useState("All");
  const nav = useNavigate();
  const filtered = active === "All" ? docs : docs.filter((d) => d.type === active);
  return (
    <MobileShell>
      <PageHeader title="Documents" subtitle="All your files in one place" back={false} />
      <div className="px-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search documents…"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur border border-white/60 text-sm outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <Chip key={f} active={active === f} onClick={() => setActive(f)}>
              {f}
            </Chip>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((d) => (
            <Card key={d.name} className="flex items-center gap-3">
              <IconTile gradient={d.g}>
                <FileText className="w-5 h-5" />
              </IconTile>
              <button onClick={() => nav("/preview")} className="flex-1 text-left min-w-0">
                <p className="font-semibold text-sm truncate">{d.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md gradient-primary text-white">{d.type}</span>
                  <span className="text-xs text-muted-foreground">{d.date}</span>
                </div>
              </button>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground btn-press">
                <MoreVertical className="w-4 h-4" />
              </button>
            </Card>
          ))}
        </div>
      </div>
    </MobileShell>
  );
};

export default Library;
