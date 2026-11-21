import Link from "next/link";
import { APPLICATION_STATUS_LIST } from "@/types/api";
import { STAGE_COLOR, STATUS_CONFIG } from "@/lib/constants";

interface PipelineRulerProps {
  byStatus: Record<string, number>;
  total: number;
}

export function PipelineRuler({ byStatus, total }: PipelineRulerProps) {
  const counted = APPLICATION_STATUS_LIST.map((status) => ({
    status,
    count: byStatus[status] ?? 0,
  }));
  const sum = counted.reduce((n, s) => n + s.count, 0) || total;

  if (sum === 0) {
    return (
      <p className="text-[15px] text-pencil">
        Nothing in the pipeline yet. Add an application and it shows up here,
        stage by stage.
      </p>
    );
  }

  return (
    <div>
      <div
        className="flex h-3 w-full overflow-hidden bg-rule"
        role="img"
        aria-label={counted
          .filter((s) => s.count > 0)
          .map((s) => `${STATUS_CONFIG[s.status].label}: ${s.count}`)
          .join(", ")}
      >
        {counted
          .filter((s) => s.count > 0)
          .map((s) => (
            <span
              key={s.status}
              style={{
                width: `${(s.count / sum) * 100}%`,
                backgroundColor: STAGE_COLOR[s.status],
              }}
              className="border-r-2 border-white last:border-r-0"
            />
          ))}
      </div>

      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
        {counted.map((s) => (
          <li key={s.status}>
            <Link
              href="/applications"
              className={`group flex items-baseline gap-2 rounded ${
                s.count === 0 ? "opacity-45" : ""
              }`}
            >
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 self-start"
                style={{ backgroundColor: STAGE_COLOR[s.status] }}
              />
              <span className="font-display text-2xl leading-none text-ink">
                {s.count}
              </span>
              <span className="text-sm text-pencil group-hover:text-ink">
                {STATUS_CONFIG[s.status].label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
