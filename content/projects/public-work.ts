import type { Project, Source } from "../types";
import bitooqohHome from "@/assets/bitooqoh.png";
import bitooqohDiscover from "@/assets/bitooqoh/imageTwo.png";
import bitooqohDashboard from "@/assets/bitooqoh/imageFive.png";
import bitooqohTickets from "@/assets/bitooqoh/imageFour.png";
import superHotels from "@/assets/super.png";
import superFlights from "@/assets/super/imageTwo.png";
import superResults from "@/assets/super/imageFour.png";
import superPackages from "@/assets/super/imageThree.png";
import mteHero from "@/assets/mte.png";
import mteMerch from "@/assets/mte/imageThree.png";
import mteKenyaHero from "@/assets/mteKenya.png";
import mteKenyaPeople from "@/assets/mte-kenya/imageThree.png";

const site = (path: string): Source => ({ kind: "live-site", url: `https://www.aqibakinyele.com${path}` });
const code = (project: string): Source => ({ kind: "code-review", project, reviewed: "2026-10" });
const bitooqohSite: Source = { kind: "public", url: "https://bitooqoh.com", label: "Bitooqoh homepage" };

export const bitooqoh: Project = {
  slug: "bitooqoh",
  title: "Bitooqoh",
  tier: "featured",
  summary:
    "The event ticketing platform of Bitooqoh, an independent company live in Nigeria and Kenya. Organisers create events and sell tickets, attendees discover and book them, and an organiser dashboard tracks sales, attendees, check-ins and payouts.",
  context: { kind: "independent", client: "Bitooqoh" },
  period: { start: "2024", end: "present", source: { kind: "aqib", said: "2026-10" } },
  ownership: "co-built",
  role: { text: "Frontend engineer, one of a two-person team", source: { kind: "aqib", said: "2026-10" } },
  platforms: ["web"],
  stack: { items: ["Next.js", "TypeScript", "Redux", "TanStack Query", "shadcn/ui"], source: code("Bitooqoh") },
  visibility: "public",
  links: { live: "https://bitooqoh.com" },
  lithologyCode: "S1.02",
  responsibilities: [
    { text: "Integrated the frontend with backend APIs for ticket booking, authentication and payment processing.", source: site("/bitooqoh") },
    { text: "Built the organiser dashboard for tracking sales, viewing analytics and managing ticketing, and worked on event check-ins.", source: site("/bitooqoh") },
    { text: "Managed state across the platform with Redux.", source: site("/bitooqoh") },
    { text: "Handled asynchronous operations and errors between the frontend and backend services.", source: site("/bitooqoh") },
    { text: "Built it mobile-first and tested it across screen sizes and orientations.", source: site("/bitooqoh") },
  ],
  outcomes: [
    { text: "₦198M+ in ticket sales.", source: bitooqohSite },
    { text: "21K+ tickets sold.", source: bitooqohSite },
    { text: "115+ events managed.", source: bitooqohSite },
    { text: "70+ organisations onboarded.", source: bitooqohSite },
    { text: "Live in Nigeria and Kenya.", source: { kind: "aqib", said: "2026-10" } },
  ],
  media: [
    { src: bitooqohHome, alt: "Bitooqoh home page headed 'Easy Event Management Solutions for Creators' with a dashboard preview and event photos.", caption: "Home", kind: "production-screenshot" },
    { src: bitooqohDiscover, alt: "Discover events page with search by name, date and location, and a grid of event cards.", caption: "Event discovery", kind: "production-screenshot" },
    { src: bitooqohDashboard, alt: "Organiser dashboard showing amount sold, headcount, check-ins, ticket types and a ticket sales donut chart for a test event.", caption: "Organiser dashboard (test event)", kind: "production-screenshot" },
    { src: bitooqohTickets, alt: "Ticket management screen with draggable ticket cards, each showing price, sold count, slots left and an active toggle.", caption: "Ticket management (test data)", kind: "production-screenshot" },
  ],
};

