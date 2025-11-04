import { useApi } from '@/hooks/useApi';

export interface Interest {
  _id: string;
  email: string;
  createdAt: string;
}

export interface InterestsResponse {
  interests: Interest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateInterestData {
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useInterestService() {
  const { fetchData, loading, error } = useApi<any>();
  const baseUrl = '/interests';

  const createInterest = async (data: CreateInterestData): Promise<Interest> => {
    return await fetchData(baseUrl, {
      method: 'POST',
      data,
      timeout: 30000
    });
  };

  const getAllInterests = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<InterestsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.page && params.page > 0) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit && params.limit > 0) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }

    const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;

    const response = await fetchData(url, {
      method: 'GET',
      timeout: 30000
    });

    return response;
  };

  const deleteInterest = async (id: string): Promise<ApiResponse<null>> => {
    return await fetchData(`${baseUrl}/${id}`, {
      method: 'DELETE',
      timeout: 30000
    });
  };

  return {
    createInterest,
    getAllInterests,
    deleteInterest,
    loading,
    error
  };
}