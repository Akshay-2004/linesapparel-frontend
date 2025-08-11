import { useApi } from '@/hooks/useApi';

export interface IReview {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  imageUrls?: string[];
  verifiedBuyer: boolean;
  foundHelpful: number;
  notHelpful: number;
  createdAt: string;
}

export interface IReviewResponse {
  reviews: IReview[];
  averageRating: number;
  totalReviews: number;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface IStarDistribution {
  productId: string;
  totalReviews: number;
  averageRating: number;
  distribution: Record<string, number>;
  percentageDistribution: Record<string, number>;
  breakdown: Array<{
    stars: number;
    count: number;
    percentage: number;
  }>;
}

export interface ICreateReviewData {
  productId: string;
  rating: number;
  comment: string;
  images?: FileList | null;
}

export function useReviewService() {
  const { fetchData, loading, error, uploadProgress } = useApi<any>();
  const baseUrl = '/reviews';

  const getProductReviews = async (
    productId: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<IReviewResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page && params.page > 0) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit && params.limit > 0) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.rating) {
      queryParams.append('rating', params.rating.toString());
    }
    if (params?.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    const url = queryParams.toString() 
      ? `${baseUrl}/product/${productId}?${queryParams}` 
      : `${baseUrl}/product/${productId}`;
    
    return await fetchData(url, { 
      method: 'GET',
      timeout: 30000
    });
  };

  const getProductStarDistribution = async (productId: string): Promise<IStarDistribution> => {
    return await fetchData(`${baseUrl}/product/${productId}/distribution`, { 
      method: 'GET',
      timeout: 30000
    });
  };

  const createReview = async (reviewData: ICreateReviewData): Promise<IReview> => {
    const formData = new FormData();
    
    formData.append('productId', reviewData.productId);
    formData.append('rating', reviewData.rating.toString());
    formData.append('comment', reviewData.comment);
    
    // Add images if selected
    if (reviewData.images) {
      Array.from(reviewData.images).forEach((file) => {
        formData.append('images', file);
      });
    }

    return await fetchData(baseUrl, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000, // 1 minute for file uploads
    });
  };

  const updateReview = async (
    reviewId: string, 
    updateData: Partial<ICreateReviewData>
  ): Promise<IReview> => {
    const formData = new FormData();
    
    if (updateData.rating !== undefined) {
      formData.append('rating', updateData.rating.toString());
    }
    if (updateData.comment !== undefined) {
      formData.append('comment', updateData.comment);
    }
    
    // Add images if selected
    if (updateData.images) {
      Array.from(updateData.images).forEach((file) => {
        formData.append('images', file);
      });
    }

    return await fetchData(`${baseUrl}/${reviewId}`, {
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
  };

  const deleteReview = async (reviewId: string): Promise<void> => {
    return await fetchData(`${baseUrl}/${reviewId}`, { 
      method: 'DELETE',
      timeout: 30000
    });
  };

  const toggleHelpful = async (reviewId: string, helpful: boolean): Promise<IReview> => {
    return await fetchData(`${baseUrl}/${reviewId}/helpful`, {
      method: 'PATCH',
      data: { helpful },
      timeout: 30000
    });
  };

  const getUserReviews = async (params?: {
    page?: number;
    limit?: number;
  }): Promise<IReviewResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.page && params.page > 0) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit && params.limit > 0) {
      queryParams.append('limit', params.limit.toString());
    }

    const url = queryParams.toString() 
      ? `${baseUrl}/user/my-reviews?${queryParams}` 
      : `${baseUrl}/user/my-reviews`;
    
    return await fetchData(url, { 
      method: 'GET',
      timeout: 30000
    });
  };

  const getSingleReview = async (reviewId: string): Promise<IReview> => {
    return await fetchData(`${baseUrl}/${reviewId}`, { 
      method: 'GET',
      timeout: 30000
    });
  };

  return {
    getProductReviews,
    getProductStarDistribution,
    createReview,
    updateReview,
    deleteReview,
    toggleHelpful,
    getUserReviews,
    getSingleReview,
    loading,
    error,
    uploadProgress
  };
}
