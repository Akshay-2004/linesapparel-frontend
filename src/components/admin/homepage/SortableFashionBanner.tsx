'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Trash2 } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

interface FashionBanner {
  imageUrl: string;
  topText: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface SortableFashionBannerProps {
  id: string;
  banner: FashionBanner;
  index: number;
  onUpdate: (banner: FashionBanner) => void;
  onDelete: () => void;
  onFileUpload: (file: File | null) => void;
}

export const SortableFashionBanner: React.FC<SortableFashionBannerProps> = ({
  id,
  banner,
  index,
  onUpdate,
  onDelete,
  onFileUpload,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <GripVertical className="h-5 w-5 text-gray-500" />
            </div>
            <h5 className="text-md font-semibold text-gray-800">Fashion Banner {index + 1}</h5>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploadField
            label={`Fashion Banner ${index + 1} Image`}
            currentImageUrl={banner.imageUrl}
            onFileSelect={onFileUpload}
            idealDimensions="800x600px (4:3)"
            description="Square-ish format ideal for showcasing fashion products and collections"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Top Text</Label>
              <Input
                value={banner.topText}
                onChange={(e) => onUpdate({ ...banner, topText: e.target.value })}
                className="mt-1"
                placeholder="Top text"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Title</Label>
              <Input
                value={banner.title}
                onChange={(e) => onUpdate({ ...banner, title: e.target.value })}
                className="mt-1"
                placeholder="Banner title"
              />
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              value={banner.description}
              onChange={(e) => onUpdate({ ...banner, description: e.target.value })}
              className="mt-1"
              placeholder="Banner description"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Button Text</Label>
              <Input
                value={banner.buttonText}
                onChange={(e) => onUpdate({ ...banner, buttonText: e.target.value })}
                className="mt-1"
                placeholder="Button text"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Button Link</Label>
              <Input
                value={banner.buttonLink}
                onChange={(e) => onUpdate({ ...banner, buttonLink: e.target.value })}
                className="mt-1"
                placeholder="/category/example"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
