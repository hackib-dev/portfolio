import { site } from "@/config/site";

type Channel = { label: string; value: string; href: string; external: boolean };

export function channels(): Channel[] {
  const c = site.contact;
  const list: Channel[] = [
    { label: "Email", value: c.email, href: `mailto:${c.email}`, external: false },
    { label: "LinkedIn", value: "in/aqib-akinyele", href: c.linkedin, external: true },
    { label: "GitHub", value: "hackib-dev", href: c.github, external: true },
  ];
  for (const phone of c.phones) {
    const digits = phone.number.replace(/\D/g, "");
    list.push({ label: phone.label, value: phone.number, href: `tel:+${digits}`, external: false });
    if (phone.whatsapp) list.push({ label: "WhatsApp", value: phone.number, href: `https://wa.me/${digits}`, external: true });
  }
  return list;
}

export function ContactLinks({ dense = false }: { dense?: boolean }) {
  return (
    <ul className={`grid gap-0 ${dense ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
      {channels().map((ch) => (
        <li key={ch.label} className="border-t border-ink">
          <a
            href={ch.href}
            className="group flex flex-col gap-1 py-4 pr-4 no-underline"
            {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            <span className="label text-ink-2">{ch.label}</span>
            <span className="font-display text-xl font-bold [font-variation-settings:'wdth'_104] group-hover:underline">
              {ch.value}
              {ch.external ? <span aria-hidden="true"> ↗</span> : null}
              {ch.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </span>
          </a>
        </li>
      ))}
      <li className="border-t border-ink">
        <a href={site.contact.resume.href} download className="group flex flex-col gap-1 py-4 pr-4 no-underline">
          <span className="label text-ink-2">Résumé</span>
          <span className="font-display text-xl font-bold [font-variation-settings:'wdth'_104] group-hover:underline">
            Download PDF <span aria-hidden="true">↓</span>
          </span>
        </a>
      </li>
    </ul>
  );
}
