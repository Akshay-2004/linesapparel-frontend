'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePublicLegalPagesService, PublicLegalPage } from '@/services/public-legal-pages.service';
import { 
  FileText, 
  ArrowRight, 
  Calendar, 
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function LegalPagesIndex() {
  const [legalPages, setLegalPages] = useState<PublicLegalPage[]>([]);
  const { getAllLegalPages, loading, error } = usePublicLegalPagesService();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const pages = await getAllLegalPages();
        setLegalPages(pages);
      } catch (error: any) {
        console.error('Error fetching legal pages:', error);
      }
    };

    fetchPages();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPageSlug = (path: string) => {
    return path.replace('/legal/', '');
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Available
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="h-3 w-3 mr-1" />
        Unavailable
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading legal documents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Legal Documents
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our legal documents outline the terms, policies, and procedures that govern your use of our services.
            Please review these documents carefully.
          </p>
        </div>

        {error && (
          <Card className="shadow-lg mb-8 border-red-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <div>
                  <h3 className="text-lg font-medium text-red-900">Unable to Load Legal Documents</h3>
                  <p className="text-red-700 mt-1">
                    {error || 'There was an error loading the legal documents. Please try again later.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Legal Documents Grid */}
        {legalPages.length === 0 && !loading ? (
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-medium text-gray-900 mb-4">No Legal Documents Available</h3>
              <p className="text-gray-600">
                Legal documents are currently being prepared and will be available soon.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalPages.map((page) => (
              <Card key={page._id} className={`shadow-lg hover:shadow-xl transition-shadow ${
                !page.isActive ? 'opacity-75' : ''
              }`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          page.isActive 
                            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
                            : 'bg-gray-400'
                        }`}>
                          <FileText className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg text-gray-900 truncate">
                          {page.data?.title || page.name}
                        </CardTitle>
                      </div>
                    </div>
                    {getStatusBadge(page.isActive)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Document Info */}
                  <div className="space-y-2">
                    {page.data?.effectiveDate && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>Effective: {formatDate(page.data.effectiveDate)}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Shield className="h-3 w-3" />
                      <span>Updated: {formatDate(page.updatedAt)}</span>
                    </div>
                  </div>

                  {/* Content Preview */}
                  {page.data?.content && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700 line-clamp-3">
                        {page.data.content.replace(/[#*`]/g, '').substring(0, 120)}...
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="pt-4 border-t">
                    {page.isActive ? (
                      <Link href={`/legal/${getPageSlug(page.path)}`}>
                        <Button className="w-full flex items-center justify-center">
                          Read Document
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full">
                        Document Unavailable
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <Card className="shadow-lg mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-4">Questions About Our Legal Documents?</h3>
            <p className="text-gray-600 mb-6">
              If you have any questions about our legal documents or need clarification on any terms,
              please don't hesitate to contact us.
            </p>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
