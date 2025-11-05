import { useApi } from '@/hooks/useApi';

export interface ITextBanner {
  _id: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITextBannerResponse {
  textBanners: ITextBanner[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ITextBannerSingleResponse {
  success: boolean;
  data: ITextBanner;
  message?: string;
}

export interface ITextBannerCreateResponse {
  success: boolean;
  data: ITextBanner;
  message: string;
}

export interface ITextBannerUpdateResponse {
  success: boolean;
  data: ITextBanner;
  message: string;
}

export interface ITextBannerDeleteResponse {
  success: boolean;
  message: string;
}

export interface ITextBannerToggleResponse {
  success: boolean;
  data: ITextBanner;
  message: string;
}

export interface ITextBannerCreate {
  content: string;
  isActive?: boolean;
}

export interface ITextBannerUpdate {
  content?: string;
  isActive?: boolean;
}

export interface ITextBannerActiveResponse {
  success: boolean;
  data: ITextBanner[];
}

export const useTextBannerService = () => {
  const { fetchData } = useApi();

  const getAllTextBanners = async (page = 1, limit = 10, search = ''): Promise<ITextBannerResponse> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });

      const response = await fetchData(
        `/text-banners?${params}`,
        {
          method: 'GET',
        }
      );

      return response as ITextBannerResponse;
    } catch (error) {
      console.error('Error fetching text banners:', error);
      throw error;
    }
  };

  const getActiveTextBanners = async (): Promise<ITextBanner[]> => {
    try {
      const response = await fetchData(
        '/text-banners/active',
        {
          method: 'GET',
        }
      );

      return response as ITextBanner[];
    } catch (error) {
      console.error('Error fetching active text banners:', error);
      throw error;
    }
  };

  const getTextBanner = async (id: string): Promise<ITextBanner> => {
    try {
      const response = await fetchData(
        `/text-banners/${id}`,
        {
          method: 'GET',
        }
      );

      return response as ITextBanner;
    } catch (error) {
      console.error('Error fetching text banner:', error);
      throw error;
    }
  };

  const createTextBanner = async (data: ITextBannerCreate): Promise<ITextBanner> => {
    try {
      const response = await fetchData(
        '/text-banners',
        {
          method: 'POST',
          data,
        }
      );

      return response as ITextBanner;
    } catch (error) {
      console.error('Error creating text banner:', error);
      throw error;
    }
  };

  const updateTextBanner = async (id: string, data: ITextBannerUpdate): Promise<ITextBanner> => {
    try {
      const response = await fetchData(
        `/text-banners/${id}`,
        {
          method: 'PUT',
          data,
        }
      );

      return response as ITextBanner;
    } catch (error) {
      console.error('Error updating text banner:', error);
      throw error;
    }
  };

  const deleteTextBanner = async (id: string): Promise<ITextBannerDeleteResponse> => {
    try {
      const response = await fetchData(
        `/text-banners/${id}`,
        {
          method: 'DELETE',
        }
      );

      return response as ITextBannerDeleteResponse;
    } catch (error) {
      console.error('Error deleting text banner:', error);
      throw error;
    }
  };

  const toggleTextBannerStatus = async (id: string): Promise<ITextBanner> => {
    try {
      const response = await fetchData(
        `/text-banners/${id}/toggle-status`,
        {
          method: 'PATCH',
        }
      );

      return response as ITextBanner;
    } catch (error) {
      console.error('Error toggling text banner status:', error);
      throw error;
    }
  };

  return {
    getAllTextBanners,
    getActiveTextBanners,
    getTextBanner,
    createTextBanner,
    updateTextBanner,
    deleteTextBanner,
    toggleTextBannerStatus,
  };
};