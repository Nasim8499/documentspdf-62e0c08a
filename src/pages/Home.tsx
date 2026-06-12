import { Bell, Search, FileText, MessageCircle, MapPin, LayoutGrid, Sparkles, Bot, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MobileShell } from "@/components/MobileShell";
import { Card, IconTile } from "@/components/ui-bits";

const quick = [
  { to: "/create", icon: FileText, label: "Create Document", g: "primary" as const },
  { to: "/chat", icon: MessageCircle, label: "AI Chat Assistant", g: "sunset" as const },
  { to: "/itinerary", icon: MapPin, label: "Smart Itinerary", g: "mint" as const },
  { to: "/templates", icon: LayoutGrid, label: "Templates Library", g: "candy" as const },
];

const recent = [
  { name: "Business Proposal", type: "PDF", date: "2h ago", g: "primary" as const },
  { name: "Marketing Strategy", type: "DOCX", date: "Yesterday", g: "sunset" as const },
  { name: "Project Report", type: "PDF", date: "3 days ago", g: "ocean" as const },
];

const Home = () => {
  const nav = useNavigate();
  return (
    <MobileShell>
      <div className="px-6 space-y-5">
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full gradient-sunset flex items-center justify-center text-white font-bold">
              JW
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Good Morning,</p>
              <p className="font-semibold text-sm">Jenny Wilson</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur border border-white/60 flex items-center justify-center btn-press relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500" />
          </button>
        </div>

        {/* AI Assistant hero card */}
        <button
          onClick={() => nav("/chat")}
          className="w-full text-left rounded-3xl p-5 relative overflow-hidden gradient-hero text-white btn-press"
          style={{ boxShadow: "var(--shadow-glow)" }}
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <Sparkles className="absolute top-3 right-3 w-5 h-5 opacity-70" />
          <div className="flex items-start gap-3 relative">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Bot className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg leading-tight">Meet your AI Assistant</p>
              <p className="text-xs text-white/80 mt-1">Generate, edit and chat about any document</p>
            </div>
            <ArrowRight className="w-5 h-5 mt-3" />
          </div>
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search documents or templates…"
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 backdrop-blur border border-white/60 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Quick actions */}
        <div>
          <p className="text-sm font-bold mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-3">
            {quick.map((q) => (
              <button
                key={q.to}
                onClick={() => nav(q.to)}
                className="glass-card p-4 text-left btn-press hover:scale-[1.02] transition-transform"
              >
                <IconTile gradient={q.g}>
                  <q.icon className="w-5 h-5" />
                </IconTile>
                <p className="mt-3 text-sm font-semibold leading-snug">{q.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold">Recent Documents</p>
            <button onClick={() => nav("/library")} className="text-xs font-semibold text-primary">
              See all
            </button>
          </div>
          <div className="space-y-2">
            {recent.map((r) => (
              <Card key={r.name} className="flex items-center gap-3">
                <IconTile gradient={r.g}>
                  <FileText className="w-5 h-5" />
                </IconTile>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.type} · {r.date}</p>
                </div>
                <button onClick={() => nav("/preview")} className="text-xs font-semibold text-primary">Open</button>
              </Card>
            ))}
          </div>
        </div>

        <button
          onClick={() => nav("/analytics")}
          className="w-full glass-card p-4 flex items-center justify-between btn-press"
        >
          <span className="text-sm font-semibold">View Analytics</span>
          <ArrowRight className="w-4 h-4 text-primary" />
        </button>
      </div>
    </MobileShell>
  );
};

export default Home;
