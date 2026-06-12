import { useState } from "react";
import { Mic, Send, Bot, FileText, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { PageHeader, Chip } from "@/components/ui-bits";

interface Msg { role: "ai" | "user"; text: string; attachment?: string }

const seed: Msg[] = [
  { role: "ai", text: "Hi Jenny! I'm your AI Assistant. What document would you like to create today?" },
  { role: "user", text: "Draft a marketing proposal for a wellness startup." },
  { role: "ai", text: "Done! I've drafted a 6-page marketing proposal with charts and a brand-aligned palette.", attachment: "Wellness Marketing Proposal.pdf" },
];

const quick = ["Summarize", "Improve", "Expand", "Quick Commands", "Prompt History"];

const Chat = () => {
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMsgs([...msgs, { role: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: "Great — I'll get on that right away. ✨" }]);
    }, 600);
  };

  return (
    <MobileShell>
      <PageHeader
        title="AI Assistant"
        subtitle={<>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5" />Online · GPT-4o
        </> as any}
        back={false}
        right={
          <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white">
            <Bot className="w-5 h-5" />
          </div>
        }
      />

      <div className="px-6 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${m.role === "user" ? "gradient-primary text-white" : "bg-white border border-white/60"} rounded-2xl px-4 py-3 text-sm shadow-sm`}>
              <p className="leading-relaxed">{m.text}</p>
              {m.attachment && (
                <div className="mt-2 flex items-center gap-2 bg-white/20 backdrop-blur rounded-xl p-2">
                  <div className="w-9 h-9 rounded-lg gradient-sunset flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold">{m.attachment}</p>
                    <p className="opacity-70">PDF · 6 pages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="flex gap-2 overflow-x-auto no-scrollbar pt-2">
          {quick.map((q) => (
            <Chip key={q} onClick={() => setInput(q + " this document")}>
              <Sparkles className="w-3 h-3 inline mr-1" />{q}
            </Chip>
          ))}
        </div>
      </div>

      <div className="fixed md:absolute bottom-24 left-0 right-0 px-4 z-20 pointer-events-none">
        <div className="md:max-w-[420px] mx-auto pointer-events-auto">
          <div className="glass-card flex items-center gap-2 p-2">
            <button className="w-10 h-10 rounded-xl gradient-sunset text-white flex items-center justify-center btn-press">
              <Mic className="w-4 h-4" />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask anything…"
              className="flex-1 bg-transparent outline-none text-sm px-2"
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
