import { useApi } from '@/hooks/useApi';

export interface PublicLegalPageData {
  title?: string;
  content?: string;
  contentType?: 'markdown' | 'text';
  markdownUrl?: string;
  lastUpdated?: string;
  effectiveDate?: string;
  contactEmail?: string;
  [key: string]: any;
}

export interface PublicLegalPage {
  _id: string;
  name: string;
  path: string;
  data: PublicLegalPageData;
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

export function usePublicLegalPagesService() {
  const { fetchData, loading, error } = useApi<any>();
  const baseUrl = '/pages/legal';

  const getLegalPageByType = async (type: string): Promise<PublicLegalPage> => {
    const response = await fetchData(`${baseUrl}/${type}`, { 
      method: 'GET',
      timeout: 30000
    });
    return response;
  };

  const getAllLegalPages = async (): Promise<PublicLegalPage[]> => {
    const response = await fetchData(baseUrl, { 
      method: 'GET',
      timeout: 30000
    });
    return response;
  };

  return {
    getLegalPageByType,
    getAllLegalPages,
    loading,
    error
  };
}
