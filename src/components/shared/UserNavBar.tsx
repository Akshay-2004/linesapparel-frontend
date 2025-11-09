"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  ShoppingCart,
  ChevronRight,
  User as UserIcon,
  Heart,
  ChevronDown,
  X,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { useApi } from "@/hooks/useApi";
import logo1 from '@/assets/logo with out text.png';
import logo2 from '@/assets/logo with text.png';

interface TextBanner {
  _id: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const UserNavBar = () => {
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [isFullSearchMode, setIsFullSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [textBanners, setTextBanners] = useState<TextBanner[]>([]);
  const bannerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user, isAuthenticated } = useUserDetails();
  const { cart, fetchCart } = useCartStore();
  const { wishlisted, fetchWishlist } = useWishlistStore();
  const {
    navbarData,
    loading: navbarLoading,
    error: navbarError,
  } = useNavbarData();
  const { fetchData: fetchTextBanners } = useApi<{ success: boolean; data: TextBanner[] }>();
  
  const [isExitingSearch, setIsExitingSearch] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  // Check if on homepage
  const isHomepage = pathname === '/';

  // Fetch text banners
  useEffect(() => {
    const getTextBanners = async () => {
      try {
        const response = await fetchTextBanners('/text-banners/active', {
          method: 'GET',
        });
        if (response && response && Array.isArray(response)) {
          setTextBanners(response);
        }
      } catch (error) {
        console.error('Error fetching text banners:', error);
        // Fallback to default banner if API fails
        setTextBanners([{
          _id: 'fallback',
          content: 'Free shipping on all orders above $60',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }]);
      }
    };

    getTextBanners();
  }, []);

  // Auto-rotate banners
  useEffect(() => {
    if (textBanners.length > 1) {
      bannerIntervalRef.current = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          (prevIndex + 1) % textBanners.length
        );
      }, 4000); // Change banner every 4 seconds

      return () => {
        if (bannerIntervalRef.current) {
          clearInterval(bannerIntervalRef.current);
        }
      };
    }
  }, [textBanners.length]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (bannerIntervalRef.current) {
        clearInterval(bannerIntervalRef.current);
      }
    };
  }, []);

  // Banner navigation functions
  const goToPreviousBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      prevIndex === 0 ? textBanners.length - 1 : prevIndex - 1
    );
    // Reset auto-rotation timer when manually navigating
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
      bannerIntervalRef.current = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          (prevIndex + 1) % textBanners.length
        );
      }, 4000);
    }
  };

  const goToNextBanner = () => {
    setCurrentBannerIndex((prevIndex) => 
      (prevIndex + 1) % textBanners.length
    );
    // Reset auto-rotation timer when manually navigating
    if (bannerIntervalRef.current) {
      clearInterval(bannerIntervalRef.current);
      bannerIntervalRef.current = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          (prevIndex + 1) % textBanners.length
        );
      }, 4000);
    }
  };

  // Track scroll position for homepage
  useEffect(() => {
    if (!isHomepage) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
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

  const toggleDesktopSearch = () => {
    setIsFullSearchMode(!isFullSearchMode);
    if (!isFullSearchMode) {
      // Focus will be set when the input renders
    }
  };

  const closeFullSearch = () => {
    setIsExitingSearch(true);
    setIsFullSearchMode(false);
    setSearchQuery("");
    // Reset the exiting state after animation would complete
    setTimeout(() => setIsExitingSearch(false), 600);
  };

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
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
    <>
      {/* Top Banner - Only visible on homepage when not scrolled */}
      {isHomepage && !isScrolled && textBanners.length > 0 && (
        <div className="w-full bg-primary text-white text-center py-2 text-sm font-semibold transition-all duration-500 relative overflow-hidden">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-4">
            {/* Previous Button */}
            {textBanners.length > 1 && (
              <button
                onClick={goToPreviousBanner}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-white/10 rounded"
                aria-label="Previous banner"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}
            
            {/* Banner Text */}
            <div className="flex-1 flex items-center justify-center min-h-[24px]">
              <div
                key={currentBannerIndex}
                className="animate-in fade-in-0 slide-in-from-right-2 duration-300"
              >
                {textBanners[currentBannerIndex]?.content}
              </div>
            </div>

            {/* Next Button */}
            {textBanners.length > 1 && (
              <button
                onClick={goToNextBanner}
                className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-white/10 rounded"
                aria-label="Next banner"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      <header 
      className={`${isHomepage && !isScrolled && !isFullSearchMode ? 'fixed top-9' : 'fixed'} top-0 px-2 md:px-4 z-50 w-full border-b transition-all duration-500`}
      style={{
        backgroundColor: isHomepage && !isScrolled && !isHovered && !isFullSearchMode
          ? 'transparent' 
          : 'rgb(255 255 255)',
        borderColor: isHomepage && !isScrolled && !isHovered && !isFullSearchMode
          ? 'transparent' 
          : 'rgb(229 231 235)',
        transition: isExitingSearch ? 'none' : 'all 500ms ease-in-out'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Full Search Mode */}
      {isFullSearchMode ? (
        <div className="flex h-auto items-center mx-6 md:mx-auto md:container py-6">
          <div className="flex items-center w-full justify-center">
            <form onSubmit={handleSearchSubmit} className="flex items-center max-w-2xl w-full gap-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full h-12 text-lg pl-4 pr-12 border-2 border-gray-300 focus:border-primary rounded-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10"
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={closeFullSearch}
                className="h-12 w-12 flex-shrink-0"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close search</span>
              </Button>
            </form>
          </div>
        </div>
      ) : (
        /* Normal Navbar */
        <div className="flex h-auto items-center mx-4 md:mx-auto md:container py-6">
          {/* Desktop Navigation - Left */}
          <nav className={`hidden md:flex items-center space-x-4 lg:space-x-6 transition-colors duration-500 ${
            isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white' : 'text-gray-900'
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
              <div className="flex items-center space-x-4 lg:space-x-6">
                {menuItems.map((category, index) => (
                  <div 
                    key={index} 
                    className="relative"
                    ref={(el) => {
                      dropdownRefs.current[index] = el;
                    }}
                    onMouseEnter={() => {
                      if (closeTimeout) clearTimeout(closeTimeout);
                      setCloseTimeout(null);
                      setOpenDropdown(index);
                    }}
                    onMouseLeave={() => {
                      const timeout = setTimeout(() => setOpenDropdown(null), 300);
                      setCloseTimeout(timeout);
                    }}
                  >
                    <button
                      className={`inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-semibold transition-all duration-500 ${
                        isHomepage && !isScrolled && !isHovered && !isFullSearchMode
                          ? 'text-white hover:text-white'
                          : 'text-gray-900 hover:bg-gray-100'
                      }`}
                      style={{
                        backgroundColor: isHomepage && !isScrolled && !isHovered 
                          ? 'transparent' 
                          : openDropdown === index 
                            ? 'rgb(243 244 246)' 
                            : 'transparent',
                        transition: 'all 500ms ease-in-out'
                      }}
                    >
                      {category.title}
                      <ChevronDown 
                        className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                          openDropdown === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {openDropdown === index && (
                      <div 
                        className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-200"
                        style={{
                          width: category.sections.length > 1 ? '500px' : '400px'
                        }}
                        onMouseEnter={() => {
                          if (closeTimeout) clearTimeout(closeTimeout);
                          setCloseTimeout(null);
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => setOpenDropdown(null), 300);
                          setCloseTimeout(timeout);
                        }}
                      >
                        <div className="p-4">
                          <div className={`grid ${category.sections.length > 1 ? "grid-cols-2" : ""} gap-6`}>
                            {category.sections.map((section, sectionIndex) => (
                              <div key={sectionIndex}>
                                <h3 className="text-sm font-semibold mb-3 text-primary border-b pb-2">
                                  {section.title}
                                </h3>
                                <ul className="space-y-3">
                                  {section.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                      <Link
                                        href={item.href}
                                        className="group flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </nav>

          {/* Logo - Center */}
          <Link href="/" className="flex items-center justify-center flex-1 h-10 w-auto relative">
            {/* Logo 1 - Fades out when scrolled/hovered */}
            <Image
              src={logo1}
              alt="Logo"
              className={`h-20 w-auto hidden md:block object-contain max-h-24 absolute transition-all duration-500 ${
                isHomepage && !isScrolled && !isHovered 
                  ? 'opacity-100 filter invert brightness-0' 
                  : isHomepage && !isScrolled 
                    ? 'opacity-100' 
                    : 'opacity-0 pointer-events-none'
              }`}
              width={180}
              height={60}
              priority
            />
            {/* Logo 2 - Fades in when scrolled/hovered */}
            <Image
              src={logo2}
              alt="Logo"
              className={`h-20 w-auto hidden md:block object-contain max-h-24 transition-all duration-500 ${
                isHomepage && !isScrolled 
                  ? 'opacity-0 pointer-events-none' 
                  : 'opacity-100'
              }`}
              width={180}
              height={60}
              priority
            />
            
            {/* Mobile logos */}
            <Image
              src={logo1}
              alt="Logo"
              className={`h-20 w-auto md:hidden object-contain max-h-24 absolute transition-all duration-500 ${
                isHomepage && !isScrolled && !isHovered 
                  ? 'opacity-100 filter invert brightness-0' 
                  : isHomepage && !isScrolled 
                    ? 'opacity-100' 
                    : 'opacity-0 pointer-events-none'
              }`}
              width={40}
              height={32}
              priority
            />
            <Image
              src={logo2}
              alt="Logo"
              className={`h-20 w-auto md:hidden object-contain max-h-24 transition-all duration-500 ${
                isHomepage && !isScrolled 
                  ? 'opacity-0 pointer-events-none' 
                  : 'opacity-100'
              }`}
              width={40}
              height={32}
              priority
            />
          </Link>

          {/* Right Side - Search & Auth */}
          <div className="flex items-center space-x-2">
            {/* Desktop Search */}
            <button 
              onClick={toggleDesktopSearch}
              className={`hidden md:flex items-center justify-center p-3 transition-colors duration-500 h-12 w-12 bg-transparent hover:bg-gray-100 rounded-md ${isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white hover:text-white' : 'text-gray-900'}`}
            >
              <Search className="h-10 w-10" />
              <span className="sr-only">Search</span>
            </button>

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
                      <button 
                        className={`hidden md:flex items-center justify-center p-3 transition-colors duration-500 h-12 w-12 bg-transparent hover:bg-gray-100 rounded-md ${
                          isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white hover:text-white' : 'text-gray-900'
                        }`}
                      >
                        <UserIcon className="h-10 w-10" />
                      </button>
                    )}
                  </Link>
                  <Link href="/wishlist">
                    <button
                      className={`hidden md:flex items-center justify-center relative p-3 transition-colors duration-500 h-12 w-12 bg-transparent hover:bg-gray-100 rounded-md ${
                        isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white hover:text-white' : 'text-gray-900'
                      }`}
                    >
                      <Heart className="h-10 w-10" />
                      {wishlisted.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                          {wishlisted.length}
                        </span>
                      )}
                    </button>
                  </Link>
                </>
              ) : (
                <Link href="/sign-in">
                  <button 
                    className={`hidden md:flex items-center justify-center p-3 transition-colors duration-500 h-12 w-12 bg-transparent hover:bg-gray-100 rounded-md ${
                      isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white hover:text-white' : 'text-gray-900'
                    }`}
                  >
                    <UserIcon className="h-10 w-10" />
                  </button>
                </Link>
              )}
              <Link href="/cart">
                <button 
                  className={`hidden md:flex items-center justify-center relative p-3 transition-colors duration-500 h-12 w-12 bg-transparent hover:bg-gray-100 rounded-md ${
                    isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white hover:text-white' : 'text-gray-900'
                  }`}
                >
                  <ShoppingCart className="h-10 w-10" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>

          {/* Mobile Layout - Menu | Logo | Search | Cart */}
          <div className="md:hidden flex items-center justify-between w-full">
            {/* Left: Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className={`flex items-center justify-center transition-colors duration-500 h-10 w-10 md:h-12 md:w-12 p-2 md:p-3 bg-transparent hover:bg-gray-100 rounded-md ${isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white hover:text-white' : 'text-gray-900'}`}
                >
                  <Menu className="h-8 w-8 md:h-10 md:w-10" />
                  <span className="sr-only">Toggle menu</span>
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 px-3">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col space-y-6 py-4">
                  <Link href="/" className="flex items-center">
                    <Image
                      src={logo2}
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
                            <div className="space-y-4">
                              {category.sections.map((section, sectionIndex) => (
                                <div key={sectionIndex}>
                                  <div className="text-sm font-semibold ml-2 mb-2 text-primary">
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
                                          <span className="text-sm font-semibold">{item.name}</span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
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
                        <Link href="/wishlist">
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

            {/* Center: Logo */}
            <Link href="/" className="flex items-center justify-center flex-1">
              {/* Logo 1 - Fades out when scrolled/hovered */}
              <Image
                src={logo1}
                alt="Logo"
                className={`h-16 w-auto object-contain max-h-20 absolute transition-all duration-500 ${
                  isHomepage && !isScrolled && !isHovered
                    ? 'opacity-100 filter invert brightness-0'
                    : isHomepage && !isScrolled
                      ? 'opacity-100'
                      : 'opacity-0 pointer-events-none'
                }`}
                width={120}
                height={40}
                priority
              />
              {/* Logo 2 - Fades in when scrolled/hovered */}
              <Image
                src={logo2}
                alt="Logo"
                className={`h-16 w-auto object-contain max-h-20 transition-all duration-500 ${
                  isHomepage && !isScrolled
                    ? 'opacity-0 pointer-events-none'
                    : 'opacity-100'
                }`}
                width={120}
                height={40}
                priority
              />
            </Link>

            {/* Right: Search & Cart */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search */}
              <button 
                onClick={toggleDesktopSearch}
                className={`flex items-center justify-center transition-colors duration-500 h-10 w-10 md:h-12 md:w-12 p-2 md:p-3 bg-transparent hover:bg-gray-100 rounded-md ${isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white hover:text-white' : 'text-gray-900'}`}
              >
                <Search className="h-8 w-8 md:h-10 md:w-10" />
                <span className="sr-only">Search</span>
              </button>

              {/* Mobile Cart */}
              <Link href="/cart">
                <button
                  className={`flex items-center justify-center relative transition-colors duration-500 h-10 w-10 md:h-12 md:w-12 p-2 md:p-3 bg-transparent hover:bg-gray-100 rounded-md ${isHomepage && !isScrolled && !isHovered && !isFullSearchMode ? 'text-white hover:text-white' : 'text-gray-900'}`}
                >
                  <ShoppingCart className="h-8 w-8 md:h-10 md:w-10" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  </>
  );
};

export default UserNavBar;
