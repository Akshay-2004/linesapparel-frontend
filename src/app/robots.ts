import { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard/",
          "/api/",
          "/cart",
          "/orders",
          "/profile",
          "/wishlist",
          "/sign-in",
          "/sign-up",
          "/forgot-password",
          "/reset-password",
          "/verify",
          "/checkout",
          "/payment-error",
          "/thank-you",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
