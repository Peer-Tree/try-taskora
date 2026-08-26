import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  ArrowLeft,
  CalendarIcon,
  Clock,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { useForm, useWatch, type DefaultValues } from "react-hook-form";

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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
  dob: z
    .date({
      required_error: "Please select your date of birth.",
      invalid_type_error: "Please select a valid date.",
    })
    .refine(
      (date) => {
        const today = new Date();
        const eighteenYearsAgo = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate(),
        );
        return date <= eighteenYearsAgo;
      },
      { message: "You must be at least 18 years old to apply." },
    ),
  ssn: z.string().refine((val) => val.replace(/\D/g, "").length === 9, {
    message: "Please enter a valid 9-digit Social Security number.",
  }),
  city: z.string().min(2, "Please enter your city of residence."),
  address_line_1: z.string().min(3, "Please enter your address."),
  address_line_2: z.string().optional(),
  postal_code: z.string().min(5, "Please enter a valid postal code."),
  phone: z.string().refine((val) => val.replace(/\D/g, "").length === 11, {
    message: "Please enter a valid US phone number.",
  }),
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

function generateTicketNumber(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function formatUSPhoneNumber(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  const area = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const line = digits.slice(6, 10);

  if (digits.length > 6) return `(${area}) ${prefix}-${line}`;
  if (digits.length > 3) return `(${area}) ${prefix}`;
  if (digits.length > 0) return `(${area}`;
  return "";
}

function normalizePhoneNumber(input: string): string {
  return `+1${input.replace(/\D/g, "").slice(0, 10)}`;
}

function displayPhoneNumber(input: string): string {
  return formatUSPhoneNumber(input.replace(/^\+1/, ""));
}

function formatSSN(input: string): string {
  const digits = input.replace(/\D/g, "").slice(0, 9);
  if (digits.length > 5) return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  if (digits.length > 3) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return digits;
}

const defaultValues: DefaultValues<FormValues> = {
  name: "",
  email: "",
  ssn: "",
  city: "",
  address_line_1: "",
  address_line_2: "",
  postal_code: "",
  phone: "",
  interests: [] as string[],
};

function GetStartedPage() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const dobValue = useWatch({ control: form.control, name: "dob" });

  const onSubmit = form.handleSubmit(async (values) => {
    const ticket = generateTicketNumber();
    setTicketNumber(ticket);

    const interestLabels = values.interests
      .map((id) => taskOptions.find((t) => t.id === id)?.label)
      .filter(Boolean)
      .join(", ");

    const message = [
      `Hi Taskora, I'd like to start doing AI tasks.`,
      ``,
      `*Support Ticket #:* ${ticket}`,
      `*Name:* ${values.name}`,
      `*Gender:* ${values.gender}`,
      `*Email:* ${values.email}`,
      `*Date of birth:* ${format(values.dob, "PPP")}`,
      `*City:* ${values.city}`,
      `*Phone:* ${displayPhoneNumber(values.phone)}`,
      `*Interested in:* ${interestLabels}`,
    ].join("\n");

    const { error } = await supabase.from("users").insert({
      name: values.name,
      email: values.email,
      gender: values.gender,
      phone: values.phone,
      country: "US",
      city: values.city,
      address_line_1: values.address_line_1,
      address_line_2: values.address_line_2 || null,
      postal_code: values.postal_code,
      ssn: values.ssn,
    });

    if (error) {
      console.error(error);
    }

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  });

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
            {submitted ? (
              <>
                You're on the list,{" "}
                <span className="text-gradient-lime">
                  {form.getValues("name").split(" ")[0] || "friend"}
                </span>
              </>
            ) : (
              <>
                Get started with <span className="text-gradient-lime">Taskora</span>
              </>
            )}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {submitted
              ? "Thanks for submitting your interest. Support will reach out to you within 24 hours to verify your details."
              : "Tell us a bit about yourself and the AI tasks you're interested in. We'll review your application and usually reply within 24 hours."}
          </p>

          {!submitted && (
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
          )}
        </div>

        {submitted ? (
          <div className="mt-10 space-y-6">
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary">
                  <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Application received</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your support ticket number is{" "}
                    <span className="font-mono font-semibold text-foreground">#{ticketNumber}</span>
                    . Keep it handy for faster support.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h3 className="text-lg font-semibold">Want to speed up the process?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Message us on WhatsApp and we'll review your details right away. Your ticket number
                is already included.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="glow-ring flex-1 rounded-full bg-primary py-5 text-base font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Hi Taskora, I completed my details. My support ticket is #${ticketNumber}.`,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="h-5 w-5" />
                    Message us on WhatsApp
                  </a>
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 rounded-full py-5 text-base font-semibold"
                >
                  <a
                    href="mailto:jointaskora@gmail.com?subject=Taskora%20application"
                    className="inline-flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Email us instead
                  </a>
                </Button>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 space-y-10">
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
                    value={form.watch("gender") || ""}
                    onValueChange={(value) =>
                      form.setValue("gender", value as FormValues["gender"], {
                        shouldValidate: true,
                      })
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

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of birth</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dob"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dobValue && "text-muted-foreground",
                        )}
                        aria-invalid={!!form.formState.errors.dob}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dobValue ? format(dobValue, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dobValue}
                        onSelect={(date) =>
                          date && form.setValue("dob", date, { shouldValidate: true })
                        }
                        initialFocus
                        defaultMonth={new Date(1990, 0, 1)}
                        className={cn("p-3 pointer-events-auto")}
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.dob && (
                    <p className="text-sm text-destructive">{form.formState.errors.dob.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ssn">Social Security number</Label>
                  <Input
                    id="ssn"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="123-45-6789"
                    value={formatSSN(form.watch("ssn") ?? "")}
                    onChange={(e) =>
                      form.setValue("ssn", e.target.value.replace(/\D/g, "").slice(0, 9), {
                        shouldValidate: true,
                      })
                    }
                    aria-invalid={!!form.formState.errors.ssn}
                  />
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    Required for US tax reporting. Used only for identity and payment verification.
                  </p>
                  {form.formState.errors.ssn && (
                    <p className="text-sm text-destructive">{form.formState.errors.ssn.message}</p>
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
                  <Label htmlFor="address_line_1">Address line 1</Label>
                  <Input
                    id="address_line_1"
                    placeholder="123 Main Street"
                    {...form.register("address_line_1")}
                    aria-invalid={!!form.formState.errors.address_line_1}
                  />
                  {form.formState.errors.address_line_1 && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.address_line_1.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address_line_2">
                    Address line 2 <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="address_line_2"
                    placeholder="Apt, suite, unit, etc."
                    {...form.register("address_line_2")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal code</Label>
                  <Input
                    id="postal_code"
                    placeholder="12345"
                    inputMode="numeric"
                    {...form.register("postal_code")}
                    aria-invalid={!!form.formState.errors.postal_code}
                  />
                  {form.formState.errors.postal_code && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.postal_code.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <div className="flex overflow-hidden rounded-xl border border-input bg-background focus-within:ring-1 focus-within:ring-ring">
                    <span className="flex shrink-0 items-center border-r border-input bg-muted/50 px-3 py-2 text-sm font-medium text-muted-foreground">
                      +1
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="(815) 661-1544"
                      className="rounded-none border-0 bg-transparent px-3 py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                      value={displayPhoneNumber(form.watch("phone"))}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                        form.setValue("phone", normalizePhoneNumber(digits), {
                          shouldValidate: true,
                        });
                      }}
                      aria-invalid={!!form.formState.errors.phone}
                    />
                  </div>
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
                Submitting opens WhatsApp with your details prefilled. You can edit the message
                before sending.
              </p>
            </div>
          </form>
        )}

        <footer className="mt-12 border-t border-border pt-8 text-sm text-muted-foreground">
          <p>
            Prefer email?{" "}
            <a
              href="mailto:jointaskora@gmail.com?subject=Taskora%20application"
              className="text-primary hover:underline"
            >
              jointaskora@gmail.com
            </a>
          </p>
          <p className="mt-1">© {new Date().getFullYear()} Taskora</p>
        </footer>
      </div>
    </main>
  );
}
