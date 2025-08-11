'use client';

import React, { useState, useEffect } from 'react';
import { usePublicLegalPagesService, PublicLegalPage } from '@/services/public-legal-pages.service';
import LegalPageLayout from '@/components/legal/LegalPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function TermsOfServicePage() {
  const [page, setPage] = useState<PublicLegalPage | null>(null);
  const [isPageActive, setIsPageActive] = useState(true);
  const { getLegalPageByType, loading, error } = usePublicLegalPagesService();

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const pageData = await getLegalPageByType('terms-of-service');
        setPage(pageData);
        setIsPageActive(pageData.isActive);
      } catch (error: any) {
        console.error('Error fetching terms of service:', error);
      }
    };

    fetchPage();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading terms of service...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
              <p className="text-lg text-gray-600 mb-6">
                Unable to load the terms of service at this time.
              </p>
              <p className="text-gray-500">
                {error || 'The terms of service document could not be found. Please try again later.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <LegalPageLayout 
      page={page} 
      pageTitle="Terms of Service" 
      isActive={isPageActive}
    />
  );
}
