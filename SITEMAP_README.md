# Dynamic Sitemap for Next.js Ecommerce

This implementation provides a fully dynamic sitemap system for your Next.js ecommerce application.

## Features

- ✅ Automatic sitemap generation at `/sitemap.xml`
- ✅ Dynamic product and category URLs
- ✅ SEO-optimized with proper priorities and change frequencies
- ✅ Robots.txt integration
- ✅ Admin interface for sitemap management
- ✅ API endpoints for programmatic access
- ✅ Error handling and fallbacks

## Files Created

### Core Files

- `src/app/sitemap.ts` - Main sitemap generator
- `src/app/robots.ts` - Robots.txt configuration
- `src/services/sitemap.service.ts` - Sitemap generation service
- `src/app/api/sitemap/route.ts` - API endpoints for sitemap management

### UI Components

- `src/components/admin/SitemapManager.tsx` - Admin interface
- `src/hooks/useSitemap.ts` - React hook for sitemap operations

## Setup Instructions

### 1. Environment Configuration

Update your `.env` file with your production URL:

```env
NEXT_PUBLIC_SITE_URL="https://yourdomain.com"
```

### 2. Connect to Your Database

Update the data fetching functions in `src/services/sitemap.service.ts`:

```typescript
// Replace the placeholder functions with your actual data fetching
private async fetchProducts(): Promise<Product[]> {
  // Option 1: Direct database query
  const products = await ProductModel.find({}).select('_id slug updatedAt createdAt')
  return products

  // Option 2: API call
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
  return response.json()
}

private async fetchCategories(): Promise<Category[]> {
  // Similar implementation for categories
}
```

### 3. Add Admin Interface (Optional)

Add the SitemapManager component to your admin dashboard:

```tsx
import { SitemapManager } from "@/components/admin/SitemapManager";

export default function AdminDashboard() {
  return (
    <div>
      {/* Your other admin components */}
      <SitemapManager />
    </div>
  );
}
```

## Usage

### Automatic Generation

- Sitemap is automatically available at `/sitemap.xml`
- Robots.txt is available at `/robots.txt`
- Both update automatically when you deploy

### Manual Management

- Use the admin interface to view and regenerate sitemaps
- Call the API endpoints programmatically:

  ```bash
  # Get sitemap data
  GET /api/sitemap

  # Regenerate all URLs
  POST /api/sitemap

  # Regenerate specific type
  POST /api/sitemap
  Content-Type: application/json
  {"type": "product"}
  ```

### Webhook Integration

You can trigger sitemap regeneration when content changes:

```typescript
// After creating/updating a product
await fetch("/api/sitemap", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ type: "product" }),
});
```

## SEO Configuration

### URL Priorities

- Homepage: 1.0 (highest)
- Product pages: 0.7
- Category pages: 0.6
- Blog posts: 0.5
- Static pages: 0.3-0.8

### Change Frequencies

- Homepage: daily
- Products: weekly
- Categories: weekly
- Blog: monthly
- Legal pages: yearly

### Robots.txt Exclusions

The following paths are excluded from search engines:

- Admin dashboard (`/dashboard/`)
- API routes (`/api/`)
- User-specific pages (`/cart`, `/orders`, etc.)
- Authentication pages

## Customization

### Adding New URL Types

1. Add the interface to `sitemap.service.ts`
2. Create a fetch function
3. Add a generate function
4. Update the main sitemap generator

### Modifying Priorities

Update the priority values in `SitemapService.getStaticRoutes()` and the generate functions.

### Custom Change Frequencies

Modify the `changeFrequency` values based on how often your content updates.

## Testing

Test your sitemap:

```bash
# View the sitemap
curl http://localhost:3000/sitemap.xml

# View robots.txt
curl http://localhost:3000/robots.txt

# Test API endpoint
curl http://localhost:3000/api/sitemap
```

## Production Deployment

1. Update `NEXT_PUBLIC_SITE_URL` to your production domain
2. Ensure your data fetching functions work in production
3. Test the sitemap after deployment
4. Submit your sitemap to Google Search Console

## Troubleshooting

### Common Issues

1. **Empty sitemap**: Check your data fetching functions
2. **404 errors**: Ensure your routes match the generated URLs
3. **Performance issues**: Consider caching for large product catalogs
4. **Build errors**: Check TypeScript types and imports

### Performance Optimization

For large catalogs, consider:

- Implementing pagination in sitemap generation
- Caching sitemap data
- Using incremental static regeneration (ISR)
- Splitting into multiple sitemap files

## Next Steps

1. Connect the data fetching functions to your actual database
2. Test with your real product and category data
3. Add the admin interface to your dashboard
4. Set up webhook triggers for automatic updates
5. Submit your sitemap to search engines
