import { useApi } from '@/hooks/useApi';
import { IInquiry, IInquiryFormData, IInquiryResolution, InquiriesResponse, InquiryStats } from '@/types/inquiry.interface';

export function useInquiryService() {
  const { fetchData, loading, error } = useApi<any>();
  const baseUrl = '/inquiries';

  const getAllInquiries = async (params?: {
    resolved?: boolean;
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<InquiriesResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params?.resolved !== undefined) {
      queryParams.append('resolved', params.resolved.toString());
    }
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

  const getInquiry = async (id: string): Promise<IInquiry> => {
    return await fetchData(`${baseUrl}/${id}`, { 
      method: 'GET',
      timeout: 30000
    });
  };

  const createInquiry = async (data: IInquiryFormData): Promise<IInquiry> => {
    try {
      const response = await fetchData(baseUrl, {
        method: 'POST',
        data: {
          name: data.name,
          email: data.email,
          purpose: data.purpose,
          message: data.message
        },
        timeout: 30000
      });
      
      if (!response) {
        throw new Error('No response received from server');
      }
      
      return response;
    } catch (error) {
      console.error('Error in createInquiry service:', error);
      throw error; // Re-throw to let the component handle it
    }
  };

  const resolveInquiry = async (id: string, data: IInquiryResolution): Promise<IInquiry> => {
    return await fetchData(`${baseUrl}/${id}/resolve`, {
      method: 'PATCH',
      data,
      timeout: 30000
    });
  };

  const unresolveInquiry = async (id: string): Promise<IInquiry> => {
    return await fetchData(`${baseUrl}/${id}/unresolve`, {
      method: 'PATCH',
      timeout: 30000
    });
  };

  const deleteInquiry = async (id: string): Promise<void> => {
    return await fetchData(`${baseUrl}/${id}`, { 
      method: 'DELETE',
      timeout: 30000
    });
  };

  const getInquiryStats = async (): Promise<InquiryStats> => {
    return await fetchData(`${baseUrl}/stats`, { 
      method: 'GET',
      timeout: 30000
    });
  };

  return {
    getAllInquiries,
    getInquiry,
    createInquiry,
    resolveInquiry,
    unresolveInquiry,
    deleteInquiry,
    getInquiryStats,
    loading,
    error
  };
}
