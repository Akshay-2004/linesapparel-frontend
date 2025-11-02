"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  ChevronRight,
  User as UserIcon,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
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
import FullLogo from "@/assets/Lines.png";
import logo from "@/assets/Lines.png";

const UserNavBar = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [isFullSearchMode, setIsFullSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated } = useUserDetails();
  const { cart, fetchCart } = useCartStore();
  const { wishlisted, fetchWishlist } = useWishlistStore();
  const {
    navbarData,
    loading: navbarLoading,
    error: navbarError,
  } = useNavbarData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Check if on homepage
  const isHomepage = pathname === '/';

  // Track scroll position for homepage
  useEffect(() => {
    if (!isHomepage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

  // Use dynamic navbar data or fallback to default
  const menuItems = React.useMemo(() => {
    if (navbarData && navbarData.navItems && navbarData.navItems.length > 0) {
      return navbarData.navItems.map((section) => ({
        title: section.title,
        sections: section.categories.map((category) => ({
          title: category.title,
          items: category.items.map((item) => ({
            name: item.label,
            href: item.href,
          })),
        })),
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
              { name: "Jeans", href: "/womens/jeans" },
            ],
          },
        ],
      },
      {
        title: "MEN",
        sections: [
          {
            title: "Men's Clothing",
            items: [
              { name: "T-Shirts", href: "/mens/t-shirts" },
              { name: "Shirts", href: "/mens/shirts" },
              { name: "Jeans", href: "/mens/jeans" },
            ],
          },
        ],
      },
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
  const cartCount =
    cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  const toggleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const toggleDesktopSearch = () => {
    setIsFullSearchMode(!isFullSearchMode);
    if (!isFullSearchMode) {
      // Focus will be set when the input renders
    }
  };

  const closeFullSearch = () => {
    setIsFullSearchMode(false);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setShowMobileSearch(false);
      setIsFullSearchMode(false);
      setSearchQuery("");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(searchQuery);
    }
  };

  return (
    <header 
      className={`${isHomepage && !isScrolled ? 'absolute' : 'sticky'} top-0 px-4 z-50 w-full border-b transition-all duration-300 ${
        isHomepage && !isScrolled
          ? isHovered 
            ? 'bg-white border-gray-200' 
            : 'bg-transparent border-transparent' 
          : 'bg-white border-gray-200'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full Search Mode */}
      {isFullSearchMode ? (
        <div className="flex h-16 items-center mx-6 md:mx-auto md:container py-3">
          <div className="flex items-center w-full">
            <Button
              variant="ghost"
              size="icon"
              onClick={closeFullSearch}
              className="mr-4"
            >
              <ChevronRight className="h-6 w-6 rotate-180" />
              <span className="sr-only">Close search</span>
            </Button>
            <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center">
              <Input
                type="text"
                placeholder="Search for products..."
                className="flex-1 h-12 text-lg px-4 border-2 border-gray-300 focus:border-primary rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="ml-4 h-12 px-6"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      ) : (
        /* Normal Navbar */
        <div className="flex h-16 items-center mx-6 md:mx-auto md:container py-3">
          {/* Desktop Navigation - Left */}
          <nav className={`hidden md:flex items-center space-x-4 lg:space-x-6 ${
            isHomepage && !isScrolled && !isHovered ? 'text-white' : 'text-gray-900'
          }`}>
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
                      <NavigationMenuTrigger className={
                        isHomepage && !isScrolled && !isHovered 
                          ? 'text-white hover:text-white data-[state=open]:text-gray-900 !bg-transparent hover:!bg-transparent data-[state=open]:!bg-transparent' 
                          : ''
                      }>
                        {category.title}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="bg-white p-4 w-[400px] lg:w-[500px]">
                          <div
                            className={`grid ${
                              category.sections.length > 1 ? "grid-cols-2" : ""
                            } gap-6`}
                          >
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
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </nav>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center justify-center flex-1 h-10 w-auto">
            <Image
              src={FullLogo}
              alt="Logo"
              className="h-20 w-auto hidden md:block object-contain max-h-24"
              width={180}
              height={60}
              priority
            />
            <Image
              src={logo}
              alt="Logo"
              className="h-20 w-auto md:hidden object-contain max-h-24"
              width={40}
              height={32}
              priority
            />
          </Link>

          {/* Right Side - Search & Auth */}
          <div className="flex items-center space-x-2">
            {/* Desktop Search */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDesktopSearch}
              className={`p-2 ${isHomepage && !isScrolled && !isHovered ? 'text-white hover:text-white' : ''}`}
            >
              <Search className="h-7 w-7" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Authentication */}
            <div className="flex items-center space-x-2">
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
                      <Button 
                        variant="ghost" 
                        className={`hidden md:flex p-2 ${
                          isHomepage && !isScrolled && !isHovered ? 'text-white hover:text-white' : ''
                        }`}
                      >
                        <UserIcon className="h-7 w-7" />
                      </Button>
                    )}
                  </Link>
                  <Link href="/wishlist">
                    <Button
                      variant="ghost"
                      className={`hidden md:flex relative p-2 ${
                        isHomepage && !isScrolled && !isHovered ? 'text-white hover:text-white' : ''
                      }`}
                    >
                      <Heart className="h-7 w-7" />
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
                  <Button 
                    variant="ghost"
                    className={`hidden md:flex p-2 ${
                      isHomepage && !isScrolled && !isHovered ? 'text-white hover:text-white' : ''
                    }`}
                  >
                    <UserIcon className="h-7 w-7" />
                  </Button>
                </Link>
              )}
              <Link href="/cart">
                <Button 
                  variant="ghost"
                  className={`hidden md:flex relative p-2 ${
                    isHomepage && !isScrolled && !isHovered ? 'text-white hover:text-white' : ''
                  }`}
                >
                  <ShoppingCart className="h-7 w-7" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden flex items-center">
            {showMobileSearch ? (
              <div className="absolute left-0 top-0 w-full h-16 flex items-center px-4 bg-white z-50">
                <form
                  onSubmit={handleSearchSubmit}
                  className="flex-1 flex items-center"
                >
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
                    <Search className="h-6 w-6" />
                  </Button>
                </form>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2"
                  onClick={toggleMobileSearch}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileSearch}
                className={isHomepage && !isScrolled && !isHovered ? 'text-white hover:text-white' : ''}
              >
                <Search className="h-6 w-6" />
                <span className="sr-only">Search</span>
              </Button>
            )}
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`md:hidden ml-2 ${
                  isHomepage && !isScrolled && !isHovered ? 'text-white hover:text-white' : ''
                }`}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 px-3">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex flex-col space-y-6 py-4">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/Lines.pnglogo full.png"
                    alt="Logo"
                    className="h-auto w-auto"
                    width={120}
                    height={40}
                    priority
                  />
                </Link>

                {/* Mobile Accordion Menu */}
                {navbarLoading ? (
                  <div className="space-y-4">
                    <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ) : navbarError ? (
                  <div className="text-sm text-red-500 text-center py-4">
                    Navigation unavailable
                  </div>
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
                        <Button
                          variant="default"
                          className="w-full flex items-center justify-center"
                        >
                          {user?.image ? (
                            <Image
                              src={user.image}
                              alt="User Avatar"
                              width={28}
                              height={28}
                              className="rounded-full mr-2"
                            />
                          ) : (
                            <UserIcon className="h-6 w-6 mr-2" />
                          )}
                          Dashboard
                        </Button>
                      </Link>
                      <Link href="/whishlist">
                        <Button
                          variant="outline"
                          className="w-full flex items-center justify-center relative"
                        >
                          <Heart className="h-5 w-5 mr-2" />
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
                      <Button variant="default" className="w-full">
                        Log In
                      </Button>
                    </Link>
                  )}
                  <Link href="/cart">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center relative"
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
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
      )}
    </header>
  );
};

export default UserNavBar;
