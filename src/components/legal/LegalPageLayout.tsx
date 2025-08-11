'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Mail, 
  Shield, 
  ArrowLeft,
  FileText,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { PublicLegalPage } from '@/services/public-legal-pages.service';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';

interface LegalPageLayoutProps {
  page: PublicLegalPage;
  pageTitle: string;
  isActive?: boolean;
}

export default function LegalPageLayout({ page, pageTitle, isActive = true }: LegalPageLayoutProps) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{pageTitle}</h1>
              <p className="text-lg text-gray-600 mb-6">
                This legal document is currently not available.
              </p>
              <p className="text-gray-500 mb-8">
                The {pageTitle.toLowerCase()} is being updated and will be available soon.
                Please check back later or contact us if you have any questions.
              </p>
              <div className="space-y-4">
                <Button onClick={() => router.push('/')} className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go to Homepage
                </Button>
                <Button variant="outline" onClick={() => router.push('/contact')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {page.data?.title || pageTitle}
              </h1>
              <p className="text-lg text-gray-600 mt-1">
                Legal document and terms
              </p>
            </div>
          </div>
        </div>

        {/* Legal Document Info */}
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {page.data?.effectiveDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Effective Date</p>
                    <p className="text-gray-600">{formatDate(page.data.effectiveDate)}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Last Updated</p>
                  <p className="text-gray-600">
                    {page.data?.lastUpdated 
                      ? formatDate(page.data.lastUpdated) 
                      : formatDate(page.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Content */}
        <Card className="shadow-lg mb-8">
          <CardContent className="p-8">
            {page.data?.content ? (
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal pl-6 mb-4 text-gray-700 space-y-2">{children}</ol>
                    ),
                    li: ({ children }) => (
                      <li className="leading-relaxed">{children}</li>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {page.data.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">Content Not Available</h3>
                <p className="text-gray-600">
                  The content for this legal document is currently being prepared.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Info */}
        {page.data?.contactEmail && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-gray-900">Questions about this document?</p>
                  <p className="text-gray-600">
                    Contact us at{' '}
                    <a 
                      href={`mailto:${page.data.contactEmail}`}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {page.data.contactEmail}
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
