import React from "react";
import { InterviewType } from "@/types/api";
import { INTERVIEW_TYPE_CONFIG } from "@/lib/constants";

interface InterviewBadgeProps {
  type: InterviewType | string;
  size?: "sm" | "md";
}

export const InterviewBadge: React.FC<InterviewBadgeProps> = ({
  type,
  size = "md",
}) => {
  const config = INTERVIEW_TYPE_CONFIG[type as InterviewType] || {
    label: type,
    bg: "bg-zinc-100 text-zinc-700 border-zinc-200",
    darkBg: "dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
    border: "border-zinc-300 dark:border-zinc-700",
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border shadow-xs transition-colors ${config.bg} ${config.darkBg} ${sizeClasses[size]}`}
    >
      {config.label}
    </span>
  );
};
