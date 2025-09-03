import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/hooks/useApi";

export interface WishlistItem {
  id: string;
  title: string;
  handle: string;
  price: string;
  compareAtPrice?: string;
  image: string;
  available: boolean;
}

interface WishlistStore {
  items: WishlistItem[];
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
      items: [],
      wishlisted: [],
      loading: false,
      error: null,

      fetchWishlist: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.get(`/users/${userId}/wishlist`);
          console.log('Wishlist API response:', res.data);
          
          if (res.data && res.data.success && res.data.data) {
            set({ 
              items: res.data.data.wishlistItems || [],
              wishlisted: res.data.data.wishlisted || [],
              loading: false 
            });
          } else {
            console.error('Unexpected wishlist response structure:', res.data);
            set({ loading: false });
          }
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || error.message || "Failed to fetch wishlist", 
            loading: false 
          });
        }
      },

      addToWishlist: async (userId: string, productId: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.post(`/users/${userId}/wishlist`, { productId });
          console.log('Add to wishlist response:', res.data);
          
          if (res.data && res.data.success && res.data.data) {
            set({ 
              items: res.data.data.wishlistItems || [],
              wishlisted: res.data.data.wishlisted || [],
              loading: false 
            });
          } else {
            set({ loading: false });
          }
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || error.message || "Failed to add to wishlist", 
            loading: false 
          });
          throw error;
        }
      },

      removeFromWishlist: async (userId: string, productId: string) => {
        set({ loading: true, error: null });
        try {
          const res = await api.delete(`/users/${userId}/wishlist/${productId}`);
          console.log('Remove from wishlist response:', res.data);
          
          if (res.data && res.data.success && res.data.data) {
            set({ 
              items: res.data.data.wishlistItems || [],
              wishlisted: res.data.data.wishlisted || [],
              loading: false 
            });
          } else {
            set({ loading: false });
          }
        } catch (error: any) {
          set({ 
            error: error.response?.data?.message || error.message || "Failed to remove from wishlist", 
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
        set({ items: [], wishlisted: [], error: null });
      },
    }),
    {
      name: "wishlist-store",
      partialize: (state) => ({
        items: state.items,
        wishlisted: state.wishlisted,
      }),
    }
  )
);
