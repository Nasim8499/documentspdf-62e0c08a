import { Home, FolderOpen, MessageCircle, User, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const tabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/library", icon: FolderOpen, label: "Library" },
  { to: "/chat", icon: MessageCircle, label: "Chat" },
  { to: "/profile", icon: User, label: "Profile" },
];

export const BottomNav = () => {
  const nav = useNavigate();
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-5 pointer-events-none">
      <div className="relative pointer-events-auto">
        <div className="glass-card flex items-center justify-around py-3 px-2 shadow-lg">
          {tabs.slice(0, 2).map((t) => (
            <NavTab key={t.to} {...t} />
          ))}
          <div className="w-14" />
          {tabs.slice(2).map((t) => (
            <NavTab key={t.to} {...t} />
          ))}
        </div>
        <button
          onClick={() => nav("/create")}
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-14 h-14 rounded-2xl gradient-primary text-white flex items-center justify-center btn-press"
          style={{ boxShadow: "var(--shadow-button)" }}
          aria-label="Create"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

const NavTab = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
        isActive ? "text-primary" : "text-muted-foreground"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
        <span className="text-[10px] font-medium">{label}</span>
      </>
    )}
  </NavLink>
);
