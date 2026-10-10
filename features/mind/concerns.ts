import type { Concern } from "@/content/types";

/** The layers of Mind, top to bottom. Shared by the server page and the client section. */
export const CONCERNS: { id: Concern; label: string }[] = [
  { id: "product", label: "Product" },
  { id: "ux", label: "UX" },
  { id: "architecture", label: "Architecture" },
  { id: "state", label: "State" },
  { id: "performance", label: "Performance" },
  { id: "accessibility", label: "Accessibility" },
  { id: "security", label: "Security" },
  { id: "scale", label: "Scale" },
  { id: "business", label: "Business" },
];
