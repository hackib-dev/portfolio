import type { Signal } from "./types";

const bitooqohSite = {
  kind: "public",
  url: "https://bitooqoh.com",
  label: "Bitooqoh homepage",
} as const;

export const signals: Signal[] = [
  {
    id: "ethica-users",
    sample: "Ethica mobile app",
    value: "50,000+",
    context:
      "Users on Ethica Microfinance Bank's mobile banking app. I built its discounts on bills and utilities (airtime, data, cable TV, electricity), the KYC tier 1 to 2 and tier 2 to 3 upgrades, and target savings.",
    source: { kind: "aqib", said: "2026-10" },
    publish: true,
  },
  {
    id: "bitooqoh-sales",
    sample: "Bitooqoh ticket sales",
    value: "₦198M+",
    context:
      "Ticket sales processed through Bitooqoh, an independent ticketing company live in Nigeria and Kenya.",
    source: bitooqohSite,
    publish: true,
  },
  {
    id: "ethcore-launch",
    sample: "Ethcore launch",
    value: "May 2026",
    context:
      "Architected and launched Ethcore, the core banking platform for Ethica MFB. Now leads its frontend team.",
    source: { kind: "cv" },
    publish: true,
  },
  {
    id: "thinkvantage",
    sample: "ThinkVantage Award",
    value: "Overall winner",
    context:
      "Inaugural innovation challenge at Ethica Microfinance Bank, 2026. Staff pitch ideas to improve operations, cut costs and raise efficiency. Presented at the bank's H1 performance review.",
    source: {
      kind: "public",
      url: "https://ethicamfb.com/blog/ethica-launches-thinkvantage-rewards-innovative-staff",
      label: "Ethica announcement",
    },
    publish: true,
  },
  {
    id: "bitooqoh-tickets",
    sample: "Bitooqoh tickets sold",
    value: "21K+",
    context: "Tickets sold to attendees through the platform.",
    source: bitooqohSite,
    publish: true,
  },
  {
    id: "bitooqoh-events",
    sample: "Bitooqoh events",
    value: "115+",
    context: "Events managed on Bitooqoh.",
    source: bitooqohSite,
    publish: true,
  },
  {
    id: "bitooqoh-orgs",
    sample: "Bitooqoh organisations",
    value: "70+",
    context: "Organisations onboarded to run their events on Bitooqoh.",
    source: bitooqohSite,
    publish: true,
  },
  {
    id: "kyc-cost",
    sample: "Address Verification SDK",
    value: "Lower KYC cost",
    context:
      "Reduced third-party KYC verification costs while improving accuracy. It powers the tier 2 to 3 upgrade in the Ethica app.",
    source: { kind: "cv" },
    publish: true,
  },
  {
    id: "ethica-pass",
    sample: "Ethica Pass",
    value: "Built solo",
    context:
      "The security token app Ethica customers use to sign in to internet banking and authorise transactions.",
    source: { kind: "aqib", said: "2026-10" },
    publish: true,
  },
  {
    id: "mte-editions",
    sample: "Muslim Tech Expo",
    value: "4 editions",
    context:
      "Shipped and maintained from MTE 1.0, plus a separate build for MTE Kenya.",
    source: { kind: "live-site", url: "https://www.aqibakinyele.com/mte" },
    publish: true,
  },
  {
    id: "leadership",
    sample: "Engineering leadership",
    value: "Team lead",
    context:
      "Leads the frontend team at Payvantage: delivery, architecture, code review and mentoring.",
    source: { kind: "cv" },
    publish: true,
  },
];

export const publishedSignals = signals.filter((s) => s.publish);
