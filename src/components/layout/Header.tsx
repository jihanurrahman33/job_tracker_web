"use client";

import React, { useState } from "react";
import { Menu, Plus, Briefcase, Calendar, Bell, ChevronDown } from "lucide-react";
import { ApplicationFormModal } from "../applications/ApplicationFormModal";
import { ReminderFormModal } from "../reminders/ReminderFormModal";
import { InterviewFormModal } from "../interviews/InterviewFormModal";

interface HeaderProps {
  onOpenSidebar: () => void;
  title?: string;
  onRefreshData?: () => void;
}

const ACTIONS = [
  { key: "application", label: "Application", hint: "A job you applied for", icon: Briefcase },
  { key: "interview", label: "Interview", hint: "A round with a time and place", icon: Calendar },
  { key: "reminder", label: "Reminder", hint: "A follow-up to send", icon: Bell },
] as const;

type ActionKey = (typeof ACTIONS)[number]["key"];

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  title,
  onRefreshData,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [open, setOpen] = useState<ActionKey | null>(null);

  const close = () => setOpen(null);
  const done = () => onRefreshData?.();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-rule bg-paper px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            aria-label="Open menu"
            className="rounded-md p-2 text-pencil hover:bg-white hover:text-ink lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl text-ink sm:text-2xl">
            {title || "Dashboard"}
          </h1>
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="inline-flex items-center gap-2 rounded-md bg-ink px-3.5 py-2 text-sm font-semibold text-paper hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-70" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div
                role="menu"
                className="absolute right-0 z-50 mt-2 w-64 border border-ink/15 bg-white py-1 shadow-lg"
              >
                {ACTIONS.map(({ key, label, hint, icon: Icon }) => (
                  <button
                    key={key}
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      setOpen(key);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-paper"
                  >
                    <Icon className="h-4 w-4 text-pencil" />
                    <span>
                      <span className="block text-sm font-semibold text-ink">
                        {label}
                      </span>
                      <span className="block text-xs text-pencil">{hint}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      <ApplicationFormModal
        isOpen={open === "application"}
        onClose={close}
        onSuccess={done}
      />
      <InterviewFormModal
        isOpen={open === "interview"}
        onClose={close}
        onSuccess={done}
      />
      <ReminderFormModal
        isOpen={open === "reminder"}
        onClose={close}
        onSuccess={done}
      />
    </>
  );
};
