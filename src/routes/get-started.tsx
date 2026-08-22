import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Clock, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WHATSAPP_NUMBER = "18156611544";

const taskOptions = [
  {
    id: "text-generation",
    label: "Text generation",
    description: "Write prompts, craft responses, and refine AI copy.",
  },
  {
    id: "audio-transcription",
    label: "Audio transcription",
    description: "Listen to short clips and transcribe or review them.",
  },
  {
    id: "llm-interaction",
    label: "LLM interaction",
    description: "Rate AI answers, compare outputs, and improve conversations.",
  },
  {
    id: "video-transcription",
    label: "Video transcription",
    description: "Caption and review short video content for AI training.",
  },
  {
    id: "recommend-for-me",
    label: "Let us recommend for you",
    description: "Not sure yet? We'll match you to tasks that fit your skills.",
  },
];

const formSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  gender: z.enum(["male", "female", "non-binary", "prefer-not-to-say"], {
    required_error: "Please select an option.",
  }),
  email: z.string().email("Please enter a valid email address."),
  city: z.string().min(2, "Please enter your city of residence."),
  phone: z.string().min(10, "Please enter a valid US phone number."),
  interests: z.array(z.string()).min(1, "Please choose at least one task type."),
});

type FormValues = z.infer<typeof formSchema>;

export const Route = createFileRoute("/get-started")({
  head: () => ({
    meta: [
      { title: "Get Started — Taskora" },
      {
        name: "description",
        content:
          "Apply to join Taskora. Tell us a little about yourself and the AI tasks you want to do. We'll reply within 24 hours.",
      },
      { property: "og:title", content: "Get Started — Taskora" },
      {
        property: "og:description",
        content:
          "Apply to join Taskora. Tell us a little about yourself and the AI tasks you want to do.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GetStartedPage,
});

function GetStartedPage() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      city: "",
      phone: "",
      interests: [],
    },
  });

  function onSubmit(values: FormValues) {
    const interestLabels = values.interests
      .map((id) => taskOptions.find((t) => t.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const message = [
      `Hi Taskora, I'd like to start doing AI tasks.`,
      ``,
      `*Name:* ${values.name}`,
      `*Gender:* ${values.gender}`,
      `*Email:* ${values.email}`,
      `*City:* ${values.city}`,
      `*Phone:* ${values.phone}`,
      `*Interested in:* ${interestLabels}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10 md:py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Taskora
        </Link>

        <div className="mt-8">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              Taskora
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-bold md:text-5xl">
            Get started with <span className="text-gradient-lime">Taskora</span>
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Tell us a bit about yourself and the AI tasks you're interested in. We'll review your
            application and usually reply within 24 hours.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              Takes about 2 minutes
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              No fees, ever
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle className="h-4 w-4 text-primary" />
              Reply via WhatsApp or email
            </span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-10 space-y-10">
          {/* Section 1: Personal details */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground">
                1
              </span>
              <h2 className="text-xl font-semibold">Personal details</h2>
            </div>
            <p className="mt-1 pl-11 text-sm text-muted-foreground">
              We use this to personalize your onboarding and match you with the right tasks.
            </p>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  {...form.register("name")}
                  aria-invalid={!!form.formState.errors.name}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={form.watch("gender")}
                  onValueChange={(value) =>
                    form.setValue("gender", value as FormValues["gender"], { shouldValidate: true })
                  }
                >
                  <SelectTrigger id="gender" aria-invalid={!!form.formState.errors.gender}>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.gender && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.gender.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  {...form.register("email")}
                  aria-invalid={!!form.formState.errors.email}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 2: Location & contact */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground">
                2
              </span>
              <h2 className="text-xl font-semibold">Location & contact</h2>
            </div>
            <p className="mt-1 pl-11 text-sm text-muted-foreground">
              Taskora is open to US residents. We need a phone number so we can reach you on
              WhatsApp.
            </p>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="city">City of residence (US)</Label>
                <Input
                  id="city"
                  placeholder="Austin, Texas"
                  {...form.register("city")}
                  aria-invalid={!!form.formState.errors.city}
                />
                {form.formState.errors.city && (
                  <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (815) 661-1544"
                  {...form.register("phone")}
                  aria-invalid={!!form.formState.errors.phone}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Section 3: Task interests */}
          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-[family-name:var(--font-display)] text-sm font-bold text-primary-foreground">
                3
              </span>
              <h2 className="text-xl font-semibold">AI task interests</h2>
            </div>
            <p className="mt-1 pl-11 text-sm text-muted-foreground">
              Pick the tasks that sound interesting. You can change your mind later.
            </p>

            <div className="mt-6 space-y-4">
              {taskOptions.map((option) => {
                const checked = form.watch("interests").includes(option.id);
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
                      checked
                        ? "border-primary bg-primary/10"
                        : "border-border bg-transparent hover:bg-accent/50"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(isChecked) => {
                        const current = form.getValues("interests");
                        if (isChecked) {
                          form.setValue("interests", [...current, option.id], {
                            shouldValidate: true,
                          });
                        } else {
                          form.setValue(
                            "interests",
                            current.filter((id) => id !== option.id),
                            { shouldValidate: true },
                          );
                        }
                      }}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  </label>
                );
              })}
              {form.formState.errors.interests && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.interests.message}
                </p>
              )}
            </div>
          </section>

          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <Button
              type="submit"
              className="glow-ring w-full rounded-full bg-primary py-6 text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Send my application on WhatsApp
            </Button>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Submitting opens WhatsApp with your details prefilled. You can edit the message before
              sending.
            </p>
          </div>
        </form>

        <footer className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
          <p>
            Prefer email?{" "}
            <a
              href="mailto:heknowyou69@gmail.com?subject=Taskora%20application"
              className="text-primary hover:underline"
            >
              heknowyou69@gmail.com
            </a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Taskora</p>
        </footer>
      </div>
    </main>
  );
}
