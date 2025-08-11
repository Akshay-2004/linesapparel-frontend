'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadField } from '@/components/admin/homepage/ImageUploadField';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useTestimonialService } from '@/services/testimonial.service';
import { ITestimonialFormData } from '@/types/testimonial.interface';
import { Save, ArrowLeft, Star, X } from 'lucide-react';

const defaultFormData: ITestimonialFormData = {
  name: '',
  stars: 5,
  published: false,
  quote: '',
  occupation: '',
  location: '',
};

export default function AddTestimonialPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ITestimonialFormData>(defaultFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const {
    createTestimonial,
    createFormData,
    loading,
    error,
    uploadProgress
  } = useTestimonialService();

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
      
      const response = await createTestimonial(formDataToSend);
      
      if (response) {
        toast.success('Testimonial created successfully');
        router.push('/dashboard/testimonials');
      }
    } catch (error: any) {
      toast.error('Failed to create testimonial');
      console.error('Error creating testimonial:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/testimonials');
  };

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
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">Add Testimonial</h1>
            <p className="text-lg text-gray-600 mt-2">Create a new customer testimonial</p>
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
            {saving ? 'Saving...' : 'Save Testimonial'}
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
                  {saving ? 'Creating Testimonial...' : 'Loading...'}
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
                Please wait while we process your testimonial.
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
            Fill in the details for the new testimonial. Image is optional.
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
            
            <ImageUploadField
              label="Customer Photo (Optional)"
              onFileSelect={handleImageSelect}
              idealDimensions="400x400px (1:1)"
              description="Upload a photo of the customer. Square format works best for testimonial displays."
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
                Publish testimonial immediately
              </Label>
            </div>
            <p className="text-sm text-gray-500">
              If unchecked, the testimonial will be saved as a draft and can be published later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
