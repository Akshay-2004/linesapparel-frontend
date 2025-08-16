import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/hooks/useApi";

export interface WishlistItem {
  productId: string;
  title: string;
  price: string;
  image: string;
  handle: string;
  addedAt: string;
}

interface WishlistStore {
  wishlist: WishlistItem[];
  wishlisted: string[];
  loading: boolean;
  error: string | null;
  fetchWishlist: (userId: string) => Promise<void>;
  addToWishlist: (userId: string, productId: string) => Promise<void>;
  removeFromWishlist: (userId: string, productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlist: [],
      wishlisted: [],
      loading: false,
      error: null,

      fetchWishlist: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.get(`/users/${userId}/wishlist`);
          const data = res.data.data;
          set({ 
            wishlist: data.wishlistItems || [], 
            wishlisted: data.wishlisted || [],
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to fetch wishlist", 
            loading: false 
          });
        }
      },

      addToWishlist: async (userId: string, productId: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post(`/users/${userId}/wishlist`, { productId });
          const data = res.data.data;
          set({ 
            wishlist: data.wishlistItems || [], 
            wishlisted: data.wishlisted || [],
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to add to wishlist", 
            loading: false 
          });
          throw error;
        }
      },

      removeFromWishlist: async (userId: string, productId: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.delete(`/users/${userId}/wishlist/${productId}`);
          const data = res.data.data;
          set({ 
            wishlist: data.wishlistItems || [], 
            wishlisted: data.wishlisted || [],
            loading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || "Failed to remove from wishlist", 
            loading: false 
          });
          throw error;
        }
      },

      isInWishlist: (productId: string) => {
        const { wishlisted } = get();
        return wishlisted.includes(productId);
      },

      clearWishlist: () => {
        set({ wishlist: [], wishlisted: [], error: null });
      },
    }),
    {
      name: "wishlist-store",
      partialize: (state) => ({
        wishlist: state.wishlist,
        wishlisted: state.wishlisted,
      }),
    }
  )
);
