import { useNavigate } from "react-router-dom";
import { Sparkles, Brain } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { GradientButton } from "@/components/ui-bits";

const Onboarding = () => {
  const nav = useNavigate();
  return (
    <MobileShell showNav={false}>
      <div className="flex flex-col items-center justify-between h-full px-8 pt-8 pb-12 relative">
        {/* Floating particles */}
        <Sparkles className="absolute top-20 left-10 w-5 h-5 text-pink-400 animate-floaty" />
        <Sparkles className="absolute top-32 right-12 w-4 h-4 text-purple-400 animate-floaty" style={{ animationDelay: "1s" }} />
        <Sparkles className="absolute bottom-60 left-16 w-6 h-6 text-orange-400 animate-floaty" style={{ animationDelay: "2s" }} />

        <div className="flex-1 flex items-center justify-center w-full">
          <div className="relative">
            <div className="absolute inset-0 gradient-hero rounded-full blur-3xl opacity-60 animate-pulse-glow" />
            <div className="relative w-56 h-56 rounded-full gradient-hero flex items-center justify-center animate-floaty">
              <div className="absolute inset-4 rounded-full border-2 border-white/30 animate-orbit" />
              <div className="absolute inset-8 rounded-full border border-white/20 animate-orbit-slow" />
              <Brain className="w-24 h-24 text-white" strokeWidth={1.5} />
              <Sparkles className="absolute top-4 right-6 w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="text-center space-y-4 w-full">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Document <span className="gradient-text">Generator</span>
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed px-4">
            Generate professional documents in seconds with the power of AI. Smart. Fast. Accurate.
          </p>

          <div className="flex items-center justify-center gap-2 py-2">
            <span className="w-6 h-1.5 rounded-full gradient-primary" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
            <span className="w-1.5 h-1.5 rounded-full bg-muted" />
          </div>

          <div className="space-y-3 pt-2">
            <GradientButton onClick={() => nav("/home")}>Get Started</GradientButton>
            <button
              onClick={() => nav("/templates")}
              className="w-full py-3 text-sm font-semibold text-primary"
            >
              Explore Features →
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
};

export default Onboarding;
