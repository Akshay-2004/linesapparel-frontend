import React from "react";
import Link from "next/link";
import { FaShopify } from "react-icons/fa";
import { useInterestService } from "@/services/interest.service";
import { toast } from "sonner";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { createInterest } = useInterestService();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await createInterest({ email: email.trim() });
      toast.success("Thank you for subscribing! We'll keep you updated.");
      setEmail("");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to subscribe. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Top Navigation Links */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <Link href="/reviews" className="text-gray-700 hover:text-gray-900 uppercase">
            Reviews
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900 uppercase">
            Get in Touch
          </Link>
          <Link href="/legal/terms-of-service" className="text-gray-700 hover:text-gray-900 uppercase">
            Terms of Service
          </Link>
          <Link href="/legal/privacy-policy" className="text-gray-700 hover:text-gray-900 uppercase">
            Privacy Policy
          </Link>
          <Link href="/legal/refund-policy" className="text-gray-700 hover:text-gray-900 uppercase">
            Returns and Refunds
          </Link>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Member List Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase">
            Member List
          </h2>
          <p className="text-gray-600 mb-6 uppercase text-sm">
            Get early access to new drops, meet-ups and more
          </p>
          
          {/* Email Subscribe Form */}
          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "..." : "→"}
              </button>
            </div>
          </form>
        </div>

        <hr className="my-8 border-gray-200" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">Powered by</span>
            <FaShopify className="h-6 w-6 text-gray-900" />
            <span className="text-gray-900">Shopify</span>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-xs text-gray-500">
              © 2025 LinesApparel. All rights reserved.
            </p>
            <a
              href="https://tryntest.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Crafted by Try N Test Foundation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
