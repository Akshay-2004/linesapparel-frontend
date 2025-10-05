import { useState } from "react";

interface SitemapData {
  success: boolean;
  totalUrls?: number;
  urls?: Array<{
    url: string;
    lastModified: Date;
    changeFrequency: string;
    priority: number;
  }>;
  generatedAt?: string;
  error?: string;
  message?: string;
}

export function useSitemap() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SitemapData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSitemapData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sitemap");
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch sitemap data");
      }

      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const regenerateSitemap = async (type?: "product" | "category" | "blog") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/sitemap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to regenerate sitemap");
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    error,
    fetchSitemapData,
    regenerateSitemap,
  };
}
