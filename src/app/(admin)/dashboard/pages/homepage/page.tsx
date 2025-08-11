'use client';

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { DraggableProductSection } from '@/components/admin/homepage/DraggableProductSection';
import { ImageUploadField } from '@/components/admin/homepage/ImageUploadField';
import { useHomepageService } from '@/services/homepage.service';
import {
  IHomepageData,
  IHeroContent,
  IFashionContent,
  IBannerContent,
  IProductSectionContent,
  IHomepageSEO,
} from '@/types/homepage.interface';
import { Plus, Save, Eye, Trash2, X } from 'lucide-react';
import { SortableFashionBanner } from '@/components/admin/homepage/SortableFashionBanner';
import { SortableHeroSlide } from '@/components/admin/homepage/SortableHeroSlide';
import { SortableProductId } from '@/components/admin/homepage/SortableProductId';
import { Progress } from '@/components/ui/progress';

const defaultHeroContent: IHeroContent = {
  slides: [
    {
      imageUrl: '',
      pretitle: '',
      title: '',
      subtitle: '',
    },
  ],
  autoPlay: true,
  interval: 5000,
};

const defaultFashionContent: IFashionContent = {
  header1: '',
  header2: '',
  description: '',
  banners: [
    {
      imageUrl: '',
      topText: '',
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
    },
    {
      imageUrl: '',
      topText: '',
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
    },
  ],
  productIds: ['', '', '', ''], // 4 product IDs
};

const defaultBannerContent: IBannerContent = {
  imageUrl: '',
  topText: '',
  title: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  overlayStyle: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    opacity: 0.8,
  },
};

const defaultProductSection: IProductSectionContent = {
  title: '',
  description: '',
  topText: '',
  buttonText: 'View All',
  buttonLink: '/products',
  tag: '',
  carouselSettings: {
    cardsPerView: {
      base: 1,
      md: 2,
      lg: 4,
    },
    autoPlay: false,
    interval: 3000,
  },
};

const defaultSEO: IHomepageSEO = {
  title: '',
  description: '',
  keywords: [],
  ogImage: '',
  canonicalUrl: '',
  structuredData: '',
};

