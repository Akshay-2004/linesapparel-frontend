'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadField } from '@/components/admin/homepage/ImageUploadField';
import { Progress } from '@/components/ui/progress';
import { ContentLoader } from '@/components/shared/Loader';
import { toast } from 'sonner';
import { useTestimonialService } from '@/services/testimonial.service';
import { ITestimonialFormData, ITestimonial } from '@/types/testimonial.interface';
import { Save, ArrowLeft, Star, X } from 'lucide-react';
import Image from 'next/image';

const defaultFormData: ITestimonialFormData = {
  name: '',
  stars: 5,
  published: false,
  quote: '',
  occupation: '',
  location: '',
};

export default function EditTestimonialPage() {
  const router = useRouter();
  const params = useParams();
  const testimonialId = params.id as string;

  const [formData, setFormData] = useState<ITestimonialFormData>(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const {
    getTestimonial,
    updateTestimonial,
    createFormData,
    loading,
    error,
    uploadProgress
  } = useTestimonialService();

  // Load testimonial data on component mount
  useEffect(() => {
    const loadTestimonial = async () => {
      if (!testimonialId) return;

      try {
        setInitialLoading(true);
        const response = await getTestimonial(testimonialId);
        
        if (response) {
          const testimonial: ITestimonial = response;
          setFormData({
            name: testimonial.name,
            stars: testimonial.stars,
            published: testimonial.published,
            quote: testimonial.quote,
            occupation: testimonial.occupation,
            location: testimonial.location,
          });
          
          if (testimonial.imageUrl) {
            setCurrentImageUrl(testimonial.imageUrl);
          }
        }
      } catch (error: any) {
        console.error('Failed to load testimonial:', error);
        toast.error('Failed to load testimonial data');
        router.push('/dashboard/testimonials');
      } finally {
        setInitialLoading(false);
      }
    };

    loadTestimonial();
  }, [testimonialId, router]); // Remove getTestimonial from dependencies

  const handleInputChange = (field: keyof ITestimonialFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageSelect = (file: File | null) => {
    setImageFile(file);
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      stars: rating
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.quote.trim()) {
      toast.error('Quote is required');
      return false;
    }
    if (!formData.occupation.trim()) {
      toast.error('Occupation is required');
      return false;
    }
    if (!formData.location.trim()) {
      toast.error('Location is required');
      return false;
    }
    if (formData.stars < 1 || formData.stars > 5) {
      toast.error('Stars must be between 1 and 5');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      const formDataToSend = createFormData(formData, imageFile || undefined);
      
      const response = await updateTestimonial(testimonialId, formDataToSend);
      
      if (response) {
        toast.success('Testimonial updated successfully');
        router.push('/dashboard/testimonials');
      }
    } catch (error: any) {
      toast.error('Failed to update testimonial');
      console.error('Error updating testimonial:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/testimonials');
  };

  // Show loading state while fetching initial data
  if (initialLoading) {
    return (
      <div className="container mx-auto p-6 space-y-8 max-w-4xl">
        <ContentLoader text="Loading testimonial..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCancel}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Edit Testimonial</h1>
            <p className="text-lg text-gray-600 mt-2">Update testimonial details</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={saving || loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving || loading} 
            size="lg"
            className="flex items-center"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Updating...' : 'Update Testimonial'}
          </Button>
        </div>
      </div>

      {/* Upload Progress Bar */}
      {(saving || loading) && uploadProgress > 0 && (
        <Card className="shadow-lg border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {saving ? 'Updating Testimonial...' : 'Loading...'}
                </h3>
                <span className="text-sm font-medium text-gray-600">
                  {uploadProgress}%
                </span>
              </div>
              <Progress 
                value={uploadProgress} 
                className="w-full h-3"
                indicatorClassName="bg-gradient-to-r from-green-500 to-blue-600 transition-all duration-300"
              />
              <p className="text-sm text-gray-500">
                Please wait while we process your changes.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show error if any */}
      {error && (
        <Card className="shadow-lg border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900">Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Form */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="text-2xl font-bold text-gray-900">Testimonial Details</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Update the testimonial details. Leave image field empty to keep current image.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Customer Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Customer Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="occupation" className="text-sm font-medium text-gray-700">
                  Occupation *
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange('occupation', e.target.value)}
                  className="mt-1"
                  placeholder="Enter occupation"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1"
                placeholder="Enter location (e.g., New York, NY)"
                required
              />
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Testimonial Content</h3>
            
            <div>
              <Label htmlFor="quote" className="text-sm font-medium text-gray-700">
                Testimonial Quote *
              </Label>
              <Textarea
                id="quote"
                value={formData.quote}
                onChange={(e) => handleInputChange('quote', e.target.value)}
                className="mt-1"
                placeholder="Enter the customer's testimonial..."
                rows={4}
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Share the customer's experience in their own words.
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700">
                Star Rating *
              </Label>
              <div className="flex items-center space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleStarClick(rating)}
                    className={`p-1 rounded-md transition-colors ${
                      rating <= formData.stars
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        rating <= formData.stars ? 'fill-current' : ''
                      }`} 
                    />
                  </button>
                ))}
                <span className="ml-4 text-sm text-gray-600">
                  {formData.stars} out of 5 stars
                </span>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Customer Photo</h3>
            
            {/* Show current image if exists */}
            {currentImageUrl && !imageFile && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Current Photo
                </Label>
                <div className="flex items-start space-x-4">
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={currentImageUrl}
                      alt="Current testimonial image"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      This is the current photo. Upload a new image below to replace it.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <ImageUploadField
              label="Update Customer Photo (Optional)"
              onFileSelect={handleImageSelect}
              idealDimensions="400x400px (1:1)"
              description="Upload a new photo to replace the current one. Leave empty to keep the current photo."
            />
          </div>

          {/* Publication Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Publication Settings</h3>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => handleInputChange('published', e.target.checked)}
                className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <Label htmlFor="published" className="text-lg font-medium text-gray-700">
                Publish testimonial
              </Label>
            </div>
            <p className="text-sm text-gray-500">
              Control whether this testimonial is visible to the public.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
