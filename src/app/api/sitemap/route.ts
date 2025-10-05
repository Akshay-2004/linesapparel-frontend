import { NextRequest, NextResponse } from "next/server";
import { SitemapService } from "@/services/sitemap.service";

export async function GET(request: NextRequest) {
  try {
    const sitemapService = new SitemapService();

    // Get all URLs
    const [staticUrls, productUrls, categoryUrls, blogUrls] = await Promise.all(
      [
        sitemapService.getStaticRoutes(),
        sitemapService.generateProductUrls(),
        sitemapService.generateCategoryUrls(),
        sitemapService.generateBlogUrls(),
      ]
    );

    const allUrls = [
      ...staticUrls,
      ...productUrls,
      ...categoryUrls,
      ...blogUrls,
    ];

    return NextResponse.json({
      success: true,
      totalUrls: allUrls.length,
      urls: allUrls,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error generating sitemap data:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate sitemap data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // This endpoint can be used to trigger sitemap regeneration
    // Useful for webhooks when content is updated

    const body = await request.json();
    const { type } = body; // 'product', 'category', 'blog', etc.

    const sitemapService = new SitemapService();
    let urls = [];

    switch (type) {
      case "product":
        urls = await sitemapService.generateProductUrls();
        break;
      case "category":
        urls = await sitemapService.generateCategoryUrls();
        break;
      case "blog":
        urls = await sitemapService.generateBlogUrls();
        break;
      default:
        // Regenerate all
        const [staticUrls, productUrls, categoryUrls, blogUrls] =
          await Promise.all([
            sitemapService.getStaticRoutes(),
            sitemapService.generateProductUrls(),
            sitemapService.generateCategoryUrls(),
            sitemapService.generateBlogUrls(),
          ]);
        urls = [...staticUrls, ...productUrls, ...categoryUrls, ...blogUrls];
    }

    return NextResponse.json({
      success: true,
      type: type || "all",
      urlsGenerated: urls.length,
      regeneratedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error regenerating sitemap:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to regenerate sitemap",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
