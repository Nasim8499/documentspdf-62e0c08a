import { useEffect, useRef, useState } from "react";
import { Mic, Send, Bot, FileText, Sparkles, Paperclip, X } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, Chip } from "@/components/ui-bits";
import { toast } from "sonner";

interface Msg { role: "ai" | "user"; text: string; attachment?: string }

const seed: Msg[] = [
  { role: "ai", text: "Hi! I'm your AI Document Assistant. Upload reference PDFs (work permits, contracts, company profiles) and I'll learn the style for your next document." },
  { role: "ai", text: "Tap the 📎 Knowledge button to add a reference file, or jump to Company Details / Work Permit builders to generate a polished 10-page PDF." },
];

const quick = ["Summarize", "Improve", "Expand", "Generate Work Permit", "Build Company Profile"];

const STORAGE_KEY = "ai-doc-knowledge-files";

const Chat = () => {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [knowledge, setKnowledge] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setKnowledge(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(knowledge)); } catch {}
  }, [knowledge]);

  const send = () => {
    if (!input.trim()) return;
    const text = input;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      const refNote = knowledge.length
        ? ` I'll use your ${knowledge.length} reference file${knowledge.length > 1 ? "s" : ""} as style guides.`
        : "";
      setMsgs((m) => [...m, { role: "ai", text: `On it — drafting "${text.slice(0, 60)}".${refNote} Tap a builder to finalize the 10-page PDF.` }]);
    }, 500);
  };

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    setKnowledge((prev) => Array.from(new Set([...prev, ...names])));
    setMsgs((m) => [
      ...m,
      { role: "user", text: `Uploaded ${names.length} reference file${names.length > 1 ? "s" : ""}` },
      { role: "ai", text: `Added to knowledge base ✅ I'll mirror the layout & wording of these references when generating new documents.`, attachment: names[0] },
    ]);
    toast.success("Knowledge updated");
  };

  const removeKnow = (name: string) =>
    setKnowledge((prev) => prev.filter((n) => n !== name));

  return (
    <MobileShell>
      <PageHeader
        title="AI Assistant"
        subtitle={<>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />Online · Knowledge: {knowledge.length}
        </> as any}
        back={false}
        right={
          <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
        }
      />

      <div className="px-6 space-y-3 pb-40">
        {/* Knowledge chips */}
        {knowledge.length > 0 && (
          <div className="glass-card p-3">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Knowledge Base ({knowledge.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {knowledge.map((k) => (
                <span key={k} className="inline-flex items-center gap-1.5 bg-white border border-border rounded-full pl-2.5 pr-1 py-1 text-[11px] font-medium max-w-[200px]">
                  <FileText className="w-3 h-3 text-primary shrink-0" />
                  <span className="truncate">{k}</span>
                  <button
                    onClick={() => removeKnow(k)}
                    className="w-4 h-4 rounded-full bg-muted hover:bg-pink-100 flex items-center justify-center shrink-0"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${m.role === "user" ? "gradient-primary text-white" : "bg-white border border-white/60"} rounded-2xl px-4 py-3 text-sm shadow-sm`}>
              <p className="leading-relaxed">{m.text}</p>
              {m.attachment && (
                <div className="mt-2 flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl p-2">
                  <div className="w-9 h-9 rounded-lg gradient-sunset flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs min-w-0">
                    <p className="font-semibold truncate">{m.attachment}</p>
                    <p className="opacity-70">Reference · learned</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
          {quick.map((q) => (
            <Chip key={q} onClick={() => setInput(q)}>
              <Sparkles className="w-3 h-3 inline mr-1" />{q}
            </Chip>
          ))}
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.html"
        className="hidden"
        onChange={(e) => onPickFiles(e.target.files)}
      />

      <div className="fixed md:absolute bottom-24 left-0 right-0 px-4 z-20 pointer-events-none">
        <div className="md:max-w-[420px] mx-auto pointer-events-auto">
          <div className="glass-card flex items-center gap-2 p-2">
            <button
              onClick={() => fileRef.current?.click()}
              title="Add knowledge file"
              className="w-10 h-10 rounded-xl gradient-ocean text-white flex items-center justify-center btn-press"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <button className="w-10 h-10 rounded-xl gradient-sunset text-white flex items-center justify-center btn-press">
              <Mic className="w-4 h-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything…"
              className="flex-1 bg-transparent outline-none text-sm px-2 min-w-0"
            />
            <button onClick={send} className="w-10 h-10 rounded-xl gradient-primary text-white flex items-center justify-center btn-press">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
};

export default Chat;
