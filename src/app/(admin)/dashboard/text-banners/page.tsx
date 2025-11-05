'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useTextBannerService, ITextBanner } from '@/services/text-banner.service';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  FileText
} from 'lucide-react';

interface DeleteConfirmation {
  isOpen: boolean;
  textBannerId: string;
  content: string;
  isDeleting: boolean;
}

interface TextBannerForm {
  content: string;
  isActive: boolean;
}

export default function TextBannersPage() {
  const [textBanners, setTextBanners] = useState<ITextBanner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    textBannerId: '',
    content: '',
    isDeleting: false,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTextBanner, setEditingTextBanner] = useState<ITextBanner | null>(null);
  const [formData, setFormData] = useState<TextBannerForm>({
    content: '',
    isActive: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    getAllTextBanners,
    createTextBanner,
    updateTextBanner,
    deleteTextBanner,
    toggleTextBannerStatus,
  } = useTextBannerService();

  const limit = 10; // 10 text banners per page

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch text banners
  useEffect(() => {
    const fetchTextBanners = async () => {
      try {
        const response = await getAllTextBanners(currentPage, limit, search);
        setTextBanners(response.textBanners);
        setTotalPages(response.pagination.totalPages);
        setTotalCount(response.pagination.totalCount);
      } catch (error: any) {
        toast.error(error?.message || 'Failed to load text banners');
      }
    };

    fetchTextBanners();
  }, [currentPage, search]);

  const handleCreate = async () => {
    if (!formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createTextBanner(formData);
      if (response) {
        toast.success('Text banner created successfully');
        setIsCreateDialogOpen(false);
        setFormData({ content: '', isActive: true });
        // Refresh the list
        const refreshResponse = await getAllTextBanners(currentPage, limit, search);
        setTextBanners(refreshResponse.textBanners);
        setTotalPages(refreshResponse.pagination.totalPages);
        setTotalCount(refreshResponse.pagination.totalCount);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create text banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!editingTextBanner || !formData.content.trim()) {
      toast.error('Content is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await updateTextBanner(editingTextBanner._id, formData);
      if (response) {
        toast.success('Text banner updated successfully');
        setIsEditDialogOpen(false);
        setEditingTextBanner(null);
        setFormData({ content: '', isActive: true });
        // Refresh the list
        const refreshResponse = await getAllTextBanners(currentPage, limit, search);
        setTextBanners(refreshResponse.textBanners);
        setTotalPages(refreshResponse.pagination.totalPages);
        setTotalCount(refreshResponse.pagination.totalCount);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update text banner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmation.textBannerId) return;

    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
    try {
      const response = await deleteTextBanner(deleteConfirmation.textBannerId);
      if (response.success) {
        toast.success('Text banner deleted successfully');
        setDeleteConfirmation({ isOpen: false, textBannerId: '', content: '', isDeleting: false });
        // Refresh the list
        const refreshResponse = await getAllTextBanners(currentPage, limit, search);
        setTextBanners(refreshResponse.textBanners);
        setTotalPages(refreshResponse.pagination.totalPages);
        setTotalCount(refreshResponse.pagination.totalCount);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete text banner');
    } finally {
      setDeleteConfirmation(prev => ({ ...prev, isDeleting: false }));
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await toggleTextBannerStatus(id);
      if (response) {
        toast.success(`Text banner ${response.isActive ? 'activated' : 'deactivated'}`);
        // Update the local state
        setTextBanners(prev =>
          prev.map(banner =>
            banner._id === id ? response : banner
          )
        );
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to toggle status');
    }
  };

  const openEditDialog = (textBanner: ITextBanner) => {
    setEditingTextBanner(textBanner);
    setFormData({
      content: textBanner.content,
      isActive: textBanner.isActive
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (textBanner: ITextBanner) => {
    setDeleteConfirmation({
      isOpen: true,
      textBannerId: textBanner._id,
      content: textBanner.content,
      isDeleting: false,
    });
  };

  const resetForm = () => {
    setFormData({ content: '', isActive: true });
    setEditingTextBanner(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Text Banners</h1>
          <p className="text-muted-foreground">
            Manage text banners displayed on your website
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Text Banner
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Text Banner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter banner text..."
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search text banners..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Text Banners List */}
      <Card>
        <CardHeader>
          <CardTitle>Text Banners ({totalCount})</CardTitle>
        </CardHeader>
        <CardContent>
          {textBanners.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No text banners found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {textBanners.map((textBanner) => (
                <div
                  key={textBanner._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium truncate">{textBanner.content}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        textBanner.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {textBanner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(textBanner.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(textBanner._id)}
                    >
                      {textBanner.isActive ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(textBanner)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteDialog(textBanner)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Text Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter banner text..."
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button onClick={handleEdit} disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation.isOpen} onOpenChange={(open) =>
        setDeleteConfirmation(prev => ({ ...prev, isOpen: open }))
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete Text Banner
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this text banner?</p>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">Content:</p>
              <p className="text-sm text-muted-foreground mt-1">
                {deleteConfirmation.content}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation({ isOpen: false, textBannerId: '', content: '', isDeleting: false })}
                disabled={deleteConfirmation.isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteConfirmation.isDeleting}
              >
                {deleteConfirmation.isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}