'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Eye } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadFieldProps {
  label: string;
  currentImageUrl?: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  multiple?: boolean;
  idealDimensions?: string;
  description?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  currentImageUrl,
  onFileSelect,
  accept = 'image/*',
  multiple = false,
  idealDimensions,
  description,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelect(file);

        // Create preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple,
    maxFiles: 1,
  });

  const handleRemove = () => {
    onFileSelect(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className="space-y-3">
      <div className="flex flex-col space-y-1">
        <Label className="text-sm font-medium text-gray-700">{label}</Label>
        {idealDimensions && (
          <p className="text-xs text-blue-600 font-medium">
            📐 Ideal dimensions: {idealDimensions}
          </p>
        )}
        {description && (
          <p className="text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>

      {displayImageUrl ? (
        <div className="relative group">
          <div className="relative h-48 w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
            <Image
              src={displayImageUrl}
              alt={label}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex flex-col md:flex-row gap-2 mx-auto items-center justify-center md:space-x-2 opacity-0 group-hover:opacity-100">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-900"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="bg-red-500/90 hover:bg-red-600"
                onClick={handleRemove}
              >
                <X className="h-4 w-4 mr-1" />
                Remove
              </Button>
            </div>
          </div>

          {/* Image file info */}
          {previewUrl && (
            <div className="mt-2 text-xs text-gray-500 bg-green-50 border border-green-200 rounded px-2 py-1">
              ✓ New image selected - will be uploaded on save
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
            ${isDragActive
              ? 'border-blue-400 bg-blue-50 scale-[1.02]'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-3">
            <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
              {isDragActive ? (
                <Upload className="h-8 w-8 text-blue-500" />
              ) : (
                <ImageIcon className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <p className="text-base font-medium text-gray-700">
                {isDragActive ? 'Drop the image here' : 'Click to upload or drag and drop'}
              </p>
              <div className="mt-1 space-y-1">
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
                {idealDimensions && (
                  <p className="text-xs text-blue-600 font-medium">
                    Best quality: {idealDimensions}
                  </p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Choose File
            </Button>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && displayImageUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
              onClick={() => setShowPreview(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Image
              src={displayImageUrl}
              alt={`Preview of ${label}`}
              width={800}
              height={600}
              className="object-contain max-h-[80vh] rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};
