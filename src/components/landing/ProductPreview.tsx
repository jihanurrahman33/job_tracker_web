import { PipelineRuler } from "@/components/dashboard/PipelineRuler";

const BY_STATUS = {
  APPLIED: 3,
  SCREENING: 2,
  INTERVIEW: 2,
  TECHNICAL_INTERVIEW: 1,
  OFFER: 1,
  REJECTED: 2,
  WITHDRAWN: 1,
};

const FIGURES = [
  { value: "12", label: "Applications" },
  { value: "75%", label: "Heard back" },
  { value: "33%", label: "Reached interview" },
  { value: "8%", label: "Offers" },
];

/** A static picture of the dashboard, drawn from the same components. */
export function ProductPreview() {
  return (
    <div className="border border-ink/20 bg-paper">
      <div className="flex items-baseline justify-between border-b border-ink/15 bg-white px-5 py-3 text-sm">
        <span className="font-display text-lg text-ink">Dashboard</span>
        <span className="text-pencil">Sample data</span>
      </div>

      <div className="space-y-7 p-5 sm:p-7">
        <dl className="grid grid-cols-2 gap-y-5 sm:grid-cols-4 sm:divide-x sm:divide-rule">
          {FIGURES.map((f, i) => (
            <div key={f.label} className={i > 0 ? "sm:pl-5" : ""}>
              <dd className="font-display text-3xl leading-none text-ink">{f.value}</dd>
              <dt className="mt-1.5 text-sm text-pencil">{f.label}</dt>
            </div>
          ))}
        </dl>

        <PipelineRuler byStatus={BY_STATUS} total={12} />

        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 font-display text-lg text-ink">Coming up</h3>
            <ul className="divide-y divide-rule border-y border-rule text-sm">
              <li className="py-2.5">
                <span className="text-stamp">Overdue</span>
                <span className="block font-semibold text-ink">Email Kestrel Health</span>
                <span className="text-pencil">Ask about the screening call</span>
              </li>
              <li className="py-2.5">
                <span className="text-pencil">Tomorrow, 3:00 pm</span>
                <span className="block font-semibold text-ink">System design with Paperplane</span>
                <span className="text-pencil">Full-stack Developer, 90 min</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-display text-lg text-ink">Worth a follow-up</h3>
            <ul className="divide-y divide-rule border-y border-rule text-sm">
              <li className="flex items-baseline justify-between gap-3 py-2.5">
                <span>
                  <span className="block font-semibold text-ink">Lumen Works</span>
                  <span className="text-pencil">Frontend Developer</span>
                </span>
                <span className="bg-marker/70 px-1.5 font-semibold text-ink">11 days</span>
              </li>
              <li className="flex items-baseline justify-between gap-3 py-2.5">
                <span>
                  <span className="block font-semibold text-ink">Kestrel Health</span>
                  <span className="text-pencil">React Engineer</span>
                </span>
                <span className="bg-marker/70 px-1.5 font-semibold text-ink">9 days</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
