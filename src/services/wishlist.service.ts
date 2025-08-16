import { useApi } from '@/hooks/useApi';

export interface WishlistItem {
  productId: string;
  title: string;
  price: string;
  image: string;
  handle: string;
  addedAt: string;
}

export interface WishlistResponse {
  wishlisted: string[];
  wishlistItems: WishlistItem[];
}

export function useWishlistService() {
  const { fetchData, loading, error } = useApi<any>();

  const getUserWishlist = async (userId: string): Promise<WishlistResponse> => {
    return await fetchData(`/users/${userId}/wishlist`, { 
      method: 'GET',
      timeout: 30000
    });
  };

  const addToWishlist = async (userId: string, productId: string): Promise<WishlistResponse> => {
    return await fetchData(`/users/${userId}/wishlist`, {
      method: 'POST',
      data: { productId },
      timeout: 30000
    });
  };

  const removeFromWishlist = async (userId: string, productId: string): Promise<WishlistResponse> => {
    return await fetchData(`/users/${userId}/wishlist/${productId}`, {
      method: 'DELETE',
      timeout: 30000
    });
  };

  return {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    loading,
    error
  };
}
