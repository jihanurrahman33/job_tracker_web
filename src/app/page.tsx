import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroPipeline } from "@/components/landing/HeroPipeline";
import { Wordmark } from "@/components/landing/Wordmark";

const KEPT = [
  {
    title: "Applications",
    body: "Company, role, salary range, the link to the posting and your own notes. When something changes, move the stage and the history is kept.",
    sample: "Brightloom, Web Developer. Applied 16 days ago, now at Interview.",
  },
  {
    title: "Interviews",
    body: "Add each round with its type, time, length and meeting link. The dashboard puts the next one at the top of your list.",
    sample: "Thursday 3:00 pm, System design, 60 minutes, video call.",
  },
  {
    title: "Reminders",
    body: "Attach a follow-up to a job and tick it off once you have sent the email. Anything overdue is marked so you see it first.",
    sample: "Email Kestrel Health about the screening call. Due Friday.",
  },
];

const FUNNEL = [
  { label: "Applications sent", count: 24 },
  { label: "Heard back", count: 9 },
  { label: "Reached an interview", count: 5 },
  { label: "Offers", count: 1 },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="ledger">
        <LandingNav />

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1fr_30rem] lg:gap-16 lg:pt-16">
          <div>
            <h1 className="max-w-[15ch] font-display text-[2.75rem] leading-[1.04] sm:text-6xl lg:text-[4.25rem]">
              Keep every application where you can see it.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-pencil">
              A job search runs for weeks, across a dozen inboxes and
              half-remembered tabs. JobTracker holds the applications,
              interview times and follow-ups in one list, so nothing slips
              while you wait to hear back.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/register"
                className="rounded-md bg-ink px-6 py-3 text-base font-semibold text-paper hover:bg-indigo-700"
              >
                Create an account
              </Link>
              <Link
                href="/login"
                className="text-base font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
              >
                Sign in
              </Link>
            </div>
          </div>

          <div className="lg:pt-2">
            <HeroPipeline />
            <p className="mt-3 text-sm text-pencil">
              Click a row to move it to the next stage. In the app, this is
              one tap on the stage menu.
            </p>
          </div>
        </section>
      </div>

      {/* What it keeps */}
      <section
        id="what-it-keeps"
        className="border-t border-ink/15 bg-white"
      >
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[22rem_1fr] lg:gap-20">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:sticky lg:top-10 lg:self-start">
            Everything about a job stays attached to that job.
          </h2>

          <div>
            {KEPT.map((item, i) => (
              <article
                key={item.title}
                className={`py-8 ${i === 0 ? "pt-0" : "border-t border-ink/15"}`}
              >
                <h3 className="font-display text-2xl">{item.title}</h3>
                <p className="mt-3 max-w-[36rem] text-[17px] leading-relaxed text-pencil">
                  {item.body}
                </p>
                <p className="mt-4 max-w-[36rem] border-l-[3px] border-marker pl-4 text-[15px] text-ink">
                  {item.sample}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section id="numbers" className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">
              Find out where your search is stalling.
            </h2>
            <p className="mt-5 max-w-[32rem] text-[17px] leading-relaxed text-paper/75">
              Response, interview and offer rates are worked out from the
              stages you set. If few applications get a reply, the problem is
              the CV. If replies never turn into interviews, it is the first
              call. The counts tell you which one to fix.
            </p>
          </div>

          <div>
            <ul className="space-y-4">
              {FUNNEL.map((row) => (
                <li key={row.label}>
                  <div className="mb-1.5 flex items-baseline justify-between text-[15px]">
                    <span>{row.label}</span>
                    <span className="font-display text-xl">{row.count}</span>
                  </div>
                  <div className="h-2 bg-paper/15">
                    <div
                      className="h-2 bg-marker"
                      style={{ width: `${(row.count / FUNNEL[0].count) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-paper/60">
              Sample numbers. Yours come from your own applications.
            </p>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-8 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[18ch] font-display text-3xl leading-tight sm:text-5xl">
            Start with the next application you send.
          </h2>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/register"
              className="rounded-md bg-ink px-6 py-3 text-base font-semibold text-paper hover:bg-indigo-700"
            >
              Create an account
            </Link>
            <Link
              href="/login"
              className="text-base font-medium underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-ink/15">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-sm text-pencil sm:px-8">
          <Wordmark className="text-ink !text-base" />
          <span>Made for people between jobs.</span>
        </div>
      </footer>
    </div>
  );
}
