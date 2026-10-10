"use client";

import { create } from "zustand";

type SeamState = {
  /** Fraction of the viewport, measured from the bottom, showing the substrate. 0 = closed. */
  substrate: number;
  panelOpen: boolean;
  /** The overlay and panel chunks are fetched the first time the seam is used. */
  engaged: boolean;
  selectedIndex: number | null;
  setSubstrate: (value: number) => void;
  toggle: () => void;
  setPanel: (open: boolean) => void;
  select: (index: number | null) => void;
};

export const SEAM_MAX = 0.96;
export const SEAM_DEFAULT = 0.5;

export const useSeam = create<SeamState>((set, get) => ({
  substrate: 0,
  panelOpen: false,
  engaged: false,
  selectedIndex: null,
  setSubstrate: (value) => {
    const v = value < 0.03 ? 0 : Math.min(SEAM_MAX, value);
    set({ substrate: v, engaged: get().engaged || v > 0 });
  },
  toggle: () => {
    const open = get().substrate > 0;
    set({ substrate: open ? 0 : SEAM_DEFAULT, engaged: true });
  },
  setPanel: (open) => set({ panelOpen: open, engaged: get().engaged || open }),
  select: (index) => set({ selectedIndex: index }),
}));
