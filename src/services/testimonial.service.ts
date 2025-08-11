import { useApi } from '@/hooks/useApi';
import { ITestimonial, ITestimonialFormData, TestimonialsResponse } from '@/types/testimonial.interface';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useTestimonialService() {
  const { fetchData, loading, error, uploadProgress } = useApi<any>();
  const baseUrl = '/testimonials';

  const getAllTestimonials = async (params?: {
    published?: boolean;
    page?: number;
    limit?: number;
    stars?: number;
    search?: string;
  }): Promise<TestimonialsResponse> => {
    const queryParams = new URLSearchParams();
    
    // Only add params if they have valid values
    if (params?.published !== undefined) {
      queryParams.append('published', params.published.toString());
    }
    if (params?.page && params.page > 0) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit && params.limit > 0) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.stars && params.stars > 0) {
      queryParams.append('stars', params.stars.toString());
    }
    if (params?.search && params.search.trim()) {
      queryParams.append('search', params.search.trim());
    }

    const url = queryParams.toString() ? `${baseUrl}?${queryParams}` : baseUrl;
    
    // The API returns the data directly, not wrapped in a success/data structure
    const response = await fetchData(url, { 
      method: 'GET',
      timeout: 30000
    });
    
    // Return the response directly since it already contains { testimonials, pagination }
    return response;
  };

  const getTestimonial = async (id: string): Promise<any> => {
    return await fetchData(`${baseUrl}/${id}`, { 
      method: 'GET',
      timeout: 30000
    });
  };

  const createTestimonial = async (formData: FormData): Promise<any> => {
    return await fetchData(baseUrl, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes for file uploads
    });
  };

  const updateTestimonial = async (id: string, formData: FormData): Promise<any> => {
    return await fetchData(`${baseUrl}/${id}`, {
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes for file uploads
    });
  };

  const deleteTestimonial = async (id: string): Promise<any> => {
    return await fetchData(`${baseUrl}/${id}`, { 
      method: 'DELETE',
      timeout: 30000
    });
  };

  const togglePublishStatus = async (id: string, published: boolean): Promise<any> => {
    return await fetchData(`${baseUrl}/${id}/publish`, {
      method: 'PATCH',
      data: { published },
      timeout: 30000
    });
  };

  const createFormData = (data: ITestimonialFormData, imageFile?: File): FormData => {
    const formData = new FormData();
    
    // Add form fields
    formData.append('name', data.name);
    formData.append('stars', data.stars.toString());
    formData.append('quote', data.quote);
    formData.append('occupation', data.occupation);
    formData.append('location', data.location);
    formData.append('published', data.published.toString());
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return formData;
  };

  return {
    getAllTestimonials,
    getTestimonial,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    togglePublishStatus,
    createFormData,
    loading,
    error,
    uploadProgress
  };
}