export default function HomepageManagement() {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [homepageData, setHomepageData] = useState<IHomepageData>({
    hero: defaultHeroContent,
    fashion: defaultFashionContent,
    banners: [defaultBannerContent, defaultBannerContent],
    productSections: [defaultProductSection, defaultProductSection],
    seo: defaultSEO,
    isPublished: false,
    settings: {},
  });

  const [uploadFiles, setUploadFiles] = useState<Record<string, File[]>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  // Use the new hook-based service
  const {
    getHomepage,
    createHomepage,
    updateHomepage,
    deleteHomepage,
    createFormData,
    loading,
    error,
    uploadProgress
  } = useHomepageService();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadHomepage();
  }, []);

  const loadHomepage = async () => {
    try {
      const response = await getHomepage();
      if (response && response.data) {
        setHomepageData(response.data);
      }
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load homepage data');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = createFormData(homepageData, uploadFiles);
      
      const response = await updateHomepage(formData);
      
      if (response) {
        toast.success('Homepage updated successfully');
        setUploadFiles({});
        await loadHomepage();
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        try {
          const formData = createFormData(homepageData, uploadFiles);
          const response = await createHomepage(formData);
          
          if (response) {
            toast.success('Homepage created successfully');
            setUploadFiles({});
            await loadHomepage();
          }
        } catch (createError) {
          toast.error('Failed to create homepage');
        }
      } else {
        toast.error('Failed to save homepage');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = homepageData.productSections.findIndex(
        (_, index) => `product-section-${index}` === active.id
      );
      const newIndex = homepageData.productSections.findIndex(
        (_, index) => `product-section-${index}` === over.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        const newProductSections = arrayMove(homepageData.productSections, oldIndex, newIndex);
        setHomepageData({ ...homepageData, productSections: newProductSections });
      }
    }
  };

  const handleHeroSlideDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleHeroSlideDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[2]);
      const newIndex = parseInt(over.id.toString().split('-')[2]);

      if (!isNaN(oldIndex) && !isNaN(newIndex)) {
        const newSlides = arrayMove(homepageData.hero.slides, oldIndex, newIndex);
        setHomepageData({
          ...homepageData,
          hero: { ...homepageData.hero, slides: newSlides },
        });
      }
    }
  };

  const handleFashionBannerDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleFashionBannerDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[3]);
      const newIndex = parseInt(over.id.toString().split('-')[3]);

      if (!isNaN(oldIndex) && !isNaN(newIndex)) {
        const newBanners = arrayMove(homepageData.fashion.banners, oldIndex, newIndex);
        setHomepageData({
          ...homepageData,
          fashion: { ...homepageData.fashion, banners: newBanners },
        });
      }
    }
  };

  const handleProductIdDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleProductIdDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = parseInt(active.id.toString().split('-')[2]);
      const newIndex = parseInt(over.id.toString().split('-')[2]);

      if (!isNaN(oldIndex) && !isNaN(newIndex)) {
        const newProductIds = arrayMove(homepageData.fashion.productIds, oldIndex, newIndex);
        setHomepageData({
          ...homepageData,
          fashion: { ...homepageData.fashion, productIds: newProductIds },
        });
      }
    }
  };

  const addProductSection = () => {
    setHomepageData({
      ...homepageData,
      productSections: [...homepageData.productSections, { ...defaultProductSection }],
    });
  };

  const updateProductSection = (index: number, section: IProductSectionContent) => {
    const newSections = [...homepageData.productSections];
    newSections[index] = section;
    setHomepageData({ ...homepageData, productSections: newSections });
  };

  const deleteProductSection = (index: number) => {
    if (homepageData.productSections.length > 2) {
      const newSections = homepageData.productSections.filter((_, i) => i !== index);
      setHomepageData({ ...homepageData, productSections: newSections });
    } else {
      toast.error('You must have at least 2 product sections');
    }
  };

  // Hero section slide management
  const addHeroSlide = () => {
    const newSlide = {
      imageUrl: '',
      pretitle: '',
      title: '',
      subtitle: '',
    };
    setHomepageData({
      ...homepageData,
      hero: {
        ...homepageData.hero,
        slides: [...homepageData.hero.slides, newSlide],
      },
    });
  };

  const deleteHeroSlide = (index: number) => {
    if (homepageData.hero.slides.length > 1) {
      const newSlides = homepageData.hero.slides.filter((_, i) => i !== index);
      setHomepageData({
        ...homepageData,
        hero: { ...homepageData.hero, slides: newSlides },
      });
    } else {
      toast.error('You must have at least 1 hero slide');
    }
  };

  const handleHeroSlideFileUpload = (slideIndex: number, file: File | null) => {
    if (file) {
      setUploadFiles(prev => ({
        ...prev,
        [`hero_slide_${slideIndex}`]: [file],
      }));
    } else {
      setUploadFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[`hero_slide_${slideIndex}`];
        return newFiles;
      });
    }
  };

  // Fashion section management
  const deleteFashionBanner = (index: number) => {
    if (homepageData.fashion.banners.length > 2) {
      const newBanners = homepageData.fashion.banners.filter((_, i) => i !== index);
      setHomepageData({
        ...homepageData,
        fashion: { ...homepageData.fashion, banners: newBanners },
      });
    } else {
      toast.error('You must have exactly 2 fashion banners');
    }
  };

  const deleteProductId = (index: number) => {
    if (homepageData.fashion.productIds.length > 4) {
      const newProductIds = homepageData.fashion.productIds.filter((_, i) => i !== index);
      setHomepageData({
        ...homepageData,
        fashion: { ...homepageData.fashion, productIds: newProductIds },
      });
    } else {
      toast.error('You must have exactly 4 product IDs');
    }
  };

  const handleFashionBannerFileUpload = (bannerIndex: number, file: File | null) => {
    if (file) {
      setUploadFiles(prev => ({
        ...prev,
        [`fashion_banner_${bannerIndex}`]: [file],
      }));
    } else {
      setUploadFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[`fashion_banner_${bannerIndex}`];
        return newFiles;
      });
    }
  };

  const handleFileUpload = (fieldName: string, file: File | null) => {
    if (file) {
      setUploadFiles(prev => ({
        ...prev,
        [fieldName]: [file],
      }));
    } else {
      setUploadFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[fieldName];
        return newFiles;
      });
    }
  };

  if (loading && !saving) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading homepage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Homepage Management</h1>
          <p className="text-lg text-gray-600 mt-2">Manage your homepage content and layout</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="lg">
            <Eye className="h-5 w-5 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving || loading} size="lg">
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
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
                  {saving ? 'Uploading Images...' : 'Loading...'}
                </h3>
                <span className="text-sm font-medium text-gray-600">
                  {uploadProgress}%
                </span>
              </div>
              <Progress 
                value={uploadProgress} 
                className="w-full h-3"
                indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              />
              <p className="text-sm text-gray-500">
                Please wait while we process your images. This may take a few minutes for multiple files.
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
                <h3 className="text-lg font-semibold text-red-900">Upload Error</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Hero Section</CardTitle>
            <Button onClick={addHeroSlide} variant="outline" size="sm" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Slide
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Hero images should be high-quality and capture attention. They're displayed prominently at the top of your homepage.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Label className="text-sm font-medium text-gray-700">Auto Play</Label>
              <input
                type="checkbox"
                checked={homepageData.hero.autoPlay}
                onChange={(e) =>
                  setHomepageData({
                    ...homepageData,
                    hero: { ...homepageData.hero, autoPlay: e.target.checked },
                  })
                }
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>
            <div>
              <Label htmlFor="hero-interval" className="text-sm font-medium text-gray-700">Interval (ms)</Label>
              <Input
                id="hero-interval"
                type="number"
                value={homepageData.hero.interval}
                onChange={(e) =>
                  setHomepageData({
                    ...homepageData,
                    hero: { ...homepageData.hero, interval: parseInt(e.target.value) },
                  })
                }
                className="mt-1"
              />
            </div>
          </div>

          {/* Hero Slides with Drag and Drop */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Slides</h3>
            {mounted ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleHeroSlideDragStart}
                onDragEnd={handleHeroSlideDragEnd}
              >
                <SortableContext
                  items={homepageData.hero.slides.map((_, index) => `hero-slide-${index}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {homepageData.hero.slides.map((slide, index) => (
                    <SortableHeroSlide
                      key={`hero-slide-${index}`}
                      id={`hero-slide-${index}`}
                      slide={slide}
                      index={index}
                      onUpdate={(updatedSlide) => {
                        const newSlides = [...homepageData.hero.slides];
                        newSlides[index] = updatedSlide;
                        setHomepageData({
                          ...homepageData,
                          hero: { ...homepageData.hero, slides: newSlides },
                        });
                      }}
                      onDelete={() => deleteHeroSlide(index)}
                      onFileUpload={(file) => handleHeroSlideFileUpload(index, file)}
                      canDelete={homepageData.hero.slides.length > 1}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId && activeId.startsWith('hero-slide-') ? (
                    <div className="bg-white shadow-lg rounded-lg p-4 border-2 border-blue-500 opacity-90 transform rotate-2">
                      <div className="text-gray-600">Moving slide...</div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              <div className="space-y-4">
                {homepageData.hero.slides.map((slide, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">Loading slide {index + 1}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Fashion Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardTitle className="text-2xl font-bold text-gray-900">Fashion Section</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Fashion banners showcase your product categories and style collections.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fashion-header1" className="text-sm font-medium text-gray-700">Header 1</Label>
              <Input
                id="fashion-header1"
                value={homepageData.fashion.header1}
                onChange={(e) =>
                  setHomepageData({
                    ...homepageData,
                    fashion: { ...homepageData.fashion, header1: e.target.value },
                  })
                }
                className="mt-1"
                placeholder="First header text"
              />
            </div>
            <div>
              <Label htmlFor="fashion-header2" className="text-sm font-medium text-gray-700">Header 2</Label>
              <Input
                id="fashion-header2"
                value={homepageData.fashion.header2}
                onChange={(e) =>
                  setHomepageData({
                    ...homepageData,
                    fashion: { ...homepageData.fashion, header2: e.target.value },
                  })
                }
                className="mt-1"
                placeholder="Second header text"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="fashion-description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="fashion-description"
              value={homepageData.fashion.description}
              onChange={(e) =>
                setHomepageData({
                  ...homepageData,
                  fashion: { ...homepageData.fashion, description: e.target.value },
                })
              }
              className="mt-1"
              placeholder="Fashion section description"
              rows={4}
            />
          </div>

          {/* Fashion Banners */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Fashion Banners (2 Required)</h4>
            </div>
            {mounted ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleFashionBannerDragStart}
                onDragEnd={handleFashionBannerDragEnd}
              >
                <SortableContext
                  items={homepageData.fashion.banners.map((_, index) => `fashion-banner-${index}`)}
                  strategy={verticalListSortingStrategy}
                >
                  {homepageData.fashion.banners.map((banner, index) => (
                    <SortableFashionBanner
                      key={`fashion-banner-${index}`}
                      id={`fashion-banner-${index}`}
                      banner={banner}
                      index={index}
                      onUpdate={(updatedBanner) => {
                        const newBanners = [...homepageData.fashion.banners];
                        newBanners[index] = updatedBanner;
                        setHomepageData({
                          ...homepageData,
                          fashion: { ...homepageData.fashion, banners: newBanners },
                        });
                      }}
                      onDelete={() => deleteFashionBanner(index)}
                      onFileUpload={(file) => handleFashionBannerFileUpload(index, file)}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId && activeId.startsWith('fashion-banner-') ? (
                    <div className="bg-white shadow-lg rounded-lg p-4 border-2 border-purple-500 opacity-90 transform rotate-2">
                      <div className="text-gray-600">Moving banner...</div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              <div className="space-y-4">
                {homepageData.fashion.banners.map((banner, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">Loading fashion banner {index + 1}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product IDs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Product IDs (4 Required)</h4>
            </div>
            {mounted ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleProductIdDragStart}
                onDragEnd={handleProductIdDragEnd}
              >
                <SortableContext
                  items={homepageData.fashion.productIds.map((_, index) => `product-id-${index}`)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {homepageData.fashion.productIds.map((productId, index) => (
                      <SortableProductId
                        key={`product-id-${index}`}
                        id={`product-id-${index}`}
                        productId={productId}
                        index={index}
                        onUpdate={(value) => {
                          const newProductIds = [...homepageData.fashion.productIds];
                          newProductIds[index] = value;
                          setHomepageData({
                            ...homepageData,
                            fashion: { ...homepageData.fashion, productIds: newProductIds },
                          });
                        }}
                        onDelete={() => deleteProductId(index)}
                        canDelete={homepageData.fashion.productIds.length > 4}
                      />
                    ))}
                  </div>
                </SortableContext>
                <DragOverlay>
                  {activeId && activeId.startsWith('product-id-') ? (
                    <div className="bg-white shadow-lg rounded-lg p-4 border-2 border-green-500 opacity-90 transform rotate-2">
                      <div className="text-gray-600">Moving product ID...</div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {homepageData.fashion.productIds.map((productId, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">Loading product ID {index + 1}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Product Sections */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900">Product Sections</CardTitle>
            <Button onClick={addProductSection} size="lg" className="flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {mounted ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={homepageData.productSections.map((_, index) => `product-section-${index}`)}
                strategy={verticalListSortingStrategy}
              >
                {homepageData.productSections.map((section, index) => (
                  <DraggableProductSection
                    key={`product-section-${index}`}
                    id={`product-section-${index}`}
                    section={section}
                    index={index}
                    onUpdate={updateProductSection}
                    onDelete={deleteProductSection}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId && activeId.startsWith('product-section-') ? (
                  <div className="bg-white shadow-lg rounded-lg p-4 border-2 border-orange-500 opacity-90 transform rotate-2">
                    <div className="text-gray-600">Moving product section...</div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          ) : (
            <div className="space-y-4">
              {homepageData.productSections.map((section, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-500">Loading product section {index + 1}...</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Banner Sections */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50">
          <CardTitle className="text-2xl font-bold text-gray-900">Banner Sections</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Promotional banners for special offers, collections, or brand messaging.
          </p>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          {homepageData.banners.map((banner, index) => (
            <Card key={index} className="border-2 border-gray-200 hover:border-gray-300 transition-colors">
              <CardHeader>
                <h4 className="text-lg font-semibold text-gray-800">Banner {index + 1}</h4>
              </CardHeader>
              <CardContent className="space-y-4">
                <ImageUploadField
                  label="Banner Image"
                  currentImageUrl={banner.imageUrl}
                  onFileSelect={(file) => handleFileUpload(`banner_${index}`, file)}
                  idealDimensions="1920x600px"
                  description="Wide banner format perfect for promotional content and call-to-actions"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`banner-toptext-${index}`} className="text-sm font-medium text-gray-700">Top Text</Label>
                    <Input
                      id={`banner-toptext-${index}`}
                      value={banner.topText || ''}
                      onChange={(e) => {
                        const newBanners = [...homepageData.banners] as [IBannerContent, IBannerContent];
                        newBanners[index] = { ...banner, topText: e.target.value };
                        setHomepageData({ ...homepageData, banners: newBanners });
                      }}
                      className="mt-1"
                      placeholder="Optional top text"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`banner-title-${index}`} className="text-sm font-medium text-gray-700">Title</Label>
                    <Input
                      id={`banner-title-${index}`}
                      value={banner.title}
                      onChange={(e) => {
                        const newBanners = [...homepageData.banners] as [IBannerContent, IBannerContent];
                        newBanners[index] = { ...banner, title: e.target.value };
                        setHomepageData({ ...homepageData, banners: newBanners });
                      }}
                      className="mt-1"
                      placeholder="Banner title"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`banner-description-${index}`} className="text-sm font-medium text-gray-700">Description</Label>
                  <Textarea
                    id={`banner-description-${index}`}
                    value={banner.description}
                    onChange={(e) => {
                      const newBanners = [...homepageData.banners] as [IBannerContent, IBannerContent];
                      newBanners[index] = { ...banner, description: e.target.value };
                      setHomepageData({ ...homepageData, banners: newBanners });
                    }}
                    className="mt-1"
                    placeholder="Banner description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`banner-buttontext-${index}`} className="text-sm font-medium text-gray-700">Button Text</Label>
                    <Input
                      id={`banner-buttontext-${index}`}
                      value={banner.buttonText}
                      onChange={(e) => {
                        const newBanners = [...homepageData.banners] as [IBannerContent, IBannerContent];
                        newBanners[index] = { ...banner, buttonText: e.target.value };
                        setHomepageData({ ...homepageData, banners: newBanners });
                      }}
                      className="mt-1"
                      placeholder="Button text"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`banner-buttonlink-${index}`} className="text-sm font-medium text-gray-700">Button Link</Label>
                    <Input
                      id={`banner-buttonlink-${index}`}
                      value={banner.buttonLink}
                      onChange={(e) => {
                        const newBanners = [...homepageData.banners] as [IBannerContent, IBannerContent];
                        newBanners[index] = { ...banner, buttonLink: e.target.value };
                        setHomepageData({ ...homepageData, banners: newBanners });
                      }}
                      className="mt-1"
                      placeholder="/category/example"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* SEO Section */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
          <CardTitle className="text-2xl font-bold text-gray-900">SEO Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="seo-title" className="text-sm font-medium text-gray-700">Title</Label>
              <Input
                id="seo-title"
                value={homepageData.seo.title}
                onChange={(e) =>
                  setHomepageData({
                    ...homepageData,
                    seo: { ...homepageData.seo, title: e.target.value },
                  })
                }
                className="mt-1"
                placeholder="Homepage SEO title"
              />
            </div>
            <div>
              <Label htmlFor="seo-canonical" className="text-sm font-medium text-gray-700">Canonical URL</Label>
              <Input
                id="seo-canonical"
                value={homepageData.seo.canonicalUrl || ''}
                onChange={(e) =>
                  setHomepageData({
                    ...homepageData,
                    seo: { ...homepageData.seo, canonicalUrl: e.target.value },
                  })
                }
                className="mt-1"
                placeholder="https://example.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="seo-description" className="text-sm font-medium text-gray-700">Description</Label>
            <Textarea
              id="seo-description"
              value={homepageData.seo.description}
              onChange={(e) =>
                setHomepageData({
                  ...homepageData,
                  seo: { ...homepageData.seo, description: e.target.value },
                })
              }
              className="mt-1"
              placeholder="Homepage meta description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="seo-keywords" className="text-sm font-medium text-gray-700">Keywords (comma separated)</Label>
            <Input
              id="seo-keywords"
              value={homepageData.seo.keywords.join(', ')}
              onChange={(e) =>
                setHomepageData({
                  ...homepageData,
                  seo: {
                    ...homepageData.seo,
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k),
                  },
                })
              }
              className="mt-1"
              placeholder="fashion, clothing, style, ecommerce"
            />
          </div>
        </CardContent>
      </Card>

      {/* Publication Status */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50">
          <CardTitle className="text-2xl font-bold text-gray-900">Publication</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="is-published"
              checked={homepageData.isPublished}
              onChange={(e) =>
                setHomepageData({ ...homepageData, isPublished: e.target.checked })
              }
              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <Label htmlFor="is-published" className="text-lg font-medium text-gray-700">
              Publish homepage to make it live
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
