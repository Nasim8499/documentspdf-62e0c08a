import { useEffect, useState } from "react";
import { Bot, Check, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const steps = [
  "Analyzing prompt",
  "Researching content",
  "Structuring document",
  "Finalizing",
];

const Generating = () => {
  const nav = useNavigate();
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => (p >= 100 ? 100 : p + 2));
    }, 80);
    return () => clearInterval(t);
  }, []);

  const currentStep = Math.min(steps.length - 1, Math.floor(progress / 25));

  return (
    <div className="min-h-screen w-full flex items-center justify-center md:p-8 relative overflow-hidden" style={{ background: "var(--gradient-dark)" }}>
      <div className="relative w-full md:max-w-[420px] md:h-[860px] md:rounded-[3rem] overflow-hidden flex flex-col min-h-screen md:min-h-0 text-white" style={{ background: "var(--gradient-dark)" }}>
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-pink-500/30 blur-3xl" />
        <Sparkles className="absolute top-20 right-12 w-5 h-5 text-pink-300 animate-floaty" />
        <Sparkles className="absolute bottom-40 left-12 w-4 h-4 text-purple-300 animate-floaty" style={{ animationDelay: "1s" }} />

        <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
          <div className="relative w-56 h-56 flex items-center justify-center mb-8">
            <div className="absolute inset-0 rounded-full border border-white/20 animate-orbit-slow" />
            <div className="absolute inset-6 rounded-full border border-white/15 animate-orbit" />
            <div className="absolute inset-0 rounded-full gradient-hero blur-3xl opacity-50 animate-pulse-glow" />
            <div className="relative w-32 h-32 rounded-full gradient-hero flex items-center justify-center animate-floaty">
              <Bot className="w-16 h-16 text-white" strokeWidth={1.5} />
            </div>
            <Sparkles className="absolute -top-2 right-6 w-6 h-6 text-pink-300 animate-floaty" />
          </div>

          <h2 className="text-2xl font-bold text-center">AI is crafting your document…</h2>
          <p className="text-white/60 text-sm text-center mt-2">Hang tight, magic is happening</p>

          <div className="w-full mt-8">
            <div className="flex justify-between text-xs text-white/70 mb-2">
              <span>Progress</span>
              <span className="font-bold">{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full shimmer-bg rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="w-full mt-8 space-y-3">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3 bg-white/5 backdrop-blur rounded-2xl px-4 py-3 border border-white/10">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center ${i < currentStep ? "gradient-mint" : i === currentStep ? "gradient-primary" : "bg-white/10"}`}>
                  {i < currentStep ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                </div>
                <span className={`text-sm ${i <= currentStep ? "font-semibold" : "text-white/50"}`}>{s}</span>
              </div>
            ))}
          </div>

          {progress >= 100 && (
            <button
              onClick={() => nav("/preview")}
              className="mt-8 w-full py-4 rounded-2xl gradient-primary text-white font-semibold btn-press"
              style={{ boxShadow: "var(--shadow-button)" }}
            >
              Preview Document →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generating;
