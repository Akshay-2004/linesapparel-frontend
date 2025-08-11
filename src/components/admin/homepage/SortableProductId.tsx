'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GripVertical, Trash2 } from 'lucide-react';

interface SortableProductIdProps {
  id: string;
  productId: string;
  index: number;
  onUpdate: (value: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

export const SortableProductId: React.FC<SortableProductIdProps> = ({
  id,
  productId,
  index,
  onUpdate,
  onDelete,
  canDelete,
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
      <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700">Product ID {index + 1}</Label>
              <Input
                value={productId}
                onChange={(e) => onUpdate(e.target.value)}
                className="mt-1"
                placeholder="Enter product ID"
              />
            </div>
            {canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
