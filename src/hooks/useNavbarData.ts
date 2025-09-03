import { useState, useEffect } from 'react';
import { INavbarData } from '@/types/navbar.interface';
import { useNavbarService } from '@/services/navbar.service';

export function useNavbarData() {
  const [navbarData, setNavbarData] = useState<INavbarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getNavbar } = useNavbarService();

  const fetchNavbarData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getNavbar();
      
      console.log('UseNavbarData - Raw response:', response);
      
      // The useApi hook returns the data directly, not wrapped in success/data
      if (response && response.navItems) {
        console.log('UseNavbarData - Setting navbar data:', response);
        setNavbarData(response);
      } else {
        // Handle the case where response has success/data structure
        if (response && response.success && response.data) {
          console.log('UseNavbarData - Setting navbar data from success wrapper:', response.data);
          setNavbarData(response.data);
        } else {
          console.log('UseNavbarData - No valid navbar data found, using fallback');
          setError(response?.message || 'Failed to fetch navbar data');
        }
      }
    } catch (err) {
      console.error('UseNavbarData - Fetch error:', err);
      setError('Failed to fetch navbar data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavbarData();
  }, []);

  return {
    navbarData,
    loading,
    error,
    refetch: fetchNavbarData
  };
}
