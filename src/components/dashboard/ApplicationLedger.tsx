import { Application, APPLICATION_STATUS_LIST, ApplicationStatus } from "@/types/api";
import { STAGE_COLOR, STATUS_CONFIG } from "@/lib/constants";
import { formatDate, formatSalary } from "@/lib/utils";

interface ApplicationLedgerProps {
  applications: Application[];
  onOpen: (a: Application) => void;
  onChangeStatus: (a: Application, status: ApplicationStatus) => void;
}

export function ApplicationLedger({
  applications,
  onOpen,
  onChangeStatus,
}: ApplicationLedgerProps) {
  return (
    <div className="border-y border-ink/25">
      <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.8fr)_6.5rem_minmax(0,1.5fr)] gap-4 border-b border-rule py-2 text-sm text-pencil md:grid">
        <span>Company and role</span>
        <span>Stage</span>
        <span>Applied</span>
        <span>Salary</span>
      </div>

      <ul className="divide-y divide-rule">
        {applications.map((app) => (
          <li
            key={app.id}
            className="grid gap-x-4 gap-y-2 py-3.5 md:grid-cols-[minmax(0,2fr)_minmax(0,1.8fr)_6.5rem_minmax(0,1.5fr)] md:items-center"
          >
            <button
              onClick={() => onOpen(app)}
              className="min-w-0 rounded text-left"
            >
              <span className="block truncate font-display text-lg leading-snug text-ink">
                {app.company}
              </span>
              <span className="block truncate text-sm text-pencil">
                {app.position}
                {app.location ? `, ${app.location}` : ""}
              </span>
            </button>

            <label className="flex items-center gap-2">
              <span className="sr-only">
                Stage for {app.company}, {app.position}
              </span>
              <span
                className="h-2.5 w-2.5 shrink-0"
                style={{ backgroundColor: STAGE_COLOR[app.status] }}
                aria-hidden="true"
              />
              <select
                value={app.status}
                onChange={(e) =>
                  onChangeStatus(app, e.target.value as ApplicationStatus)
                }
                className="w-full cursor-pointer rounded border border-transparent bg-transparent py-1 pl-0 pr-2 text-[15px] text-ink hover:border-rule focus:border-ink"
              >
                {APPLICATION_STATUS_LIST.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </label>

            <span className="text-sm tabular-nums text-pencil">
              {formatDate(app.applied_at || app.created_at, "d MMM yyyy")}
            </span>

            <span className="truncate text-sm text-pencil">
              {formatSalary(app.salary_min, app.salary_max, app.salary_currency || "USD")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
