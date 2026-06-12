import { ReactNode } from "react";
import { StatusBar } from "./StatusBar";
import { BottomNav } from "./BottomNav";

interface Props {
  children: ReactNode;
  showNav?: boolean;
  statusDark?: boolean;
}

export const MobileShell = ({ children, showNav = true, statusDark = false }: Props) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center md:p-8 relative overflow-hidden">
      {/* Decorative blobs for desktop showcase */}
      <div className="hidden md:block absolute inset-0 pointer-events-none">
        <div className="blob w-[500px] h-[500px] gradient-candy -top-32 -left-32" />
        <div className="blob w-[400px] h-[400px] gradient-sunset top-1/2 -right-20" />
        <div className="blob w-[450px] h-[450px] gradient-ocean -bottom-32 left-1/3" />
      </div>

      <div className="relative w-full md:max-w-[420px] md:h-[860px] md:rounded-[3rem] md:border md:border-white/60 md:shadow-2xl bg-white/40 backdrop-blur-2xl overflow-hidden flex flex-col min-h-screen md:min-h-0">
        <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-canvas)" }} />
        {/* Inner decorative blobs */}
        <div className="blob w-72 h-72 gradient-candy -top-20 -right-20" />
        <div className="blob w-64 h-64 gradient-sunset -bottom-20 -left-20 opacity-30" />

        <StatusBar dark={statusDark} />
        <div className="flex-1 overflow-y-auto no-scrollbar page-enter pb-28">
          {children}
        </div>
        {showNav && <BottomNav />}
      </div>
    </div>
  );
};
