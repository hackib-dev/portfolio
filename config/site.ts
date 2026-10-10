/**
 * Public contact and identity settings. Change values here, not in components.
 * A channel set to null is not rendered anywhere on the site.
 */
export const site = {
  url: "https://www.aqibakinyele.com",
  name: "Aqib Akinyele",
  fullName: "Aqib Akinyele Kehinde",
  title: "Frontend Engineer",
  location: "Lagos, Nigeria",
  coordinates: "6.52°N 3.38°E",
  tagline: "I don't just build interfaces. I engineer experiences.",
  contact: {
    email: "aqibkenn@gmail.com",
    linkedin: "https://www.linkedin.com/in/aqib-akinyele",
    github: "https://github.com/hackib-dev",
    resume: { href: "/aqib-akinyele-resume.pdf", label: "Résumé (PDF)" },
    phones: [
      { number: "+234 811 888 8108", label: "Call or WhatsApp", whatsapp: true },
      { number: "+234 903 082 3149", label: "Call", whatsapp: false },
    ],
  },
} as const;
