import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BuyNowState {
  variantId: string | null;
  quantity: number;
  setBuyNow: (variantId: string, quantity: number) => void;
  clearBuyNow: () => void;
}

export const useBuyNowStore = create<BuyNowState>()(
  persist(
    (set) => ({
      variantId: null,
      quantity: 1,
      setBuyNow: (variantId, quantity) => set({ variantId, quantity }),
      clearBuyNow: () => set({ variantId: null, quantity: 1 }),
    }),
    {
      name: "buy-now-store", // unique name for storage key
    }
  )
);
