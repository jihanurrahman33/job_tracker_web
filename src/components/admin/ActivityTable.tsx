import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { ActivityItem } from "@/types/api";
import { actionLabel, isConcerning } from "@/lib/activity";

interface ActivityTableProps {
  items: ActivityItem[];
  /** Compact mode drops the IP and timing columns, for the overview. */
  compact?: boolean;
}

export function ActivityTable({ items, compact = false }: ActivityTableProps) {
  if (items.length === 0) {
    return (
      <p className="border-y border-rule py-6 text-[15px] text-pencil">
        Nothing recorded for this view yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto border-y border-ink/25">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead className="text-pencil">
          <tr className="border-b border-rule">
            <th className="py-2 pr-4 font-normal">When</th>
            <th className="py-2 pr-4 font-normal">What happened</th>
            <th className="py-2 pr-4 font-normal">Who</th>
            <th className="py-2 pr-4 font-normal">Request</th>
            {!compact && <th className="py-2 pr-4 font-normal">Address</th>}
            {!compact && <th className="py-2 text-right font-normal">Time</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {items.map((e) => {
            const concerning = isConcerning(e.action, e.status);
            const when = new Date(e.created_at);
            return (
              <tr key={e.id} className="align-top">
                <td className="whitespace-nowrap py-2.5 pr-4 text-pencil" title={format(when, "d MMM yyyy, HH:mm:ss")}>
                  {formatDistanceToNow(when, { addSuffix: true })}
                </td>
                <td className={`py-2.5 pr-4 font-semibold ${concerning ? "text-stamp" : "text-ink"}`}>
                  {actionLabel(e.action)}
                </td>
                <td className="max-w-[14rem] py-2.5 pr-4">
                  {e.user_id ? (
                    <Link
                      href={`/admin/activity?user_id=${e.user_id}`}
                      className="block truncate text-ink underline-offset-4 hover:underline"
                      title={e.user_email}
                    >
                      {e.user_name || e.user_email}
                    </Link>
                  ) : (
                    <span className="text-pencil">Not signed in</span>
                  )}
                </td>
                <td className="py-2.5 pr-4 text-pencil">
                  <span className="text-ink">{e.method}</span>{" "}
                  <span className="break-all">{e.path}</span>{" "}
                  <span
                    className={
                      e.status >= 500 ? "font-semibold text-stamp" : e.status >= 400 ? "text-stamp" : "text-offer"
                    }
                  >
                    {e.status}
                  </span>
                </td>
                {!compact && <td className="whitespace-nowrap py-2.5 pr-4 tabular-nums text-pencil">{e.ip || "unknown"}</td>}
                {!compact && (
                  <td className="whitespace-nowrap py-2.5 text-right tabular-nums text-pencil">{e.duration_ms} ms</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
