import React from "react";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "indigo" | "emerald" | "purple" | "amber" | "cyan" | "rose";
  ratePercent?: number;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "indigo",
  ratePercent,
}) => {
  const colorStyles = {
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
      border: "hover:border-indigo-300 dark:hover:border-indigo-800",
      bar: "bg-indigo-600",
    },
    emerald: {
      bg: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-800",
      bar: "bg-emerald-500",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
      border: "hover:border-purple-300 dark:hover:border-purple-800",
      bar: "bg-purple-600",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
      border: "hover:border-amber-300 dark:hover:border-amber-800",
      bar: "bg-amber-500",
    },
    cyan: {
      bg: "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400",
      border: "hover:border-cyan-300 dark:hover:border-cyan-800",
      bar: "bg-cyan-500",
    },
    rose: {
      bg: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400",
      border: "hover:border-rose-300 dark:hover:border-rose-800",
      bar: "bg-rose-500",
    },
  };

  const style = colorStyles[color];

  return (
    <div
      className={`bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800 p-5 shadow-xs transition-all ${style.border}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center ${style.bg}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
          {value}
        </span>
      </div>

      {ratePercent !== undefined && (
        <div className="mt-3">
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
              style={{
                width: `${Math.min(100, Math.max(0, ratePercent * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {subtitle && (
        <p className="text-xs text-slate-500 dark:text-zinc-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};
