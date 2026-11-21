"use client";

import { useState } from "react";

const STAGES = ["Applied", "Screening", "Interview", "Offer"] as const;

interface Slip {
  id: number;
  company: string;
  role: string;
  place: string;
  sent: string;
  stage: number;
}

const INITIAL: Slip[] = [
  {
    id: 1,
    company: "Northwind Labs",
    role: "Frontend Developer",
    place: "Remote",
    sent: "Sent 3 days ago",
    stage: 0,
  },
  {
    id: 2,
    company: "Kestrel Health",
    role: "React Engineer",
    place: "Dhaka",
    sent: "Sent 9 days ago",
    stage: 1,
  },
  {
    id: 3,
    company: "Brightloom",
    role: "Web Developer",
    place: "Remote",
    sent: "Sent 16 days ago",
    stage: 2,
  },
  {
    id: 4,
    company: "Paperplane",
    role: "Full-stack Developer",
    place: "Singapore",
    sent: "Sent yesterday",
    stage: 0,
  },
];

export function HeroPipeline() {
  const [slips, setSlips] = useState<Slip[]>(INITIAL);
  const [stamp, setStamp] = useState<{ id: number; n: number } | null>(null);
  const [announce, setAnnounce] = useState("");

  const advance = (slip: Slip) => {
    const next = Math.min(slip.stage + 1, STAGES.length - 1);
    if (next === slip.stage) return;
    setSlips((prev) =>
      prev.map((s) => (s.id === slip.id ? { ...s, stage: next } : s)),
    );
    setStamp((prev) => ({ id: slip.id, n: (prev?.n ?? 0) + 1 }));
    setAnnounce(`${slip.company} moved to ${STAGES[next]}`);
  };

  const reset = () => {
    setSlips(INITIAL);
    setStamp(null);
    setAnnounce("Sample applications reset");
  };

  return (
    <div className="border border-ink/20 bg-white">
      <div className="flex items-baseline justify-between border-b border-ink/15 px-5 py-3 text-sm text-pencil">
        <span>Sample applications</span>
        <button
          type="button"
          onClick={reset}
          className="rounded px-1 underline-offset-2 hover:text-ink hover:underline"
        >
          Reset
        </button>
      </div>

      <ul>
        {slips.map((slip) => {
          const atOffer = slip.stage === STAGES.length - 1;
          const stamped = stamp?.id === slip.id;
          return (
            <li key={slip.id} className="border-b border-ink/10 last:border-b-0">
              <button
                type="button"
                onClick={() => advance(slip)}
                disabled={atOffer}
                aria-label={`${slip.company}, ${slip.role}. Stage: ${STAGES[slip.stage]}.${atOffer ? "" : " Move to the next stage."}`}
                className="relative grid w-full grid-cols-[1fr_auto] items-center gap-4 px-5 py-5 text-left transition-colors enabled:hover:bg-paper disabled:cursor-default"
              >
                <span className="min-w-0">
                  <span className="block truncate font-display text-xl text-ink">
                    {slip.company}
                  </span>
                  <span className="mt-0.5 block text-[15px] text-pencil">
                    {slip.role}, {slip.place}
                  </span>
                  <span className="mt-3 flex gap-1" aria-hidden="true">
                    {STAGES.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 w-9 ${
                          i <= slip.stage
                            ? atOffer
                              ? "bg-offer"
                              : "bg-ink"
                            : "bg-ink/12"
                        }`}
                      />
                    ))}
                  </span>
                </span>

                <span className="relative flex w-28 flex-col items-end text-right sm:w-32">
                  {stamped ? (
                    <span
                      key={stamp?.n}
                      aria-hidden="true"
                      className={`stamp-in inline-block border-[3px] px-2 py-0.5 text-sm font-extrabold uppercase tracking-wider ${
                        atOffer
                          ? "border-offer text-offer"
                          : "border-stamp text-stamp"
                      }`}
                    >
                      {STAGES[slip.stage]}
                    </span>
                  ) : (
                    <span
                      className={`px-1.5 text-[15px] font-semibold ${
                        atOffer ? "text-offer" : "bg-marker text-ink"
                      }`}
                    >
                      {STAGES[slip.stage]}
                    </span>
                  )}
                  <span className="mt-2 text-sm text-pencil">
                    {atOffer ? "Nice work" : slip.sent}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
