"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Plus, Trash2, GripVertical, Save, RotateCcw, Settings, Eye, Edit3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavbarService } from '@/services/navbar.service';
import { INavbarData, IUpdateNavbarData, ICreateNavbarSection, ICreateNavbarCategory, ICreateNavbarItem } from '@/types/navbar.interface';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const NavbarManagement = () => {
  const { getNavbar, updateNavbar, deleteNavbar, loading, error } = useNavbarService();
  const [navbarData, setNavbarData] = useState<INavbarData | null>(null);
  const [editingData, setEditingData] = useState<ICreateNavbarSection[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDefault, setIsDefault] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchNavbarData();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchNavbarData = async () => {
    try {
      const response = await getNavbar();
      if (response) {
        setNavbarData(response);
        setIsInitialized(true);

        // Check if this is the default navbar (no saved navbar in database)
        setIsDefault(response.message?.includes('Default navbar') || false);

        // Convert to editing format
        const editingFormat = response.navItems?.map((section: any) => ({
          title: section.title,
          categories: section.categories?.map((category: any) => ({
            title: category.title,
            items: category.items?.map((item: any) => ({
              label: item.label,
              keyword: item.keyword,
              href: item.href
            })) || []
          })) || []
        })) || [];
        setEditingData(editingFormat);
      } else {
        setIsInitialized(false);
        setIsDefault(true);
      }
    } catch (err) {
      console.error('Error fetching navbar:', err);
      setMessage({ type: 'error', text: 'Failed to load navbar data' });
      setIsInitialized(false);
    }
  };

  const initializeNavbar = async () => {
    const defaultNavbar: IUpdateNavbarData = {
      navItems: [
        {
          title: "WOMEN",
          categories: [
            {
              title: "Women's Clothing",
              items: [
                { label: "T-Shirts", keyword: "womens-tshirts", href: "/womens/t-shirts" },
                { label: "Skirts", keyword: "womens-skirts", href: "/womens/skirts" },
                { label: "Shorts", keyword: "womens-shorts", href: "/womens/shorts" },
                { label: "Jeans", keyword: "womens-jeans", href: "/womens/jeans" }
              ]
            }
          ]
        },
        {
          title: "MEN",
          categories: [
            {
              title: "Men's Clothing",
              items: [
                { label: "T-Shirts", keyword: "mens-tshirts", href: "/mens/t-shirts" },
                { label: "Shirts", keyword: "mens-shirts", href: "/mens/shirts" },
                { label: "Jeans", keyword: "mens-jeans", href: "/mens/jeans" }
              ]
            }
          ]
        }
      ]
    };

    try {
      const response = await updateNavbar(defaultNavbar);
      if (response) {
        setMessage({ type: 'success', text: 'Navbar initialized successfully!' });
        await fetchNavbarData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to initialize navbar' });
    }
  };

  const handleSave = async () => {
    try {
      const updateData: IUpdateNavbarData = {
        navItems: editingData
      };

      const response = await updateNavbar(updateData);
      if (response) {
        setMessage({ type: 'success', text: 'Navbar updated successfully!' });
        setIsEditing(false);
        await fetchNavbarData();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save navbar data' });
    }
  };

  const handleReset = async () => {
    try {
      const response = await deleteNavbar();
      if (response) {
        setMessage({ type: 'success', text: 'Navbar reset to default successfully!' });
        await fetchNavbarData();
        setIsEditing(false);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reset navbar' });
    }
  };

  const addSection = () => {
    const newSection: ICreateNavbarSection = {
      title: `New Section ${editingData.length + 1}`,
      categories: []
    };
    setEditingData([...editingData, newSection]);
  };

  const updateSection = (sectionIndex: number, field: keyof ICreateNavbarSection, value: any) => {
    const newData = [...editingData];
    newData[sectionIndex] = { ...newData[sectionIndex], [field]: value };
    setEditingData(newData);
  };

  const removeSection = (sectionIndex: number) => {
    const newData = editingData.filter((_, index) => index !== sectionIndex);
    setEditingData(newData);
  };

  const addCategory = (sectionIndex: number) => {
    const newCategory: ICreateNavbarCategory = {
      title: `New Category`,
      items: []
    };
    const newData = [...editingData];
    newData[sectionIndex].categories.push(newCategory);
    setEditingData(newData);
  };

  const updateCategory = (sectionIndex: number, categoryIndex: number, field: keyof ICreateNavbarCategory, value: any) => {
    const newData = [...editingData];
    newData[sectionIndex].categories[categoryIndex] = {
      ...newData[sectionIndex].categories[categoryIndex],
      [field]: value
    };
    setEditingData(newData);
  };

  const removeCategory = (sectionIndex: number, categoryIndex: number) => {
    const newData = [...editingData];
    newData[sectionIndex].categories = newData[sectionIndex].categories.filter((_, index) => index !== categoryIndex);
    setEditingData(newData);
  };

  const addItem = (sectionIndex: number, categoryIndex: number) => {
    const newItem: ICreateNavbarItem = {
      label: 'New Item',
      keyword: 'new-item',
      href: '/new-item'
    };
    const newData = [...editingData];
    newData[sectionIndex].categories[categoryIndex].items.push(newItem);
    setEditingData(newData);
  };

  const updateItem = (sectionIndex: number, categoryIndex: number, itemIndex: number, field: keyof ICreateNavbarItem, value: string) => {
    const newData = [...editingData];
    newData[sectionIndex].categories[categoryIndex].items[itemIndex] = {
      ...newData[sectionIndex].categories[categoryIndex].items[itemIndex],
      [field]: value
    };
    setEditingData(newData);
  };

  const removeItem = (sectionIndex: number, categoryIndex: number, itemIndex: number) => {
    const newData = [...editingData];
    newData[sectionIndex].categories[categoryIndex].items = newData[sectionIndex].categories[categoryIndex].items.filter((_, index) => index !== itemIndex);
    setEditingData(newData);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading navbar configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex md:flex-row gap-2 flex-col justify-between lg:items-center">
        <div>
          <h1 className="lg:text-3xl font-bold">Navbar Management</h1>
          <p className="text-muted-foreground">Customize your website navigation structure</p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          {!isInitialized ? (
            <Button
              onClick={initializeNavbar}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Initialize Navbar
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {isEditing ? (
                  <>
                    <Eye className="h-4 w-4" />
                    View
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
              {isEditing && (
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              )}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" disabled={loading}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reset Navbar to Default</DialogTitle>
                    <DialogDescription>
                      This action will reset your navbar to the default configuration. All customizations will be lost. This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button variant="destructive" onClick={handleReset}>
                      Reset Navbar
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {message && (
        <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Error state */}
      {error && (
        <Alert className="border-red-500 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Error: {error}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchNavbarData}
              className="ml-2"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Uninitialized state */}
      {!isInitialized && !loading && (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Settings className="h-6 w-6" />
              Navbar Not Configured
            </CardTitle>
            <CardDescription>
              Your navigation menu has not been set up yet. Initialize it with a default structure to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Default Structure Includes:</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Women's section with clothing categories</p>
                <p>• Men's section with clothing categories</p>
                <p>• Fully customizable after initialization</p>
              </div>
            </div>
            <Button
              onClick={initializeNavbar}
              disabled={loading}
              size="lg"
              className="flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              Initialize Default Navbar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Current Navbar Preview */}
      {!isEditing && navbarData && isInitialized && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Current Navbar Structure
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              Preview of your current navigation menu
              {isDefault && (
                <Badge variant="secondary">Using Default Configuration</Badge>
              )}
              {navbarData.lastUpdated && (
                <Badge variant="outline">
                  Last updated: {new Date(navbarData.lastUpdated).toLocaleDateString()}
                </Badge>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {navbarData.navItems?.map((section: any, sectionIndex: number) => (
                <div key={section.id || sectionIndex} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">{section.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.categories?.map((category: any, categoryIndex: number) => (
                      <div key={category.id || categoryIndex} className="border rounded p-3">
                        <h4 className="font-medium mb-2 text-primary">{category.title}</h4>
                        <ul className="space-y-1">
                          {category.items?.map((item: any, itemIndex: number) => (
                            <li key={itemIndex} className="text-sm flex items-center gap-2">
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <span>{item.label}</span>
                              <Badge variant="outline" className="text-xs">{item.keyword}</Badge>
                            </li>
                          )) || <li className="text-sm text-muted-foreground">No items</li>}
                        </ul>
                      </div>
                    )) || <div className="text-sm text-muted-foreground">No categories</div>}
                  </div>
                </div>
              )) || <div className="text-center text-muted-foreground">No sections configured</div>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Editing Interface */}
      {isEditing && isInitialized && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Edit Navbar Structure
            </CardTitle>
            <CardDescription>
              Add, edit, or remove navigation sections, categories, and items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button onClick={addSection} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Section
            </Button>

            {editingData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sections configured. Add a section to get started.</p>
              </div>
            ) : (
              <Accordion type="multiple" className="w-full">
                {editingData.map((section, sectionIndex) => (
                  <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2 w-full">
                        <GripVertical className="h-4 w-4" />
                        <span className="font-medium">{section.title}</span>
                        <Badge variant="secondary">{section.categories.length} categories</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="flex  items-center gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`section-title-${sectionIndex}`}>Section Title</Label>
                          <Input
                            id={`section-title-${sectionIndex}`}
                            value={section.title}
                            onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                            placeholder="Section title (e.g., WOMEN, MEN, KIDS)"
                          />
                        </div>
                        <div className='max-sm:mt-auto  '>

                          <Button
                            variant="destructive"
                            size="icon"

                            onClick={() => removeSection(sectionIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-4 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addCategory(sectionIndex)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-3 w-3" />
                          Add Category
                        </Button>

                        {section.categories.map((category, categoryIndex) => (
                          <div key={categoryIndex} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center gap-2">
                              <div className="flex-1">
                                <Label htmlFor={`category-title-${sectionIndex}-${categoryIndex}`}>Category Title</Label>
                                <Input
                                  id={`category-title-${sectionIndex}-${categoryIndex}`}
                                  value={category.title}
                                  onChange={(e) => updateCategory(sectionIndex, categoryIndex, 'title', e.target.value)}
                                  placeholder="Category title (e.g., Women's Clothing)"
                                />
                              </div>
                              <div className='max-sm:mt-auto  '>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeCategory(sectionIndex, categoryIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2 ml-4">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addItem(sectionIndex, categoryIndex)}
                                className="flex items-center gap-2"
                              >
                                <Plus className="h-3 w-3" />
                                Add Item
                              </Button>

                              {category.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end p-3 gap-2 border rounded">
                                  <div>
                                    <Label htmlFor={`item-label-${sectionIndex}-${categoryIndex}-${itemIndex}`}>Label</Label>
                                    <Input
                                      id={`item-label-${sectionIndex}-${categoryIndex}-${itemIndex}`}
                                      value={item.label}
                                      onChange={(e) => updateItem(sectionIndex, categoryIndex, itemIndex, 'label', e.target.value)}
                                      placeholder="Display name"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`item-keyword-${sectionIndex}-${categoryIndex}-${itemIndex}`}>Keyword</Label>
                                    <Input
                                      id={`item-keyword-${sectionIndex}-${categoryIndex}-${itemIndex}`}
                                      value={item.keyword}
                                      onChange={(e) => updateItem(sectionIndex, categoryIndex, itemIndex, 'keyword', e.target.value)}
                                      placeholder="URL-friendly keyword"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor={`item-href-${sectionIndex}-${categoryIndex}-${itemIndex}`}>Link</Label>
                                    <Input
                                      id={`item-href-${sectionIndex}-${categoryIndex}-${itemIndex}`}
                                      value={item.href}
                                      onChange={(e) => updateItem(sectionIndex, categoryIndex, itemIndex, 'href', e.target.value)}
                                      placeholder="/path/to/page"
                                    />
                                  </div>
                                  <Button
                                    variant="destructive"
                                    size="icon"

                                    onClick={() => removeItem(sectionIndex, categoryIndex, itemIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default NavbarManagement;
