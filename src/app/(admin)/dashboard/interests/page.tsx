'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { useInterestService, Interest } from '@/services/interest.service';
import * as XLSX from 'xlsx';
import {
  Search,
  Download,
  Mail,
  User,
  Calendar,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface DeleteConfirmation {
  isOpen: boolean;
  interestId: string;
  email: string;
  isDeleting: boolean;
}

export default function InterestsPage() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    interestId: '',
    email: '',
    isDeleting: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const {
    getAllInterests,
    deleteInterest,
    loading,
    error
  } = useInterestService();

  const limit = 10; // 10 interests per page

  useEffect(() => {
    fetchInterests();
  }, [currentPage, search]);

  const fetchInterests = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await getAllInterests(params);

      if (response && response.interests) {
        setInterests(response.interests);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.total || 0);
      } else {
        setInterests([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error: any) {
      console.error('Error fetching interests:', error);
      toast.error('Failed to fetch interests');
      setInterests([]);
      setTotalPages(1);
      setTotalCount(0);
    }
  };

  const handleSearch = () => {
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleDeleteClick = (id: string, email: string) => {
    setDeleteConfirmation({
      isOpen: true,
      interestId: id,
      email,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));

    try {
      await deleteInterest(deleteConfirmation.interestId);
      toast.success('Interest deleted successfully');
      await fetchInterests();
    } catch (error) {
      toast.error('Failed to delete interest');
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        interestId: '',
        email: '',
        isDeleting: false,
      });
    }
  };

  const handleDeleteCancel = () => {
    if (deleteConfirmation.isDeleting) return;

    setDeleteConfirmation({
      isOpen: false,
      interestId: '',
      email: '',
      isDeleting: false,
    });
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      // Fetch all interests without pagination for export
      const response = await getAllInterests({ limit: 10000 }); // Large limit to get all

      if (!response || !response.interests) {
        toast.error('No interests found to export');
        return;
      }

      // Create Excel data
      const data = response.interests.map((interest, index) => ({
        '#': index + 1,
        'Email': interest.email,
        'Registration Date': new Date(interest.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }));

      // Create and download Excel file
      await downloadExcel(data, `interests_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Excel file downloaded successfully');
    } catch (error) {
      console.error('Error exporting interests:', error);
      toast.error('Failed to export interests');
    } finally {
      setIsExporting(false);
    }
  };

  const downloadExcel = async (data: any[], filename: string) => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const colWidths = [
      { wch: 5 },  // #
      { wch: 35 }, // Email
      { wch: 25 }, // Registration Date
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Interests');

    // Generate and download the file
    XLSX.writeFile(wb, filename);
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

  if (loading && interests.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900">Customer Interests</h1>
          <p className="text-sm sm:text-lg text-gray-600 mt-2">
            Manage customer interest registrations ({totalCount} total)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleExportExcel}
            disabled={isExporting || totalCount === 0}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Export Excel
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Search className="h-5 w-5 mr-2" />
            Search Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search by Email
              </Label>
              <div className="flex mt-1">
                <Input
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search emails..."
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
          </div>

          {/* Active Search Display */}
          {search && (
            <div className="flex items-center gap-2 pt-2 border-t mt-4">
              <span className="text-sm text-gray-600">Searching for:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                "{search}"
              </span>
              <button
                onClick={() => {
                  setSearch('');
                  setSearchInput('');
                  setCurrentPage(1);
                }}
                className="text-blue-600 hover:text-blue-800 text-xs underline"
              >
                Clear search
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests List */}
      {interests.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No interests found</h3>
            <p className="text-gray-600">
              {search
                ? 'Try adjusting your search terms.'
                : 'No customer interests have been registered yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interests.map((interest) => (
            <Card key={interest._id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <Mail className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {interest.email}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="h-3 w-3" />
                      <span>Interest Registered</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Registration Date */}
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Registered {formatDate(interest.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(interest._id, interest.email)}
                    className="flex items-center"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
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
                Are you sure you want to delete the interest registration for{' '}
                <span className="font-semibold text-gray-900">{deleteConfirmation.email}</span>?
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone and will permanently remove the interest registration.
              </p>

              {deleteConfirmation.isDeleting && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-700">Deleting interest...</span>
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
                    Delete Interest
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} interests
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