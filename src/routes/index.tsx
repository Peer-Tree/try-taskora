import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-phone.jpg";

const WHATSAPP_URL = "https://wa.me/18156611544?text=Hi%20Taskora%2C%20I%27d%20like%20to%20start%20doing%20AI%20tasks";
const EMAIL_URL =
  "mailto:heknowyou69@gmail.com?subject=Taskora%20application&body=Hi%20Taskora%2C%20I%27d%20like%20to%20start%20doing%20AI%20tasks.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Taskora — Get Paid $15–$25/hr for AI Tasks" },
      {
        name: "description",
        content:
          "Taskora pays $15–$25 per hour to complete short AI training tasks from your phone or laptop. No degree, no experience, work whenever you want.",
      },
      { property: "og:title", content: "Taskora — Get Paid $15–$25/hr for AI Tasks" },
      {
        property: "og:description",
        content:
          "Short AI training tasks you can do from your phone or laptop. $15–$25/hr, flexible hours, weekly payouts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const steps = [
  {
    n: "01",
    title: "Reach out",
    body: "Message us on WhatsApp or email. Tell us your name, country and whether you'll work from phone or laptop.",
  },
  {
    n: "02",
    title: "Quick onboarding",
    body: "A short walkthrough and a sample task. No degree, no résumé, no experience required — just clear English.",
  },
  {
    n: "03",
    title: "Pick up tasks",
    body: "Rate AI answers, label data, write prompts, review transcripts. Sessions run 20 minutes to a few hours.",
  },
  {
    n: "04",
    title: "Get paid",
    body: "$15–$25 per hour depending on the task type and your accuracy score. Paid out on a weekly cycle.",
  },
];

const tiers = [
  { rate: "$15", label: "Starter tasks", body: "Rating and comparing AI responses, simple image and audio labeling." },
  { rate: "$20", label: "Standard tasks", body: "Prompt writing, transcript review, longer evaluation batches." },
  { rate: "$25", label: "Specialist tasks", body: "Domain work — coding, finance, medical, or second-language review." },
];

function Index() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
          style={{ background: "var(--gradient-lime)" }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-20 md:pt-14 md:pb-28">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              Taskora
            </span>
          </div>

          <div className="mt-16 grid items-center gap-12 md:mt-24 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Remote · Flexible hours
              </p>
              <h1 className="mt-6 text-5xl font-bold leading-[1.02] md:text-7xl">
                Get paid <span className="text-gradient-lime">$15–$25/hr</span> to train AI from
                your phone.
              </h1>
              <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                Taskora connects people to short, well-paid AI tasks — rating answers, labeling
                data, writing prompts. Work from anywhere, on your own schedule, and get paid
                weekly.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glow-ring inline-flex items-center justify-center rounded-full bg-primary px-7 py-4 text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Start on WhatsApp
                </a>
                <a
                  href={EMAIL_URL}
                  className="inline-flex items-center justify-center rounded-full border border-border px-7 py-4 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  Email us instead
                </a>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                No fees, ever. We never ask you to pay to start.
              </p>
            </div>

            <div className="relative">
              <img
                src={heroImage}
                alt="Person completing AI tasks on a smartphone at home"
                width={1280}
                height={1280}
                className="w-full rounded-3xl border border-border object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Rates */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold md:text-4xl">What the pay looks like</h2>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Your hourly rate depends on the task type. Most people start at $15 and move up as
            their accuracy score rises.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {tiers.map((t) => (
              <div key={t.rate} className="rounded-2xl border border-border bg-card p-7">
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-primary">
                  {t.rate}
                  <span className="text-base font-medium text-muted-foreground">/hr</span>
                </p>
                <p className="mt-4 font-semibold">{t.label}</p>
                <p className="mt-2 text-sm text-muted-foreground">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
          <div className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-5 border-t border-border pt-6">
                <span className="font-[family-name:var(--font-display)] text-sm font-bold text-primary">
                  {s.n}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-6xl">
            Ready to take your first task?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Send us a message and we'll get you onboarded, usually within 24 hours.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-ring inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              WhatsApp +1 (815) 661-1544
            </a>
            <a
              href={EMAIL_URL}
              className="inline-flex items-center justify-center rounded-full border border-border px-8 py-4 text-base font-semibold transition-colors hover:bg-secondary"
            >
              heknowyou69@gmail.com
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Taskora</span>
          <span>Remote AI task work · Paid weekly</span>
        </div>
      </footer>
    </main>
  );
}
