'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IProductSectionContent } from '@/types/homepage.interface';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GripVertical, Trash2 } from 'lucide-react';

interface DraggableProductSectionProps {
  id: string;
  section: IProductSectionContent;
  index: number;
  onUpdate: (index: number, section: IProductSectionContent) => void;
  onDelete: (index: number) => void;
}

export const DraggableProductSection: React.FC<DraggableProductSectionProps> = ({
  id,
  section,
  index,
  onUpdate,
  onDelete,
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

  const handleInputChange = (field: keyof IProductSectionContent, value: any) => {
    onUpdate(index, { ...section, [field]: value });
  };

  const handleCarouselSettingsChange = (field: string, value: any) => {
    onUpdate(index, {
      ...section,
      carouselSettings: {
        ...section.carouselSettings,
        [field]: value,
      },
    });
  };

  const handleCardsPerViewChange = (breakpoint: string, value: number) => {
    onUpdate(index, {
      ...section,
      carouselSettings: {
        ...section.carouselSettings,
        cardsPerView: {
          ...section.carouselSettings.cardsPerView,
          [breakpoint]: value,
        },
      },
    });
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="mb-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <GripVertical className="h-5 w-5 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Product Section {index + 1}</h3>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(index)}
            className="hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor={`title-${index}`} className="text-sm font-medium text-gray-700">Title</Label>
              <Input
                id={`title-${index}`}
                value={section.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Section title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`topText-${index}`} className="text-sm font-medium text-gray-700">Top Text</Label>
              <Input
                id={`topText-${index}`}
                value={section.topText}
                onChange={(e) => handleInputChange('topText', e.target.value)}
                placeholder="Top text"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor={`description-${index}`} className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id={`description-${index}`}
              value={section.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Section description"
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor={`tag-${index}`} className="text-sm font-medium text-gray-700">Tag</Label>
              <Input
                id={`tag-${index}`}
                value={section.tag}
                onChange={(e) => handleInputChange('tag', e.target.value)}
                placeholder="men, women, trending-now"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`buttonText-${index}`} className="text-sm font-medium text-gray-700">Button Text</Label>
              <Input
                id={`buttonText-${index}`}
                value={section.buttonText}
                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                placeholder="View All"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor={`buttonLink-${index}`} className="text-sm font-medium text-gray-700">Button Link</Label>
              <Input
                id={`buttonLink-${index}`}
                value={section.buttonLink}
                onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                placeholder="/products"
                className="mt-1"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Carousel Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700 block mb-3">Cards Per View</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600">Mobile</Label>
                    <Input
                      type="number"
                      min="1"
                      max="6"
                      value={section.carouselSettings.cardsPerView.base}
                      onChange={(e) =>
                        handleCardsPerViewChange('base', parseInt(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Tablet</Label>
                    <Input
                      type="number"
                      min="1"
                      max="6"
                      value={section.carouselSettings.cardsPerView.md}
                      onChange={(e) =>
                        handleCardsPerViewChange('md', parseInt(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Desktop</Label>
                    <Input
                      type="number"
                      min="1"
                      max="6"
                      value={section.carouselSettings.cardsPerView.lg}
                      onChange={(e) =>
                        handleCardsPerViewChange('lg', parseInt(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    id={`autoPlay-${index}`}
                    type="checkbox"
                    checked={section.carouselSettings.autoPlay}
                    onChange={(e) =>
                      handleCarouselSettingsChange('autoPlay', e.target.checked)
                    }
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <Label htmlFor={`autoPlay-${index}`} className="text-sm font-medium text-gray-700">
                    Auto Play
                  </Label>
                </div>
                {section.carouselSettings.autoPlay && (
                  <div>
                    <Label htmlFor={`interval-${index}`} className="text-sm font-medium text-gray-700">Interval (ms)</Label>
                    <Input
                      id={`interval-${index}`}
                      type="number"
                      min="1000"
                      step="1000"
                      value={section.carouselSettings.interval}
                      onChange={(e) =>
                        handleCarouselSettingsChange('interval', parseInt(e.target.value))
                      }
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
