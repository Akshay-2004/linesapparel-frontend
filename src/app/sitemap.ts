import { MetadataRoute } from "next";
import { SitemapService } from "@/services/sitemap.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapService = new SitemapService();

  try {
    // Get static routes
    const staticUrls = sitemapService.getStaticRoutes();

    // Get dynamic routes
    const [productUrls, categoryUrls, blogUrls] = await Promise.all([
      sitemapService.generateProductUrls(),
      sitemapService.generateCategoryUrls(),
      sitemapService.generateBlogUrls(),
    ]);

    // Convert to Next.js sitemap format
    const allUrls = [
      ...staticUrls,
      ...productUrls,
      ...categoryUrls,
      ...blogUrls,
    ];

    return allUrls.map((url) => ({
      url: url.url,
      lastModified: url.lastModified,
      changeFrequency: url.changeFrequency,
      priority: url.priority,
    }));
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Fallback to basic static routes
    const sitemapService = new SitemapService();
    const staticUrls = sitemapService.getStaticRoutes();

    return staticUrls.map((url) => ({
      url: url.url,
      lastModified: url.lastModified,
      changeFrequency: url.changeFrequency,
      priority: url.priority,
    }));
  }
}
