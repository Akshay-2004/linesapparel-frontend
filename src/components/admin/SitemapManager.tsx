"use client";

import { useState } from "react";
import { useSitemap } from "@/hooks/useSitemap";

export function SitemapManager() {
  const { loading, data, error, fetchSitemapData, regenerateSitemap } =
    useSitemap();
  const [selectedType, setSelectedType] = useState<
    "product" | "category" | "blog" | "all"
  >("all");

  const handleFetchData = async () => {
    try {
      await fetchSitemapData();
    } catch (err) {
      console.error("Failed to fetch sitemap data:", err);
    }
  };

  const handleRegenerate = async () => {
    try {
      const type = selectedType === "all" ? undefined : selectedType;
      await regenerateSitemap(type);
      // Optionally refresh the data after regeneration
      await fetchSitemapData();
    } catch (err) {
      console.error("Failed to regenerate sitemap:", err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sitemap Management</h2>

      <div className="space-y-4">
        {/* Controls */}
        <div className="flex gap-4 items-center">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="all">All URLs</option>
            <option value="product">Products Only</option>
            <option value="category">Categories Only</option>
            <option value="blog">Blog Posts Only</option>
          </select>

          <button
            onClick={handleFetchData}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : "Fetch Sitemap Data"}
          </button>

          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Regenerating..." : "Regenerate Sitemap"}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Data Display */}
        {data && (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
              <strong>Success!</strong> Generated {data.totalUrls} URLs
              {data.generatedAt && (
                <span className="block text-sm mt-1">
                  Generated at: {new Date(data.generatedAt).toLocaleString()}
                </span>
              )}
            </div>

            {/* URL List */}
            {data.urls && data.urls.length > 0 && (
              <div className="border border-gray-300 rounded-md">
                <div className="p-3 bg-gray-50 border-b border-gray-300">
                  <h3 className="font-semibold">
                    Generated URLs ({data.urls.length})
                  </h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {data.urls.map((url, index) => (
                    <div
                      key={index}
                      className="p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <a
                            href={url.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline break-all"
                          >
                            {url.url}
                          </a>
                          <div className="text-sm text-gray-500 mt-1">
                            Priority: {url.priority} | Frequency:{" "}
                            {url.changeFrequency}
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                          {new Date(url.lastModified).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>
              • Your sitemap is automatically available at{" "}
              <code>/sitemap.xml</code>
            </li>
            <li>
              • Use "Fetch Sitemap Data" to see current URLs without
              regenerating
            </li>
            <li>
              • Use "Regenerate Sitemap" to update URLs after content changes
            </li>
            <li>
              • Select specific types to regenerate only certain URL categories
            </li>
            <li>
              • Make sure to update the data fetching functions in
              SitemapService
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
