'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ContentLoader } from '@/components/shared/Loader';
import { toast } from 'sonner';
import { useInquiryService } from '@/services/inquiry.service';
import { IInquiry, INQUIRY_PURPOSES } from '@/types/inquiry.interface';
import { 
  ArrowLeft,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  User,
  AlertCircle,
  Save
} from 'lucide-react';

export default function InquiryDetailPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = params.id as string;

  const [inquiry, setInquiry] = useState<IInquiry | null>(null);
  const [resolvingMessage, setResolvingMessage] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const {
    getInquiry,
    resolveInquiry,
    unresolveInquiry,
    loading,
    error
  } = useInquiryService();

  useEffect(() => {
    if (inquiryId) {
      loadInquiry();
    }
  }, [inquiryId]);

  const loadInquiry = async () => {
    try {
      setIsLoading(true);
      const response = await getInquiry(inquiryId);
      
      if (response) {
        setInquiry(response);
      }
    } catch (error: any) {
      console.error('Failed to load inquiry:', error);
      toast.error('Failed to load inquiry details');
      router.push('/dashboard/inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!resolvingMessage.trim()) {
      toast.error('Please enter a resolution message');
      return;
    }

    setIsResolving(true);
    try {
      await resolveInquiry(inquiryId, { resolvingMessage: resolvingMessage.trim() });
      toast.success('Inquiry resolved successfully');
      await loadInquiry(); // Reload to get updated data
      setResolvingMessage('');
    } catch (error: any) {
      toast.error('Failed to resolve inquiry');
    } finally {
      setIsResolving(false);
    }
  };

  const handleUnresolve = async () => {
    try {
      await unresolveInquiry(inquiryId);
      toast.success('Inquiry marked as unresolved');
      await loadInquiry(); // Reload to get updated data
    } catch (error: any) {
      toast.error('Failed to unresolve inquiry');
    }
  };

  const getPurposeLabel = (purpose: string) => {
    const purposeObj = INQUIRY_PURPOSES.find(p => p.value === purpose);
    return purposeObj ? purposeObj.label : purpose;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8 max-w-4xl">
        <ContentLoader text="Loading inquiry details..." />
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="container mx-auto p-6 space-y-8 max-w-4xl">
        <Card className="shadow-lg border-red-200">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-900 mb-2">Inquiry Not Found</h3>
            <p className="text-red-600 mb-4">
              The inquiry you're looking for doesn't exist or has been deleted.
            </p>
            <Button onClick={() => router.push('/dashboard/inquiries')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inquiries
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push('/dashboard/inquiries')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Inquiries
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Inquiry Details</h1>
            <p className="text-lg text-gray-600 mt-2">
              Customer support inquiry from {inquiry.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {inquiry.resolved ? (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              <CheckCircle className="h-3 w-3 mr-1" />
              Resolved
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
              <Clock className="h-3 w-3 mr-1" />
              Pending Resolution
            </Badge>
          )}
        </div>
      </div>

      {/* Customer Information */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-2xl font-bold text-gray-900">Customer Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-gray-200 text-lg font-bold">
                {inquiry.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Customer Name</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">{inquiry.name}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Email Address</span>
                  </div>
                  <p className="text-lg text-gray-900">{inquiry.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Inquiry Purpose</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getPurposeLabel(inquiry.purpose)}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Submitted On</span>
                  </div>
                  <p className="text-gray-900">{formatDate(inquiry.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Message */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900">Customer Message</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-blue-500">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {inquiry.message}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resolution Section */}
      {inquiry.resolved ? (
        <Card className="shadow-lg border-green-200">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-xl font-bold text-green-900 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Resolution Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <div className="mb-4">
                <span className="text-sm font-medium text-green-700">Resolution Message:</span>
              </div>
              <p className="text-green-800 leading-relaxed whitespace-pre-wrap">
                {inquiry.resolvingMessage}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <span className="text-sm font-medium text-gray-700">Resolved By:</span>
                <p className="text-gray-900 font-semibold">
                  {inquiry.resolvedBy?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Resolved On:</span>
                <p className="text-gray-900">
                  {inquiry.resolvedAt ? formatDate(inquiry.resolvedAt) : 'Unknown'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button 
                variant="outline"
                onClick={handleUnresolve}
                className="flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                Mark as Unresolved
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-yellow-200">
          <CardHeader className="bg-yellow-50">
            <CardTitle className="text-xl font-bold text-yellow-900 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Resolve Inquiry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <Label htmlFor="resolution" className="text-sm font-medium text-gray-700">
                Resolution Message *
              </Label>
              <Textarea
                id="resolution"
                value={resolvingMessage}
                onChange={(e) => setResolvingMessage(e.target.value)}
                placeholder="Enter your resolution message for the customer..."
                className="mt-1 min-h-[120px]"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Provide a detailed response explaining how the inquiry has been addressed.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-4">
              <Button 
                variant="outline"
                onClick={() => router.push('/dashboard/inquiries')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleResolve}
                disabled={isResolving || !resolvingMessage.trim()}
                className="flex items-center"
              >
                {isResolving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Resolving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Resolve Inquiry
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
