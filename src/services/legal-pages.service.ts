import { useApi } from '@/hooks/useApi';

export interface LegalPageType {
  key: string;
  name: string;
  path: string;
}

export interface LegalPageData {
  title?: string;
  content?: string;
  contentType?: 'markdown' | 'text';
  markdownUrl?: string;
  lastUpdated?: string;
  effectiveDate?: string;
  contactEmail?: string;
  [key: string]: any;
}

export interface LegalPage {
  _id: string;
  name: string;
  path: string;
  data: LegalPageData;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    name: string;
    email: string;
  };
}

export interface UpdateLegalPageData {
  data?: LegalPageData;
  isActive?: boolean;
  markdownFile?: File; // Make optional since we might only update status
}

export function useLegalPagesService() {
  const { fetchData, loading, error } = useApi<any>();
  const baseUrl = '/pages/legal';

  const getAllLegalPages = async (): Promise<LegalPage[]> => {
    const response = await fetchData(baseUrl, { 
      method: 'GET',
      timeout: 30000
    });
    return response;
  };

  const getLegalPageTypes = async (): Promise<LegalPageType[]> => {
    const response = await fetchData(`${baseUrl}/types`, { 
      method: 'GET',
      timeout: 30000
    });
    return response;
  };

  const getLegalPageByType = async (type: string): Promise<LegalPage> => {
    const response = await fetchData(`${baseUrl}/${type}`, { 
      method: 'GET',
      timeout: 30000
    });
    return response;
  };

  const createOrUpdateLegalPage = async (type: string, data: UpdateLegalPageData): Promise<LegalPage> => {
    const formData = new FormData();
    
    // Add the data as JSON string
    if (data.data) {
      formData.append('data', JSON.stringify(data.data));
    }
    
    // Add isActive flag
    if (data.isActive !== undefined) {
      formData.append('isActive', data.isActive.toString());
    }
    
    // Add markdown file if provided
    if (data.markdownFile) {
      formData.append('markdownFile', data.markdownFile);
    }

    return await fetchData(`${baseUrl}/${type}`, {
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000 // 5 minutes for file uploads
    });
  };

  const deleteLegalPage = async (type: string): Promise<void> => {
    return await fetchData(`${baseUrl}/${type}`, { 
      method: 'DELETE',
      timeout: 30000
    });
  };

  return {
    getAllLegalPages,
    getLegalPageTypes,
    getLegalPageByType,
    createOrUpdateLegalPage,
    deleteLegalPage,
    loading,
    error
  };
}
