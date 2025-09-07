"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingCart, ChevronRight, User as UserIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUserDetails } from "@/hooks/useUserDetails";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useNavbarData } from "@/hooks/useNavbarData";
import { usePathname, useRouter } from "next/navigation";
import FullLogo from '@/assets/logo full.png'
import logo from '@/assets/logo.png'

const UserNavBar = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useUserDetails();
  const { cart, fetchCart } = useCartStore();
  const { wishlisted, fetchWishlist } = useWishlistStore();
  const { navbarData, loading: navbarLoading, error: navbarError } = useNavbarData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Use dynamic navbar data or fallback to default
  const menuItems = React.useMemo(() => {
    if (navbarData && navbarData.navItems && navbarData.navItems.length > 0) {
      return navbarData.navItems.map(section => ({
        title: section.title,
        sections: section.categories.map(category => ({
          title: category.title,
          items: category.items.map(item => ({
            name: item.label,
            href: item.href
          }))
        }))
      }));
    }
    
    // Fallback default menu structure
    return [
      {
        title: "WOMEN",
        sections: [
          {
            title: "Women's Clothing",
            items: [
              { name: "T-Shirts", href: "/womens/t-shirts" },
              { name: "Skirts", href: "/womens/skirts" },
              { name: "Shorts", href: "/womens/shorts" },
              { name: "Jeans", href: "/womens/jeans" }
            ]
          }
        ]
      },
      {
        title: "MEN", 
        sections: [
          {
            title: "Men's Clothing",
            items: [
              { name: "T-Shirts", href: "/mens/t-shirts" },
              { name: "Shirts", href: "/mens/shirts" },
              { name: "Jeans", href: "/mens/jeans" }
            ]
          }
        ]
      }
    ];
  }, [navbarData]);

  useEffect(() => {
    if (isAuthenticated() && user?.id) {
      fetchCart();
      fetchWishlist(user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Close mobile menu on route change (App Router: use pathname)
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Calculate total quantity of items in cart
  const cartCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setShowMobileSearch(false); // Close mobile search after navigation
      setSearchQuery(""); // Clear search query
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-14 items-center mx-4 md:mx-auto md:container">
        {/* Logo */}
        <Link href="/" className="flex items-center mr-6 h-10 w-auto">
          <Image
            src={FullLogo}
            alt="Logo"
            className="h-10 w-auto hidden md:block object-contain max-h-10"
            width={120}
            height={40}
            priority
          />
          <Image
            src={logo}
            alt="Logo"
            className="h-8 w-auto md:hidden object-contain max-h-8"
            width={40}
            height={32}
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {navbarLoading ? (
            <div className="flex items-center space-x-4">
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-12 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-14 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ) : navbarError ? (
            <div className="text-sm text-red-500">Navigation unavailable</div>
          ) : (
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((category, index) => (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuTrigger>{category.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="bg-white p-4 w-[400px] lg:w-[500px]">
                        <div className={`grid ${category.sections.length > 1 ? 'grid-cols-2' : ''} gap-6`}>
                          {category.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                              <h3 className="text-sm font-medium mb-3 text-primary border-b pb-2">
                                {section.title}
                              </h3>
                              <ul className="space-y-3">
                                {section.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      href={item.href}
                                      className="group flex items-center gap-2 text-sm hover:text-primary transition-colors"
                                    >
                                      <div className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-primary transition-colors"></div>
                                      <span>{item.name}</span>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                        <div className="mt-5 pt-3 border-t">
                          <Link
                            href={`/${category.title.toLowerCase()}`}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View all {category.title}
                          </Link>
                        </div>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}
        </nav>

        <div className="flex items-center justify-end w-full md:gap-8">
          {/* Desktop Search Box */}
          <div className="flex-1 hidden md:flex justify-end">
            <div className="w-full max-w-md">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden flex items-center">
            {showMobileSearch ? (
              <div className="absolute left-0 top-0 w-full h-14 flex items-center px-4 bg-white z-50">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="icon" 
                    className="ml-2"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </form>
                <Button variant="ghost" size="icon" className="ml-2" onClick={toggleMobileSearch}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={toggleMobileSearch}>
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>

          {/* Authentication */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <Link href="/profile">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="rounded-full hidden md:block"
                    />
                  ) : (
                    <Button variant="ghost" className="hidden md:flex p-0">
                      <UserIcon className="h-7 w-7" />
                    </Button>
                  )}
                </Link>
                <Link href="/wishlist">
                  <Button variant="ghost" className="hidden md:flex relative p-2">
                    <Heart className="h-5 w-5" />
                    {wishlisted.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                        {wishlisted.length}
                      </span>
                    )}
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/sign-in">
                <Button variant="default" className="hidden md:flex">
                  Log In
                </Button>
              </Link>
            )}
            <Link href="/cart">
              <Button variant="outline" className="hidden md:flex relative">
                <ShoppingCart className="h-4 w-4" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 px-3">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <div className="flex flex-col space-y-6 py-4">
              <Link href="/" className="flex items-center">
                <Image src="/logo full.png" alt="Logo" className="h-auto w-auto" width={120} height={40} priority />
              </Link>

              {/* Mobile Accordion Menu */}
              {navbarLoading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                  <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                </div>
              ) : navbarError ? (
                <div className="text-sm text-red-500 text-center py-4">Navigation unavailable</div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {menuItems.map((category, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                      <AccordionTrigger className="font-medium py-2">
                        {category.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {category.sections.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="mb-4">
                            <div className="font-medium text-sm ml-2 mb-2 text-primary">
                              {section.title}
                            </div>
                            <ul className="ml-4 space-y-2">
                              {section.items.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  <Link
                                    href={item.href}
                                    className="flex items-center hover:text-primary transition-colors"
                                  >
                                    <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                                    <span className="text-sm">{item.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}

              {/* Mobile Authentication */}
              <div className="flex flex-col space-y-2">
                {isAuthenticated() ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="default" className="w-full flex items-center justify-center">
                        {user?.image ? (
                          <Image
                            src={user.image}
                            alt="User Avatar"
                            width={28}
                            height={28}
                            className="rounded-full mr-2"
                          />
                        ) : (
                          <UserIcon className="h-5 w-5 mr-2" />
                        )}
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/whishlist">
                      <Button variant="outline" className="w-full flex items-center justify-center relative">
                        <Heart className="h-4 w-4 mr-2" />
                        <span>Wishlist</span>
                        {wishlisted.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                            {wishlisted.length}
                          </span>
                        )}
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/sign-in">
                    <Button variant="default" className="w-full">Log In</Button>
                  </Link>
                )}
                <Link href="/cart">
                  <Button variant="outline" className="w-full flex items-center justify-center relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    <span>Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default UserNavBar;
