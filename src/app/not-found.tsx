'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
