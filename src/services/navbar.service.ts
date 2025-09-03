import { useApi } from '@/hooks/useApi';
import { INavbarData, IUpdateNavbarData, ApiResponse } from '@/types/navbar.interface';

export function useNavbarService() {
  const { fetchData, loading, error, uploadProgress } = useApi<any>();
  const baseUrl = '/pages';

  const getNavbar = async (): Promise<any> => {
    try {
      const result = await fetchData(`${baseUrl}/navbar`, { 
        method: 'GET',
        timeout: 30000 // 30 seconds for GET requests
      });
      
      console.log('Navbar API response:', result);
      return result;
    } catch (err) {
      console.error('Navbar service error:', err);
      throw err;
    }
  };

  const updateNavbar = async (navbarData: IUpdateNavbarData): Promise<any> => {
    try {
      const result = await fetchData(`${baseUrl}/navbar`, {
        method: 'PUT',
        data: navbarData,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      });
      
      console.log('Navbar update response:', result);
      return result;
    } catch (err) {
      console.error('Navbar update error:', err);
      throw err;
    }
  };

  const deleteNavbar = async (): Promise<any> => {
    try {
      const result = await fetchData(`${baseUrl}/navbar`, { 
        method: 'DELETE',
        timeout: 30000
      });
      
      console.log('Navbar delete response:', result);
      return result;
    } catch (err) {
      console.error('Navbar delete error:', err);
      throw err;
    }
  };

  return {
    getNavbar,
    updateNavbar,
    deleteNavbar,
    loading,
    error,
    uploadProgress
  };
}
