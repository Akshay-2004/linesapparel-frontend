import { create } from "zustand";
import { api } from "@/hooks/useApi";

interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
  price: number;
  title: string;
}

interface Cart {
  items: CartItem[];
  totalPrice: number;
}

interface CartStore {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (item: CartItem) => Promise<void>;
  updateCartItem: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (variantId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/cart");
      set({ cart: res.data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch cart", loading: false });
    }
  },

  addToCart: async (item) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/cart/add", item);
      set({ cart: res.data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to add to cart", loading: false });
    }
  },

  updateCartItem: async (variantId, quantity) => {
    set({ loading: true, error: null });
    try {
      const res = await api.put(`/cart/update/${variantId}`, {
        quantity,
      });
      set({ cart: res.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to update cart item",
        loading: false,
      });
    }
  },

  removeFromCart: async (variantId) => {
    set({ loading: true, error: null });
    try {
      const res = await api.delete(`/cart/remove/${variantId}`);
      set({ cart: res.data.data, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to remove cart item",
        loading: false,
      });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.delete("/cart/clear");
      set({ cart: res.data.data, loading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to clear cart", loading: false });
    }
  },
}));
