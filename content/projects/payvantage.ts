import type { Project, Source } from "../types";

const cv: Source = { kind: "cv" };
const aqib: Source = { kind: "aqib", said: "2026-10" };
const ethicaCode: Source = { kind: "code-review", project: "Ethica mobile app", reviewed: "2026-10" };
const passCode: Source = { kind: "code-review", project: "Ethica Pass", reviewed: "2026-10" };
const payvantage = { kind: "employment", org: "Payvantage", client: "Ethica Microfinance Bank" } as const;

export const ethcore: Project = {
  slug: "ethcore",
  title: "Ethcore",
  tier: "featured",
  summary:
    "The core banking platform for Ethica Microfinance Bank, built at Payvantage. It is in production and runs the banking operations behind the Ethica mobile app.",
  context: payvantage,
  role: { text: "Frontend Engineer; leads the frontend team", source: { kind: "aqib", said: "2026-10" } },
  ownership: "architected",
  platforms: ["web"],
  stack: { items: ["React", "Next.js", "TypeScript"], source: cv },
  visibility: "confidential",
  lithologyCode: "S1.05",
  responsibilities: [
    { text: "Architected and launched the core banking platform for Ethica MFB, and keeps building new features and enhancements on it.", source: cv },
    { text: "Leads the frontend engineering team, owning delivery, architecture and code quality across the core banking products.", source: cv },
    { text: "Oversaw frontend delivery for the core banking platform rebuild, keeping milestones on track and managing risks early.", source: cv },
    { text: "Worked with backend, product and compliance teams to deliver secure features such as role-based access control, MFA and transaction workflows.", source: cv },
    { text: "Sets frontend technical direction for scalability, security and maintainability. Reviews pull requests and mentors engineers.", source: cv },
  ],
  outcomes: [
    { text: "Launched to production in May 2026.", source: cv },
    { text: "Powers the banking operations behind the Ethica mobile app, which has 12,000+ users.", source: aqib },
  ],
  media: [],
};

export const ethicaMobile: Project = {
  slug: "ethica-mobile",
  title: "Ethica Mobile Banking",
  tier: "featured",
  summary:
    "Ethica Microfinance Bank's mobile banking app, built in Flutter by Payvantage's mobile team. I contributed four features: discounts on bills and utilities, the KYC tier 1 to 2 upgrade, the tier 2 to 3 upgrade built on the address verification SDK, and target savings.",
  context: payvantage,
  role: { text: "Contributor, alongside the senior mobile developer", source: cv },
  ownership: "contributed",
  platforms: ["mobile"],
  stack: { items: ["Flutter", "Dart", "BLoC (Cubit)"], source: ethicaCode },
  visibility: "confidential",
  lithologyCode: "S1.06",
  responsibilities: [
    { text: "Bills and utilities discounts: discounted pricing across airtime, data, cable TV and electricity, carried through each transaction summary and payment authentication.", source: aqib },
    { text: "KYC tier 1 to 2 upgrade: the upgrade form and its status tracking, including the address details and the utility-bill requirements notice.", source: aqib },
    { text: "KYC tier 2 to 3 upgrade: integrated the Address Verification SDK into the app's upgrade flow, from the start screen to confirmation.", source: aqib },
    { text: "Target savings: goal-based savings with creation, top-ups, liquidation, transaction history and receipts.", source: aqib },
  ],
  outcomes: [{ text: "The app serves 12,000+ users.", source: aqib }],
  media: [],
};

export const ethicaPass: Project = {
  slug: "ethica-pass",
  title: "Ethica Pass",
  tier: "featured",
  summary:
    "A mobile security token app for Ethica Microfinance Bank. Customers use it to sign in to internet banking and to authorise transactions. I built it on my own.",
  context: payvantage,
  role: { text: "Sole engineer", source: aqib },
  ownership: "built",
  platforms: ["mobile"],
  stack: { items: ["Flutter", "Dart", "BLoC"], source: passCode },
  visibility: "confidential",
  lithologyCode: "S1.07",
  responsibilities: [
    { text: "Device activation by scanning a QR code.", source: passCode },
    { text: "One-time codes shown with a live countdown ring, so customers can see when each code expires.", source: passCode },
    { text: "App lock with PIN and biometrics, plus automatic lock after inactivity.", source: passCode },
    { text: "Device integrity checks that block use on compromised devices, and certificate pinning on network calls.", source: passCode },
    { text: "Password rules checked live by a reusable requirements checklist, shared by sign-up, reset and change-password screens.", source: passCode },
  ],
  outcomes: [{ text: "Used for authentication and transaction authorisation in Ethica's internet banking.", source: aqib }],
  media: [],
};

export const addressSdk: Project = {
  slug: "address-verification-sdk",
  title: "Address Verification SDK",
  tier: "featured",
  summary:
    "A reusable Flutter module for Tier 3 address verification. A customer enters their address, the app confirms they are physically there, checks a photo of the building with AI, and issues a PDF certificate. Host apps use it through a small public API.",
  context: payvantage,
  ownership: "engineered",
  platforms: ["sdk", "mobile"],
  stack: { items: ["Flutter", "Dart", "BLoC (Cubit)", "Google Places and Geocoding"], source: ethicaCode },
  visibility: "confidential",
  lithologyCode: "S1.08",
  responsibilities: [
    { text: "Designed it as a package with a single public entry point: a drop-in flow widget, a setup function, a configuration object and typed results. Host apps never reach into its internals.", source: ethicaCode },
    { text: "Modelled the flow as an explicit state machine of thirteen states, from address entry and map pin drop through photo capture and validation to submission, plus out-of-range, location-denied, reminder and error states.", source: ethicaCode },
    { text: "Returned a sealed result type: submitted (possibly pending manual review), out of range with the measured distance, or location unavailable. Each host has to handle every case.", source: ethicaCode },
    { text: "Address entry with place autocomplete and geocoding, with a map pin drop when the address cannot be placed precisely.", source: ethicaCode },
    { text: "Compares the device's location with the address against a configurable radius.", source: ethicaCode },
    { text: "AI validation of the building photo, a generated PDF certificate, and a reminder notification when the customer cannot verify straight away.", source: ethicaCode },
  ],
  outcomes: [
    { text: "Powers the KYC tier 2 to 3 upgrade in the Ethica mobile app.", source: aqib },
    { text: "Reduced third-party KYC verification costs while improving verification accuracy.", source: cv },
  ],
  media: [],
};
