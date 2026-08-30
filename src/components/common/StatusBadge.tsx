import React from "react";
import { ApplicationStatus } from "@/types/api";
import { STATUS_CONFIG } from "@/lib/constants";

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  showDot = true,
}) => {
  const config = STATUS_CONFIG[status as ApplicationStatus] || {
    label: status,
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    darkBg: "dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    border: "border-slate-300 dark:border-zinc-700",
    dot: "bg-slate-400",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 font-medium gap-1",
    md: "text-xs px-2.5 py-1 font-semibold gap-1.5",
    lg: "text-sm px-3 py-1.5 font-semibold gap-2",
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm transition-colors ${config.bg} ${config.darkBg} ${sizeClasses[size]}`}
    >
      {showDot && (
        <span
          className={`rounded-full shrink-0 ${config.dot} ${dotSizes[size]}`}
        />
      )}
      <span className="truncate">{config.label}</span>
    </span>
  );
};
