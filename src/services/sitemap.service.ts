import path from "path";

// Sitemap service for managing dynamic URL generation
export interface SitemapUrl {
  url: string;
  lastModified: Date;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export interface Product {
  id: string;
  slug?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  slug?: string;
  name: string;
  updatedAt?: string;
}

export class SitemapService {
  private baseUrl: string;

  constructor(
    baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com"
  ) {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate product URLs for sitemap
   */
  async generateProductUrls(): Promise<SitemapUrl[]> {
    try {
      const products = await this.fetchProducts();

      return products.map((product) => ({
        url: `${this.baseUrl}/product/${product.slug || product.id}`,
        lastModified: new Date(
          product.updatedAt || product.createdAt || new Date()
        ),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    } catch (error) {
      console.error("Error generating product URLs:", error);
      return [];
    }
  }

  /**
   * Generate category URLs for sitemap
   */
  async generateCategoryUrls(): Promise<SitemapUrl[]> {
    try {
      const categories = await this.fetchCategories();

      return categories.map((category) => ({
        url: `${this.baseUrl}/products?category=${
          category.slug || encodeURIComponent(category.name)
        }`,
        lastModified: new Date(category.updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }));
    } catch (error) {
      console.error("Error generating category URLs:", error);
      return [];
    }
  }

  /**
   * Generate blog/content URLs if you have a blog section
   */
  async generateBlogUrls(): Promise<SitemapUrl[]> {
    try {
      // Implement if you have blog posts or content pages
      const posts = await this.fetchBlogPosts();

      return posts.map((post: any) => ({
        url: `${this.baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt),
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
    } catch (error) {
      console.error("Error generating blog URLs:", error);
      return [];
    }
  }

  /**
   * Fetch products from your database/API
   * Replace this with your actual implementation
   */
  private async fetchProducts(): Promise<Product[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const products = await response.json();
      return products;
    } catch (error) {
      console.error("Error fetching products for sitemap:", error);

      // Development fallback data

      return [];
    }
  }

  /**
   * Fetch categories from your database/API
   * Replace this with your actual implementation
   */
  private async fetchCategories(): Promise<Category[]> {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }

      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error("Error fetching categories for sitemap:", error);

      // Development fallback data

      return [];
    }
  }

  /**
   * Fetch blog posts if applicable
   */
  private async fetchBlogPosts(): Promise<any[]> {
    // Implement if you have blog functionality
    return [];
  }

  /**
   * Get static routes configuration
   */
  getStaticRoutes(): SitemapUrl[] {
    const currentDate = new Date();

    const publicRoutes = [
      { path: "", priority: 1, changeFrequency: "daily" as const },
      { path: "/products", priority: 0.9, changeFrequency: "daily" as const },
      { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
      { path: "/search", priority: 0.6, changeFrequency: "weekly" as const },
      { path: "/legal", priority: 0.3, changeFrequency: "yearly" as const },
    ];

    return publicRoutes.map((route) => ({
      url: `${this.baseUrl}${route.path}`,
      lastModified: currentDate,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));
  }
}
