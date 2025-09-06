"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useUserDetails } from "@/hooks/useUserDetails";
import VerifyOTPForm from "@/components/pages/Auth/VerifyOTPForm";
import logo from "@/assets/logo.png";
import LoginImage from "@/assets/products/StrapiMidiDress.png";
import { Loader2 } from "lucide-react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading, isAuthenticated, isVerified } = useUserDetails();
  const [isInitialized, setIsInitialized] = useState(false);
  
  const email = searchParams.get("email") || "";

  useEffect(() => {
    if (!userLoading) {
      setIsInitialized(true);
      
      // If user is authenticated and verified, redirect to homepage
      if (isAuthenticated() && isVerified()) {
        router.push("/");
        return;
      }
    }
  }, [userLoading, isAuthenticated, isVerified, router]);

  const handleVerificationSuccess = () => {
    // Redirect to homepage after successful verification
    router.push("/");
  };

  // Show loading while checking authentication status
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking verification status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
        <div className="w-full p-8 rounded-lg shadow-xl bg-white">
          <div className="mb-8">
            <Image
              alt="Lines Apparel"
              src={logo}
              width={100}
              height={100}
              className="h-10 w-auto"
            />
          </div>
          
          <VerifyOTPForm 
            email={email} 
            onVerificationSuccess={handleVerificationSuccess}
          />
        </div>
      </div>

      {/* Right side - Image */}
      <div className="relative container mx-auto hidden w-0 flex-1 lg:block">
        <Image
          src={LoginImage}
          alt="Verify Email"
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
      </div>
    </div>
  );
}