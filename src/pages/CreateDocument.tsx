import { useState } from "react";
import { Mic, FileText, FileBarChart, Briefcase, ClipboardList } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, GradientButton, Chip, IconTile } from "@/components/ui-bits";
import { getDoc, setDoc } from "@/lib/docStore";

const suggestions = ["Business Proposal", "Project Report", "Resume", "Marketing Plan", "Invoice"];
const templates = [
  { name: "Report", icon: FileBarChart, g: "primary" as const },
  { name: "Proposal", icon: FileText, g: "sunset" as const },
  { name: "Business Plan", icon: Briefcase, g: "ocean" as const },
  { name: "Project Plan", icon: ClipboardList, g: "mint" as const },
];

const CreateDocument = () => {
  const nav = useNavigate();
  const [prompt, setPrompt] = useState("");

  const start = (templateName?: string) => {
    const cur = getDoc();
    if (templateName) {
      setDoc({ title: `${templateName} — ${cur.client}` });
    }
    if (prompt.trim()) {
      setDoc({ subtitle: prompt.slice(0, 140) });
    }
    nav("/settings");
  };

  return (
    <MobileShell>
      <PageHeader title="Create Document" subtitle="Describe what you want to build" />
      <div className="px-6 space-y-5">
        <div className="glass-card p-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value.slice(0, 2000))}
            placeholder="Write a detailed prompt for your document…"
            className="w-full h-36 resize-none bg-transparent outline-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <button className="w-9 h-9 rounded-xl gradient-primary text-white flex items-center justify-center btn-press">
              <Mic className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground font-medium">{prompt.length}/2000</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-2">SUGGESTIONS</p>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {suggestions.map((s) => (
              <Chip key={s} onClick={() => setPrompt(`Write a ${s.toLowerCase()} about…`)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold mb-3">AI Templates</p>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((t) => (
              <button
                key={t.name}
                onClick={() => start(t.name)}
                className="glass-card p-4 text-left btn-press hover:scale-[1.02] transition-transform"
              >
                <IconTile gradient={t.g}>
                  <t.icon className="w-5 h-5" />
                </IconTile>
                <p className="mt-3 text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">Starter template</p>
              </button>
            ))}
          </div>
        </div>

        <GradientButton onClick={() => start()}>Generate Document</GradientButton>
      </div>
    </MobileShell>
  );
};

export default CreateDocument;
