import { useApi } from '@/hooks/useApi';
import { IHomepageData } from '@/types/homepage.interface';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export function useHomepageService() {
  const { fetchData, loading, error, uploadProgress } = useApi<any>();
  const baseUrl = '/pages';

  const getHomepage = async (): Promise<any> => {
    return await fetchData(`${baseUrl}/homepage`, { 
      method: 'GET',
      timeout: 30000 // 30 seconds for GET requests
    });
  };

  const createHomepage = async (formData: FormData): Promise<any> => {
    return await fetchData(`${baseUrl}/homepage`, {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 600000, // 10 minutes for file uploads
    });
  };

  const updateHomepage = async (formData: FormData): Promise<any> => {
    return await fetchData(`${baseUrl}/homepage`, {
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 600000, // 10 minutes for file uploads
    });
  };

  const deleteHomepage = async (): Promise<any> => {
    return await fetchData(`${baseUrl}/homepage`, { 
      method: 'DELETE',
      timeout: 30000
    });
  };

  const createFormData = (data: IHomepageData, files: Record<string, File[]>): FormData => {
    const formData = new FormData();
    
    // Add JSON data
    formData.append('data', JSON.stringify(data));
    
    // Add files
    Object.entries(files).forEach(([fieldName, fileList]) => {
      fileList.forEach((file) => {
        formData.append(fieldName, file);
      });
    });
    
    return formData;
  };

  return {
    getHomepage,
    createHomepage,
    updateHomepage,
    deleteHomepage,
    createFormData,
    loading,
    error,
    uploadProgress
  };
}

// Keep the static class for backward compatibility
export class HomepageService {
  static createFormData(data: IHomepageData, files: Record<string, File[]>): FormData {
    const formData = new FormData();
    
    // Add JSON data
    formData.append('data', JSON.stringify(data));
    
    // Add files
    Object.entries(files).forEach(([fieldName, fileList]) => {
      fileList.forEach((file) => {
        formData.append(fieldName, file);
      });
    });
    
    return formData;
  }
}
