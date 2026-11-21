import { format, parseISO } from "date-fns";
import { DayCount } from "@/types/api";

interface BarChartProps {
  data: DayCount[];
  title: string;
  /** Singular noun for the screen-reader summary, e.g. "sign-up". */
  noun: string;
  barClass?: string;
}

/** A plain bar-per-day chart. No chart library needed for 14 numbers. */
export function BarChart({ data, title, noun, barClass = "bg-ink" }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((n, d) => n + d.count, 0);

  return (
    <figure>
      <figcaption className="mb-3 flex items-baseline justify-between">
        <span className="font-display text-xl text-ink">{title}</span>
        <span className="text-sm text-pencil">{total} in 14 days</span>
      </figcaption>

      <div
        role="img"
        aria-label={`${title}: ${total} ${noun}${total === 1 ? "" : "s"} over the last 14 days. ${data
          .map((d) => `${format(parseISO(d.day), "d MMM")}: ${d.count}`)
          .join(", ")}`}
        className="flex h-32 items-end gap-1 border-b border-ink/25"
      >
        {data.map((d) => (
          <div
            key={d.day}
            title={`${format(parseISO(d.day), "d MMM")}: ${d.count}`}
            className="flex h-full flex-1 items-end"
          >
            <div
              className={`w-full ${d.count === 0 ? "bg-rule" : barClass}`}
              style={{ height: d.count === 0 ? "2px" : `${Math.max(6, (d.count / max) * 100)}%` }}
            />
          </div>
        ))}
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-pencil" aria-hidden="true">
        <span>{data.length > 0 ? format(parseISO(data[0].day), "d MMM") : ""}</span>
        <span>Today</span>
      </div>
    </figure>
  );
}
