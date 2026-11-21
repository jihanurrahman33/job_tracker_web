import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroPipeline } from "@/components/landing/HeroPipeline";
import { ProductPreview } from "@/components/landing/ProductPreview";
import { Wordmark } from "@/components/landing/Wordmark";
import { LandingReviews } from "@/components/reviews/LandingReviews";

const BEFORE_AFTER = [
  {
    before: "Searching your inbox to remember whether you already applied.",
    after: "One list of every application, with the date you sent it.",
  },
  {
    before: "Forgetting to chase a company that went quiet.",
    after: "Anything with no change for a week is flagged on your dashboard.",
  },
  {
    before: "Interview times scattered across emails and chat messages.",
    after: "Each round saved with its type, time, length and meeting link.",
  },
  {
    before: "Guessing why the offers aren't coming.",
    after: "Reply, interview and offer rates worked out from your own stages.",
  },
];

const AUDIENCE = [
  {
    who: "Recent graduates",
    body: "Sending dozens of applications to land a first role. The list keeps the volume manageable, and the rates show which applications get replies.",
  },
  {
    who: "People looking while employed",
    body: "A search that has to fit around a day job. One place to check each evening, so nothing depends on remembering.",
  },
  {
    who: "Career changers",
    body: "Applying to several kinds of role at once. Notes, salary range and location on every application make them easy to compare.",
  },
  {
    who: "Anyone in a long search",
    body: "Months in, the details blur. Every stage change is recorded, so you can see what happened with each company and when.",
  },
];

const FEATURES = [
  {
    title: "Board and table views",
    body: "See applications as columns by stage, or as a table. Search by company and filter by stage or location.",
  },
  {
    title: "Stage history",
    body: "Each change from Applied to Screening to Interview is recorded with its date, so you can see when you heard back.",
  },
  {
    title: "Interview scheduling",
    body: "Phone screen, technical, system design, final round. Save the time, length, place or meeting link, and notes.",
  },
  {
    title: "Follow-up reminders",
    body: "Attach a reminder to a job. Overdue ones show in red at the top of your dashboard until you tick them off.",
  },
  {
    title: "Quiet-application flags",
    body: "Applications still at Applied or Screening after seven days appear under Worth a follow-up.",
  },
  {
    title: "Your own numbers",
    body: "Response, interview and offer rates update as you move applications, so you can tell where your search is stalling.",
  },
  {
    title: "Details on every application",
    body: "Company, role, location, salary range and currency, the link to the posting, and your own notes.",
  },
];

const STEPS = [
  {
    title: "Create an account",
    body: "An email and a password. Nothing to install.",
  },
  {
    title: "Add the jobs you have applied for",
    body: "Company, role and date are enough to start. Add the rest when you have it.",
  },
  {
    title: "Open the dashboard each day",
    body: "It shows what is coming up, what is overdue and which applications have gone quiet.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="ledger">
        <LandingNav />

        {/* Hero */}
        <section className="mx-auto grid max-w-6xl gap-12 px-5 pb-20 pt-10 sm:px-8 lg:grid-cols-[1fr_30rem] lg:gap-16 lg:pt-16">
          <div>
            <h1 className="max-w-[16ch] font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-[4rem]">
              Track every job application, and know what to chase today.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-pencil">
              JobTracker is a web app for people applying for jobs. Add each
              application, move it through stages as you hear back, and keep
              interview times and follow-up reminders in the same place.
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
            <p className="mt-5 text-sm text-pencil">
              Runs in any browser. Sign up with an email and password.
            </p>
          </div>

          <div className="lg:pt-2">
            <HeroPipeline />
            <p className="mt-3 text-sm text-pencil">
              Click a row to move it to the next stage. In the app, you change
              the stage from a menu on each application.
            </p>
          </div>
        </section>
      </div>

      {/* How it helps */}
      <section id="how-it-helps" className="border-t border-ink/15 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <h2 className="max-w-[24ch] font-display text-3xl leading-tight sm:text-4xl">
            Job hunting gets messy quickly. This is what changes.
          </h2>

          <div className="mt-10 border-t border-ink/25">
            <div className="hidden grid-cols-2 gap-10 border-b border-rule py-3 text-sm text-pencil md:grid">
              <span>Without a tracker</span>
              <span>With JobTracker</span>
            </div>
            <ul className="divide-y divide-rule">
              {BEFORE_AFTER.map((row) => (
                <li
                  key={row.after}
                  className="grid gap-2 py-5 md:grid-cols-2 md:gap-10"
                >
                  <p className="text-[17px] leading-relaxed text-pencil">
                    {row.before}
                  </p>
                  <p className="text-[17px] font-semibold leading-relaxed">
                    {row.after}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section id="who-its-for" className="border-t border-ink/15">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[22rem_1fr] lg:gap-20">
          <h2 className="font-display text-3xl leading-tight sm:text-4xl lg:sticky lg:top-10 lg:self-start">
            Who gets the most out of it.
          </h2>
          <ul className="divide-y divide-ink/15 border-y border-ink/15">
            {AUDIENCE.map((a) => (
              <li key={a.who} className="py-7">
                <h3 className="font-display text-2xl">{a.who}</h3>
                <p className="mt-2 max-w-[36rem] text-[17px] leading-relaxed text-pencil">
                  {a.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Features, with a picture of the dashboard */}
      <section id="features" className="border-t border-ink/15 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <h2 className="max-w-[32ch] font-display text-3xl leading-tight sm:text-4xl">
            What you get when you sign in.
          </h2>
          <p className="mt-4 max-w-[36rem] text-[17px] leading-relaxed text-pencil">
            This is the dashboard you land on. It puts the next interview, the
            overdue follow-up and the quiet applications on one screen.
          </p>

          <div className="mt-10">
            <ProductPreview />
          </div>

          <dl className="mt-14 grid gap-x-16 gap-y-9 md:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="border-t border-ink/25 pt-4">
                <dt className="font-display text-xl">{f.title}</dt>
                <dd className="mt-2 text-[16px] leading-relaxed text-pencil">
                  {f.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Ratings and reviews */}
      <LandingReviews />

      {/* How to start */}
      <section id="get-started" className="border-b border-ink/15">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <h2 className="max-w-[24ch] font-display text-3xl leading-tight sm:text-4xl">
            Up and running in a few minutes.
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <li key={s.title} className="border-t border-ink/25 pt-4">
                <p className="font-display text-3xl text-ink/40">{i + 1}</p>
                <h3 className="mt-2 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-[16px] leading-relaxed text-pencil">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
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

      <footer>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-sm text-pencil sm:px-8">
          <Wordmark className="text-ink !text-base" />
          <nav className="flex gap-5">
            <Link href="/login" className="hover:text-ink">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-ink">
              Create an account
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