export const superTravels: Project = {
  slug: "super-international-travels",
  title: "Super International Travels",
  tier: "featured",
  summary:
    "The booking platform for Super International Travels. Travellers book flights, hotels, packages, visas and insurance. Agents, partners and corporate teams work in a dashboard with approval workflows, wallets, discounts and FX rates.",
  context: { kind: "independent", client: "Super International Travels Limited" },
  period: { start: "2025-06", end: "present", source: { kind: "aqib", said: "2026-10" } },
  ownership: "built",
  platforms: ["web"],
  stack: { items: ["Next.js", "TypeScript", "Redux Toolkit", "TanStack Query", "React Hook Form", "Zod", "shadcn/ui", "TipTap"], source: code("Super International Travels") },
  visibility: "public",
  links: { live: "https://superinttravels.com/" },
  lithologyCode: "S1.03",
  responsibilities: [
    { text: "Built the booking flow for flights, hotels and packages: search and filtering, results, pricing confirmation, passenger details and payment.", source: code("Super International Travels") },
    { text: "Integrated third-party travel APIs for flight schedules, pricing and package deals.", source: site("/super") },
    { text: "Built onboarding for agents and partners, with corporate codes for business customers.", source: code("Super International Travels") },
    { text: "Built team approval workflows that move bookings from pending to approved for payment, with team management and invitations.", source: code("Super International Travels") },
    { text: "Built the back-office tools: wallets, universal and partner discounts, FX rate management, visa applications, insurance, package reservations and PNR checks.", source: code("Super International Travels") },
    { text: "Added invoice payment and a blog CMS with a rich-text editor.", source: code("Super International Travels") },
  ],
  outcomes: [],
  media: [
    { src: superHotels, alt: "Hotel search hero reading 'Find Your Perfect Hotel' over a beach photo, with a flight, hotel and package search form.", caption: "Search", kind: "production-screenshot" },
    { src: superResults, alt: "Flight search results listing airlines with prices and outbound and return times between Lagos and Abuja.", caption: "Flight results", kind: "production-screenshot" },
    { src: superFlights, alt: "Flight pricing confirmation with outbound flight details and a price summary broken down by traveller.", caption: "Pricing confirmation", kind: "production-screenshot" },
    { src: superPackages, alt: "Featured vacation packages including Zanzibar, Thailand and the Canton Fair, each with price and booking buttons.", caption: "Vacation packages", kind: "production-screenshot" },
  ],
};

export const mte: Project = {
  slug: "muslim-tech-expo",
  title: "Muslim Tech Expo",
  tier: "featured",
  summary:
    "The website of the Muslim Tech Expo, an annual event for Muslim tech professionals and entrepreneurs, rebuilt for each edition from 1.0 to 4.0. MTE Kenya, the East African expansion, is a separate build with its own identity.",
  context: { kind: "independent", client: "Muslim Tech Expo", label: "Voluntary, for Muslim Tech Expo" },
  period: { start: "2024", end: "present", source: { kind: "aqib", said: "2026-10" } },
  ownership: "built",
  platforms: ["web"],
  stack: { items: ["Next.js", "TypeScript", "Tailwind CSS", "Embla Carousel", "AOS"], source: code("Muslim Tech Expo") },
  visibility: "public",
  links: { live: "https://www.muslimtechexpo.com" },
  lithologyCode: "S1.04",
  responsibilities: [
    { text: "Rebuilt and evolved the Nigeria site across editions 1.0 to 4.0 as the event's branding and scope grew.", source: site("/mte") },
    { text: "Built MTE Kenya as a standalone site with its own branding, hero, speaker line-up and Nairobi event details.", source: site("/mte-kenya") },
    { text: "Turned designers' wireframes and prototypes into responsive, mobile-first interfaces.", source: site("/mte") },
  ],
  outcomes: [
    { text: "Four editions shipped and maintained, from MTE 1.0 onwards.", source: site("/mte") },
    { text: "Kenya's first edition, held at KICC in Nairobi.", source: site("/mte-kenya") },
  ],
  media: [
    { src: mteHero, alt: "MTE 4.0 hero reading 'Bigger and Better' with an interactive grid for exploring past editions.", caption: "MTE Nigeria, edition 4.0", kind: "production-screenshot" },
    { src: mteMerch, alt: "Merchandise pre-order section showing branded water bottles and a QR code.", caption: "Merch pre-order", kind: "production-screenshot" },
    { src: mteKenyaHero, alt: "MTE Kenya hero reading 'Adapt. Build. Lead.' over a photo of the KICC building in Nairobi.", caption: "MTE Kenya", kind: "production-screenshot" },
    { src: mteKenyaPeople, alt: "MTE Kenya section titled 'People Making It Happen' with a team group photo.", caption: "MTE Kenya team", kind: "production-screenshot" },
  ],
};
