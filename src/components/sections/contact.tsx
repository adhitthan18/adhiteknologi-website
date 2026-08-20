"use client";

import { useRef, useState } from "react";
import {
  EnvelopeSimpleIcon,
  WarningCircleIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { sectionIds, site } from "@/lib/site-config";
import type { Dictionary } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type Field = "nama" | "kontak" | "kebutuhan" | "pesan";
type Errors = Partial<Record<Field, string>>;

export function Contact({ dict }: { dict: Dictionary }) {
  const t = dict.contact;

  const [values, setValues] = useState<Record<Field, string>>({
    nama: "",
    kontak: "",
    kebutuhan: t.options[0],
    pesan: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = (field: Field, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (values.nama.trim().length < 2) next.nama = t.errors.nama;
    if (values.kontak.trim().length < 6) next.kontak = t.errors.kontak;
    if (values.pesan.trim().length < 10) next.pesan = t.errors.pesan;
    return next;
  };

  const composeMessage = () =>
    [
      t.messageIntro,
      "",
      `${t.messageName}: ${values.nama.trim()}`,
      `${t.messageContact}: ${values.kontak.trim()}`,
      `${t.messageNeed}: ${values.kebutuhan}`,
      "",
      values.pesan.trim(),
    ].join("\n");

  const handleSubmit = (event: React.SyntheticEvent, channel: "whatsapp" | "email") => {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Fokus dipindah ke ringkasan galat agar pengguna screen reader tahu apa yang gagal.
      // setTimeout dipakai (bukan rAF) supaya tetap jalan walau tab sedang tidak aktif.
      setTimeout(() => summaryRef.current?.focus(), 0);
      return;
    }

    const body = composeMessage();
    const url =
      channel === "whatsapp"
        ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(body)}`
        : `mailto:${site.email}?subject=${encodeURIComponent(
            `${t.emailSubject} — ${values.nama.trim()}`,
          )}&body=${encodeURIComponent(body)}`;

    window.open(url, channel === "whatsapp" ? "_blank" : "_self", "noopener,noreferrer");
  };

  const errorList = (Object.entries(errors) as [Field, string | undefined][]).filter(
    (entry): entry is [Field, string] => Boolean(entry[1]),
  );

  const summaryLabel =
    errorList.length === 1 ? t.summaryOne : t.summaryMany.replace("{n}", String(errorList.length));

  return (
    <section id={sectionIds.contact} className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 grid-backdrop opacity-70" aria-hidden="true" />

      <div className="container-page grid gap-14 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-20">
        <div className="max-w-xl">
          <Reveal
            as="p"
            className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand"
          >
            {t.eyebrow}
          </Reveal>
          <Reveal
            as="h2"
            className="mt-4 text-3xl font-extrabold leading-[1.15] tracking-tight text-balance sm:text-4xl"
          >
            {t.title}
          </Reveal>
          <Reveal as="p" className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
            {t.description}
          </Reveal>

          <Reveal className="mt-10 flex flex-col gap-3">
            <a
              href={`mailto:${site.email}`}
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface px-5 py-4 text-sm transition-colors hover:border-line-strong"
            >
              <EnvelopeSimpleIcon size={20} weight="duotone" className="text-brand" aria-hidden />
              <span className="font-medium">{site.email}</span>
            </a>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[var(--radius-card)] border border-line bg-surface px-5 py-4 text-sm transition-colors hover:border-line-strong"
            >
              <WhatsappLogoIcon size={20} weight="duotone" className="text-brand" aria-hidden />
              <span className="font-medium">{site.phone}</span>
              <span className="sr-only">{t.whatsappNewTab}</span>
            </a>
          </Reveal>
        </div>

        <Reveal
          as="form"
          noValidate
          onSubmit={(event: React.FormEvent) => handleSubmit(event, "whatsapp")}
          className="rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-8"
        >
          {errorList.length > 0 && (
            <div
              ref={summaryRef}
              tabIndex={-1}
              role="alert"
              className="mb-6 rounded-2xl border border-danger/40 bg-danger/10 p-4"
            >
              <p className="flex items-center gap-2 text-sm font-semibold text-danger">
                <WarningCircleIcon size={18} weight="bold" aria-hidden />
                {summaryLabel}
              </p>
              <ul className="mt-2 flex flex-col gap-1 pl-6 text-sm text-danger">
                {errorList.map(([field, message]) => (
                  <li key={field}>
                    <a href={`#field-${field}`} className="underline underline-offset-2">
                      {t.labels[field]}: {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <TextField
              id="field-nama"
              label={t.labels.nama}
              value={values.nama}
              error={errors.nama}
              autoComplete="organization"
              placeholder={t.placeholders.nama}
              onChange={(v) => set("nama", v)}
            />
            <TextField
              id="field-kontak"
              label={t.labels.kontak}
              value={values.kontak}
              error={errors.kontak}
              autoComplete="email"
              inputMode="email"
              placeholder={t.placeholders.kontak}
              onChange={(v) => set("kontak", v)}
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="field-kebutuhan" className="text-sm font-semibold">
                {t.labels.kebutuhan}
              </label>
              <select
                id="field-kebutuhan"
                value={values.kebutuhan}
                onChange={(e) => set("kebutuhan", e.target.value)}
                className="min-h-12 rounded-xl border border-line bg-surface-2/60 px-4 text-sm text-fg transition-colors focus:border-brand"
              >
                {t.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="field-pesan" className="text-sm font-semibold">
                {t.labels.pesan}
              </label>
              <textarea
                id="field-pesan"
                rows={4}
                value={values.pesan}
                onChange={(e) => set("pesan", e.target.value)}
                aria-invalid={Boolean(errors.pesan)}
                aria-describedby={errors.pesan ? "error-pesan" : "hint-pesan"}
                placeholder={t.placeholders.pesan}
                className={cn(
                  "rounded-xl border bg-surface-2/60 px-4 py-3 text-sm text-fg transition-colors focus:border-brand",
                  errors.pesan ? "border-danger" : "border-line",
                )}
              />
              {errors.pesan ? (
                <p id="error-pesan" className="text-xs text-danger">
                  {errors.pesan}
                </p>
              ) : (
                <p id="hint-pesan" className="text-xs text-fg-subtle">
                  {t.hint}
                </p>
              )}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3">
            <Button type="submit" size="lg">
              <WhatsappLogoIcon size={19} weight="bold" aria-hidden />
              {t.submitWhatsapp}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={(event) => handleSubmit(event, "email")}
            >
              <EnvelopeSimpleIcon size={19} weight="bold" aria-hidden />
              {t.submitEmail}
            </Button>
            <p className="text-center text-xs leading-relaxed text-fg-subtle">{t.privacy}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TextField({
  id,
  label,
  value,
  error,
  onChange,
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
} & Omit<React.ComponentProps<"input">, "onChange" | "value" | "id">) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "min-h-12 rounded-xl border bg-surface-2/60 px-4 text-sm text-fg transition-colors focus:border-brand",
          error ? "border-danger" : "border-line",
        )}
        {...rest}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
