'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useLegalPagesService, LegalPage, LegalPageType, LegalPageData, UpdateLegalPageData } from '@/services/legal-pages.service';
import { 
  RefreshCw,
  FileText,
  Edit,
  Trash2,
  Save,
  Plus,
  AlertTriangle,
  Eye,
  Calendar,
  User,
  Mail,
  Globe,
  Shield,
  Upload,
  Download,
  Code
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the markdown editor to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface EditModal {
  isOpen: boolean;
  pageType: string;
  pageName: string;
  existingPage: LegalPage | null;
  isUpdating: boolean;
  formData: {
    title: string;
    markdownContent: string;
    effectiveDate: string;
    contactEmail: string;
    isActive: boolean;
  };
}

interface DeleteConfirmation {
  isOpen: boolean;
  pageType: string;
  pageName: string;
  isDeleting: boolean;
}

export default function LegalPagesPage() {
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [pageTypes, setPageTypes] = useState<LegalPageType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editModal, setEditModal] = useState<EditModal>({
    isOpen: false,
    pageType: '',
    pageName: '',
    existingPage: null,
    isUpdating: false,
    formData: {
      title: '',
      markdownContent: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      contactEmail: '',
      isActive: true,
    },
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<DeleteConfirmation>({
    isOpen: false,
    pageType: '',
    pageName: '',
    isDeleting: false,
  });

  const {
    getAllLegalPages,
    getLegalPageTypes,
    createOrUpdateLegalPage,
    deleteLegalPage,
    loading,
    error
  } = useLegalPagesService();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pages, types] = await Promise.all([
        getAllLegalPages(),
        getLegalPageTypes()
      ]);
      setLegalPages(pages);
      setPageTypes(types);
    } catch (error: any) {
      console.error('Error fetching legal pages data:', error);
      toast.error('Failed to fetch legal pages');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData();
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleEditClick = (pageType: LegalPageType, existingPage?: LegalPage) => {
    const pageData = existingPage?.data || {};
    
    setEditModal({
      isOpen: true,
      pageType: pageType.key,
      pageName: pageType.name,
      existingPage: existingPage || null,
      isUpdating: false,
      formData: {
        title: pageData.title || pageType.name,
        markdownContent: pageData.content || `# ${pageType.name}\n\nWrite your ${pageType.name.toLowerCase()} content here...\n\n## Example Section\n\nYour content goes here.`,
        effectiveDate: pageData.effectiveDate || new Date().toISOString().split('T')[0],
        contactEmail: pageData.contactEmail || '',
        isActive: existingPage?.isActive !== undefined ? existingPage.isActive : true,
      },
    });
  };

  const createMarkdownFile = (content: string, filename: string): File => {
    const blob = new Blob([content], { type: 'text/markdown' });
    return new File([blob], `${filename}.md`, { type: 'text/markdown' });
  };

  const handleSave = async () => {
    setEditModal(prev => ({ ...prev, isUpdating: true }));
    
    try {
      // Create markdown file from editor content
      const markdownFile = createMarkdownFile(
        editModal.formData.markdownContent,
        `${editModal.pageType}-${Date.now()}`
      );

      const updateData: UpdateLegalPageData = {
        data: {
          title: editModal.formData.title,
          effectiveDate: editModal.formData.effectiveDate,
          contactEmail: editModal.formData.contactEmail,
          lastUpdated: new Date().toISOString(),
          contentType: 'markdown',
        },
        isActive: editModal.formData.isActive,
        markdownFile: markdownFile,
      };

      await createOrUpdateLegalPage(editModal.pageType, updateData);
      toast.success(`${editModal.pageName} ${editModal.existingPage ? 'updated' : 'created'} successfully`);
      await fetchData();
      
      setEditModal({
        isOpen: false,
        pageType: '',
        pageName: '',
        existingPage: null,
        isUpdating: false,
        formData: {
          title: '',
          markdownContent: '',
          effectiveDate: new Date().toISOString().split('T')[0],
          contactEmail: '',
          isActive: true,
        },
      });
    } catch (error) {
      toast.error(`Failed to ${editModal.existingPage ? 'update' : 'create'} legal page`);
    } finally {
      setEditModal(prev => ({ ...prev, isUpdating: false }));
    }
  };

  const handleToggleStatus = async (pageType: string, currentStatus: boolean) => {
    try {
      const updateData: UpdateLegalPageData = {
        isActive: !currentStatus,
      };

      await createOrUpdateLegalPage(pageType, updateData);
      toast.success(`Page ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
      await fetchData();
    } catch (error) {
      toast.error('Failed to update page status');
    }
  };

  const downloadMarkdown = async (page: LegalPage) => {
    try {
      let content = page.data?.content || '';
      
      // If we have a markdown URL, fetch the latest content
      if (page.data?.markdownUrl) {
        try {
          const response = await fetch(page.data.markdownUrl);
          content = await response.text();
        } catch (fetchError) {
          // Fallback to stored content on fetch error
        }
      }
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${page.name.toLowerCase().replace(/\s+/g, '-')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Markdown file downloaded successfully');
    } catch (error) {
      toast.error('Failed to download Markdown file');
    }
  };

  const handleDeleteClick = (pageType: LegalPageType) => {
    setDeleteConfirmation({
      isOpen: true,
      pageType: pageType.key,
      pageName: pageType.name,
      isDeleting: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteConfirmation(prev => ({ ...prev, isDeleting: true }));
    
    try {
      await deleteLegalPage(deleteConfirmation.pageType);
      toast.success(`${deleteConfirmation.pageName} deleted successfully`);
      await fetchData();
    } catch (error) {
      toast.error('Failed to delete legal page');
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        pageType: '',
        pageName: '',
        isDeleting: false,
      });
    }
  };

  const getExistingPage = (pageType: string): LegalPage | undefined => {
    return legalPages.find(page => page.path === `/legal/${pageType}`);
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {isActive ? 'Active' : 'Inactive'}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && legalPages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading legal pages...</p>
        </div>
      </div>
    );
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if it's a markdown file
    if (file.type !== 'text/markdown' && !file.name.endsWith('.md')) {
      toast.error('Please upload a valid markdown (.md) file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setEditModal(prev => ({
          ...prev,
          formData: { ...prev.formData, markdownContent: content }
        }));
        toast.success(`File "${file.name}" loaded successfully`);
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read the file');
    };
    
    reader.readAsText(file);
    
    // Reset the input so the same file can be uploaded again if needed
    event.target.value = '';
  };

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Legal Pages</h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage legal documents and policies with markdown editor ({legalPages.length} created)
          </p>
        </div>
        
        <Button 
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          variant="outline"
          size="lg"
          className="flex items-center"
        >
          <RefreshCw className={`h-5 w-5 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Legal Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageTypes.map((pageType) => {
          const existingPage = getExistingPage(pageType.key);
          
          return (
            <Card key={pageType.key} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {pageType.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {pageType.path}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {existingPage && getStatusBadge(existingPage.isActive)}
                    {existingPage && (
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={existingPage.isActive}
                            onChange={() => handleToggleStatus(pageType.key, existingPage.isActive)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {existingPage ? (
                  <>
                    {/* Page Info */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {formatDate(existingPage.updatedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        <span>By {existingPage.updatedBy?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Shield className="h-3 w-3" />
                        <span>Version {existingPage.version}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-blue-600">
                        <Code className="h-3 w-3" />
                        <span>Markdown</span>
                      </div>
                    </div>

                    {/* Content Preview */}
                    {existingPage.data?.content && (
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {existingPage.data.content.replace(/[#*`]/g, '').substring(0, 150)}...
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col space-y-2 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(pageType, existingPage)}
                          className="flex items-center flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(pageType)}
                          className="flex items-center flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(pageType.path, '_blank')}
                          className="flex items-center flex-1"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadMarkdown(existingPage)}
                          className="flex items-center flex-1"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* No page created yet */}
                    <div className="text-center py-6">
                      <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-4">
                        No {pageType.name.toLowerCase()} created yet
                      </p>
                      <Button
                        onClick={() => handleEditClick(pageType)}
                        className="flex items-center mx-auto"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create Page
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal with Markdown Editor */}
      {editModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Edit className="h-6 w-6 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {editModal.existingPage ? 'Edit' : 'Create'} {editModal.pageName}
                </h3>
                <div className="flex items-center text-sm text-blue-600">
                  <Code className="h-4 w-4 mr-1" />
                  <span>Markdown Editor</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Page Title
                    </Label>
                    <Input
                      id="title"
                      value={editModal.formData.title}
                      onChange={(e) => setEditModal(prev => ({
                        ...prev,
                        formData: { ...prev.formData, title: e.target.value }
                      }))}
                      placeholder="Enter page title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                      Contact Email (Optional)
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={editModal.formData.contactEmail}
                      onChange={(e) => setEditModal(prev => ({
                        ...prev,
                        formData: { ...prev.formData, contactEmail: e.target.value }
                      }))}
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="effective-date" className="text-sm font-medium text-gray-700">
                      Effective Date
                    </Label>
                    <Input
                      id="effective-date"
                      type="date"
                      value={editModal.formData.effectiveDate}
                      onChange={(e) => setEditModal(prev => ({
                        ...prev,
                        formData: { ...prev.formData, effectiveDate: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                {/* Markdown Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">
                      Content (Markdown)
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="file"
                        accept=".md"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="md-file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('md-file-upload')?.click()}
                        className="flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-1" />
                        Upload .md File
                      </Button>
                    </div>
                  </div>
                  
                  <div 
                    className="border rounded-lg overflow-hidden bg-white"
                    style={{ minHeight: '500px' }}
                  >
                    <MDEditor
                      value={editModal.formData.markdownContent}
                      onChange={(value) => setEditModal(prev => ({
                        ...prev,
                        formData: { ...prev.formData, markdownContent: value || '' }
                      }))}
                      height={500}
                      preview="edit"
                      data-color-mode="light"
                      hideToolbar={false}
                      // Remove the problematic visibleDragBar prop
                    />
                  </div>
                  <div className="flex items-start justify-between mt-2">
                    <p className="text-xs text-gray-500">
                      Use markdown syntax to format your content. You can also upload a .md file to replace the current content.
                    </p>
                    <div className="text-xs text-gray-500">
                      {editModal.formData.markdownContent.length} characters
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setEditModal(prev => ({ ...prev, isOpen: false }))}
                  disabled={editModal.isUpdating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={
                    editModal.isUpdating || 
                    !editModal.formData.title.trim() || 
                    !editModal.formData.markdownContent.trim()
                  }
                  className="flex items-center"
                >
                  {editModal.isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editModal.existingPage ? 'Update' : 'Create'} Page
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmation.pageName}</span>? 
              </p>
              <p className="text-sm text-red-600 mt-2">
                This action cannot be undone and will permanently remove the legal page.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmation(prev => ({ ...prev, isOpen: false }))}
                disabled={deleteConfirmation.isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleteConfirmation.isDeleting}
                className="flex items-center"
              >
                {deleteConfirmation.isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Page
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
