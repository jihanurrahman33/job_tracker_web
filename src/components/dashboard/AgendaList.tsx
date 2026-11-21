import { format, isToday, isTomorrow } from "date-fns";
import { Calendar, Bell } from "lucide-react";
import { Interview, Reminder } from "@/types/api";

export interface AgendaItem {
  key: string;
  at: Date;
  title: string;
  detail: string;
  overdue: boolean;
  interview?: Interview;
  reminder?: Reminder;
}

function dayLabel(item: AgendaItem): string {
  if (item.overdue) return "Overdue";
  if (isToday(item.at)) return "Today";
  if (isTomorrow(item.at)) return "Tomorrow";
  return format(item.at, "EEEE d MMMM");
}

interface AgendaListProps {
  items: AgendaItem[];
  onOpenInterview: (i: Interview) => void;
  onOpenReminder: (r: Reminder) => void;
  onCompleteReminder: (r: Reminder) => void;
  onAdd: () => void;
}

export function AgendaList({
  items,
  onOpenInterview,
  onOpenReminder,
  onCompleteReminder,
  onAdd,
}: AgendaListProps) {
  if (items.length === 0) {
    return (
      <div className="py-6">
        <p className="text-[15px] text-pencil">
          No interviews or follow-ups scheduled.
        </p>
        <button
          onClick={onAdd}
          className="mt-3 text-[15px] font-semibold text-ink underline underline-offset-4"
        >
          Add a reminder
        </button>
      </div>
    );
  }

  const groups: { label: string; overdue: boolean; items: AgendaItem[] }[] = [];
  for (const item of items) {
    const label = dayLabel(item);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(item);
    else groups.push({ label, overdue: item.overdue, items: [item] });
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.label}>
          <h3
            className={`mb-1 text-sm font-semibold ${
              group.overdue ? "text-stamp" : "text-pencil"
            }`}
          >
            {group.label}
          </h3>
          <ul className="divide-y divide-rule border-y border-rule">
            {group.items.map((item) => (
              <li key={item.key} className="flex items-center gap-3 py-3">
                <span className="w-16 shrink-0 text-sm tabular-nums text-pencil">
                  {format(item.at, "h:mm a")}
                </span>

                {item.reminder ? (
                  <input
                    type="checkbox"
                    aria-label={`Mark "${item.title}" as done`}
                    onChange={() => onCompleteReminder(item.reminder!)}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-[#12263A]"
                  />
                ) : (
                  <Calendar className="h-4 w-4 shrink-0 text-pencil" />
                )}

                <button
                  onClick={() =>
                    item.interview
                      ? onOpenInterview(item.interview)
                      : onOpenReminder(item.reminder!)
                  }
                  className="min-w-0 flex-1 rounded text-left"
                >
                  <span className="block truncate text-[15px] font-semibold text-ink">
                    {item.title}
                  </span>
                  <span className="block truncate text-sm text-pencil">
                    {item.detail}
                  </span>
                </button>

                {item.reminder && (
                  <Bell
                    className={`h-3.5 w-3.5 shrink-0 ${
                      item.overdue ? "text-stamp" : "text-pencil/50"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
