'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useInquiryService } from '@/services/inquiry.service';
import { IInquiry, INQUIRY_PURPOSES } from '@/types/inquiry.interface';
import { 
  Search, 
  Filter,
  Mail,
  User,
  MessageSquare,
  Calendar,
  Eye,
  CheckCircle,
  Clock,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface Filters {
  resolved: 'all' | 'resolved' | 'pending';
  purpose: string;
  search: string;
}

interface DeleteConfirmation {
  isOpen: boolean;
  inquiryId: string;
  customerName: string;
  isDeleting: boolean;
}

export default function InquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<IInquiry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    resolved: 'all',
    purpose: 'all',
    search: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    inquiryId: '',
    customerName: '',
    isDeleting: false,
  });

  const {
    getAllInquiries,
    deleteInquiry,
    loading,
    error
  } = useInquiryService();

  const limit = 9; // 9 inquiries per page

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, filters]);

  const fetchInquiries = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit,
      };

      if (filters.resolved !== 'all') {
        params.resolved = filters.resolved === 'resolved';
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const response = await getAllInquiries(params);
      
      if (response && response.inquiries) {
        setInquiries(response.inquiries);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.total || 0);
      } else {
        setInquiries([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error: any) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to fetch inquiries');
      setInquiries([]);
      setTotalPages(1);
      setTotalCount(0);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, search: searchInput }));
    setCurrentPage(1);
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      inquiryId: id,
      customerName: name,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await deleteInquiry(deleteConfirmation.inquiryId);
      toast.success('Inquiry deleted successfully');
      await fetchInquiries();
    } catch (error) {
      toast.error('Failed to delete inquiry');
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        inquiryId: '',
        customerName: '',
        isDeleting: false,
      });
    }
  };

  const handleDeleteCancel = () => {
    if (deleteConfirmation.isDeleting) return;
    
    setDeleteConfirmation({
      isOpen: false,
      inquiryId: '',
      customerName: '',
      isDeleting: false,
    });
  };

  const getStatusBadge = (resolved: boolean) => {
    return resolved ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="h-3 w-3 mr-1" />
        Resolved
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const getPurposeLabel = (purpose: string) => {
    const purposeObj = INQUIRY_PURPOSES.find(p => p.value === purpose);
    return purposeObj ? purposeObj.label : purpose;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateMessage = (message: string, maxLength: number = 150) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading && inquiries.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Customer Inquiries</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage customer inquiries and support requests ({totalCount} total)
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-gray-500">Quick Stats</div>
            <div className="flex space-x-4 text-sm">
              <span className="text-green-600 font-medium">
                {inquiries.filter(i => i.resolved).length} Resolved
              </span>
              <span className="text-yellow-600 font-medium">
                {inquiries.filter(i => !i.resolved).length} Pending
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search by Name or Email
              </Label>
              <div className="flex mt-1">
                <Input
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search customers..."
                  className="rounded-r-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch}
                  className="rounded-l-none"
                  variant="outline"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <select
                id="status-filter"
                value={filters.resolved}
                onChange={(e) => handleFilterChange('resolved', e.target.value)}
                className="mt-1 block w-full h-10 px-3 py-2 rounded-xs border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Purpose Filter */}
            <div>
              <Label htmlFor="purpose-filter" className="text-sm font-medium text-gray-700">
                Purpose
              </Label>
              <select
                id="purpose-filter"
                value={filters.purpose}
                onChange={(e) => handleFilterChange('purpose', e.target.value)}
                className="mt-1 block w-full h-10 px-3 py-2 rounded-xs border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="all">All Purposes</option>
                {INQUIRY_PURPOSES.map((purpose) => (
                  <option key={purpose.value} value={purpose.value}>
                    {purpose.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.resolved !== 'all' || filters.purpose !== 'all' || filters.search) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.resolved !== 'all' && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Status: {filters.resolved}
                </span>
              )}
              {filters.purpose !== 'all' && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Purpose: {getPurposeLabel(filters.purpose)}
                </span>
              )}
              {filters.search && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Search: "{filters.search}"
                </span>
              )}
              <button
                onClick={() => {
                  setFilters({ resolved: 'all', purpose: 'all', search: '' });
                  setSearchInput('');
                  setCurrentPage(1);
                }}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                Clear all
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiries Grid */}
      {inquiries.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
            <p className="text-gray-600">
              {filters.search || filters.resolved !== 'all' || filters.purpose !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'No customer inquiries have been submitted yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inquiries.map((inquiry) => (
            <Card key={inquiry._id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-200">
                        {inquiry.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {inquiry.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{inquiry.email}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(inquiry.resolved)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Purpose */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Purpose:</span>
                  <Badge variant="outline" className="text-xs">
                    {getPurposeLabel(inquiry.purpose)}
                  </Badge>
                </div>

                {/* Message Preview */}
                <div>
                  <span className="text-sm font-medium text-gray-700">Message:</span>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                    {truncateMessage(inquiry.message)}
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  <span>Submitted {formatDate(inquiry.createdAt)}</span>
                </div>

                {/* Resolution Info */}
                {inquiry.resolved && inquiry.resolvedBy && (
                  <div className="text-xs text-green-600 bg-green-50 p-2 rounded-md">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>Resolved by {inquiry.resolvedBy.name}</span>
                    </div>
                    {inquiry.resolvedAt && (
                      <div className="mt-1 text-green-500">
                        on {formatDate(inquiry.resolvedAt)}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(inquiry._id, inquiry.name)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>

                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => router.push(`/dashboard/inquiries/${inquiry._id}`)}
                    className="flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmation.customerName}'s</span> inquiry? 
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone and will permanently remove the inquiry and any resolution messages.
              </p>
              
              {deleteConfirmation.isDeleting && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-700">Deleting inquiry...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                disabled={deleteConfirmation.isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmation.isDeleting}
              >
                {deleteConfirmation.isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Inquiry
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} inquiries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => setCurrentPage(page)}
                  className="w-10"
                >
                  {page}
                </Button>
              );
            })}

            {totalPages > 5 && currentPage < totalPages - 2 && (
              <>
                <span className="px-2 text-gray-500">...</span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-10"
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
