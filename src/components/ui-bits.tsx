import { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PageHeader = ({
  title,
  subtitle,
  right,
  back = true,
}: {
  title: string;
  subtitle?: ReactNode;
  right?: ReactNode;
  back?: boolean;
}) => {
  const nav = useNavigate();
  return (
    <div className="px-6 pt-2 pb-4 flex items-center gap-3 relative z-10">
      {back && (
        <button
          onClick={() => nav(-1)}
          className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center btn-press border border-white/60"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
};

export const GradientButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "sunset" | "ocean" | "mint";
  className?: string;
  type?: "button" | "submit";
}) => (
  <button
    type={type}
    onClick={onClick}
    className={`w-full py-4 rounded-2xl text-white font-semibold btn-press gradient-${variant} ${className}`}
    style={{ boxShadow: "var(--shadow-button)" }}
  >
    {children}
  </button>
);

export const IconTile = ({
  children,
  gradient = "primary",
  size = "md",
}: {
  children: ReactNode;
  gradient?: "primary" | "sunset" | "ocean" | "candy" | "mint";
  size?: "sm" | "md" | "lg";
}) => {
  const sizes = { sm: "w-9 h-9", md: "w-11 h-11", lg: "w-14 h-14" };
  return (
    <div className={`${sizes[size]} rounded-2xl gradient-${gradient} flex items-center justify-center text-white shrink-0 shadow-md`}>
      {children}
    </div>
  );
};

export const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`glass-card p-4 ${className}`}>{children}</div>
);

export const Chip = ({
  children,
  active = false,
  onClick,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap btn-press transition-all ${
      active
        ? "gradient-primary text-white shadow-md"
        : "bg-white/80 text-foreground border border-white/60"
    }`}
  >
    {children}
  </button>
);

export const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!on)}
    className={`w-12 h-7 rounded-full p-0.5 transition-all ${on ? "gradient-primary" : "bg-muted"}`}
  >
    <div
      className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`}
    />
  </button>
);
