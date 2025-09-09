'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTestimonialService } from '@/services/testimonial.service';
import { ITestimonial } from '@/types/testimonial.interface';
import {
  Plus,
  Search,
  Star,
  MapPin,
  Briefcase,
  Edit,
  Trash2,
  Filter,
  User,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

interface Filters {
  published: 'all' | 'published' | 'draft';
  stars: 'all' | '5' | '4' | '3' | '2' | '1';
  search: string;
}

interface DeleteConfirmation {
  isOpen: boolean;
  testimonialId: string;
  testimonialName: string;
  isDeleting: boolean;
}

export default function TestimonialsPage() {
  const router = useRouter();
  const [testimonials, setTestimonials] = useState<ITestimonial[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<Filters>({
    published: 'all',
    stars: 'all',
    search: '',
  });
  const [searchInput, setSearchInput] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    testimonialId: '',
    testimonialName: '',
    isDeleting: false,
  });

  const {
    getAllTestimonials,
    deleteTestimonial,
    togglePublishStatus,
    loading,
    error
  } = useTestimonialService();

  const limit = 9; // 9 testimonials per page

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, filters]);

  const fetchTestimonials = async () => {
    try {
      const params: any = {
        page: currentPage,
        limit,
      };

      if (filters.published !== 'all') {
        params.published = filters.published === 'published';
      }

      if (filters.stars !== 'all') {
        params.stars = parseInt(filters.stars);
      }

      if (filters.search.trim()) {
        params.search = filters.search.trim();
      }

      const response = await getAllTestimonials(params);

      // The response is directly { testimonials, pagination }
      if (response && response.testimonials) {
        setTestimonials(response.testimonials);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalCount(response.pagination?.total || 0);
      } else {
        setTestimonials([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error: any) {
      toast.error('Failed to fetch testimonials');

      // Set empty state on error
      setTestimonials([]);
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

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await togglePublishStatus(id, !currentStatus);
      toast.success(`Testimonial ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      await fetchTestimonials();
    } catch (error) {
      toast.error('Failed to update testimonial status');
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteConfirmation({
      isOpen: true,
      testimonialId: id,
      testimonialName: name,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));

    try {
      await deleteTestimonial(deleteConfirmation.testimonialId);
      toast.success('Testimonial deleted successfully');
      await fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        testimonialId: '',
        testimonialName: '',
        isDeleting: false,
      });
    }
  };

  const handleDeleteCancel = () => {
    if (deleteConfirmation.isDeleting) return; // Prevent cancel during deletion

    setDeleteConfirmation({
      isOpen: false,
      testimonialId: '',
      testimonialName: '',
      isDeleting: false,
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
              }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (published: boolean) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${published
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
          }`}
      >
        {published ? 'Published' : 'Draft'}
      </span>
    );
  };

  if (loading && testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-2 lg:items-center justify-between">
        <div>
          <h1 className="text-xl lg:text-4xl font-bold tracking-tight text-gray-900">Testimonials</h1>
          <p className="text-base lg:text-lg text-gray-600 mt-2">
            Manage customer testimonials and reviews ({totalCount} total)
          </p>
        </div>
        <Button
          onClick={() => router.push('/dashboard/testimonials/add')}
          size="lg"
          className="flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Testimonial
        </Button>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <Label htmlFor="search" className="text-sm font-medium text-gray-700">
                Search by Name
              </Label>
              <div className="flex mt-1">
                <Input
                  id="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search customer name..."
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
                value={filters.published}
                onChange={(e) => handleFilterChange('published', e.target.value)}
                className="mt-1 block w-full h-10 px-3 py-2 rounded-xs border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Stars Filter */}
            <div>
              <Label htmlFor="stars-filter" className="text-sm font-medium text-gray-700">
                Minimum Stars
              </Label>
              <select
                id="stars-filter"
                value={filters.stars}
                onChange={(e) => handleFilterChange('stars', e.target.value)}
                className="mt-1 block w-full h-10 px-3 py-2 rounded-xs border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
                <option value="1">1+ Stars</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.published !== 'all' || filters.stars !== 'all' || filters.search) && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.published !== 'all' && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Status: {filters.published}
                </span>
              )}
              {filters.stars !== 'all' && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Min {filters.stars} stars
                </span>
              )}
              {filters.search && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Search: "{filters.search}"
                </span>
              )}
              <button
                onClick={() => {
                  setFilters({ published: 'all', stars: 'all', search: '' });
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

      {/* Testimonials Grid */}
      {testimonials.length === 0 ? (
        <Card className="shadow-lg">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials found</h3>
            <p className="text-gray-600 mb-4">
              {filters.search || filters.published !== 'all' || filters.stars !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Get started by adding your first customer testimonial.'}
            </p>
            <Button onClick={() => router.push('/dashboard/testimonials/add')}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial._id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row mx-auto items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {testimonial.imageUrl ? (
                        <Image
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {testimonial.name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Briefcase className="h-3 w-3" />
                        <span className="truncate">{testimonial.occupation}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(testimonial.published)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Star Rating */}
                <div className="flex items-center justify-between">
                  {renderStars(testimonial.stars)}
                  <span className="text-sm text-gray-600">
                    {testimonial.stars}/5
                  </span>
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 italic line-clamp-3">
                  "{testimonial.quote}"
                </blockquote>

                {/* Actions */}
                <div className="flex max-sm:flex-wrap gap-2 mx-auto items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    {/* Delete Button - Left side */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(testimonial._id!, testimonial.name)}
                      className="flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>

                    {/* Edit Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/testimonials/${testimonial._id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>

                  {/* Publish Toggle - Right side */}
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={testimonial.published}
                        onChange={() => handleTogglePublish(testimonial._id!, testimonial.published)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-600">
                        {testimonial.published ? 'Live' : 'Draft'}
                      </span>
                    </label>
                  </div>
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
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmation.testimonialName}'s</span> testimonial?
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone and will permanently remove the testimonial and any associated images.
              </p>

              {deleteConfirmation.isDeleting && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-blue-700">Deleting testimonial...</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleDeleteCancel}
                className="flex items-center"
                disabled={deleteConfirmation.isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                className="flex items-center"
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
                    Delete Testimonial
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
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalCount)} of {totalCount} testimonials
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
