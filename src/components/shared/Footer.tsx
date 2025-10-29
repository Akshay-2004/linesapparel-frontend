import React from "react";
import Link from "next/link";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa";
import Logo from "@/assets/logowhite.png";
import Image from "next/image";
import { FaShopify } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Contact */}
          <div className="flex items-start flex-col gap-4">
            <Image
              src={Logo}
              alt="Logo"
              className="object-contain h-8 w-auto mb-2"
            />
            <p className="text-sm text-gray-400">
              LinesApparel is a premium online fashion destination offering
              curated collections of clothing and accessories for modern
              lifestyles.
            </p>
            <p className="text-sm text-gray-400">
              2081, Cathers Drive, Nanaimo, V9R6R9, Canada
            </p>
            <p className="text-sm text-gray-400">Contact: +1(236)238 2587</p>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="uppercase font-bold text-gray-100 text-xs mb-2">
              Customer Service
            </h3>
            <ul className="space-y-1">
              {/* <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li> */}
              <li>
                <Link href="/legal/shipping-policy" className="hover:underline">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/legal/refund-policy" className="hover:underline">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/legal/cookie-policy" className="hover:underline">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="uppercase font-bold text-gray-100 text-xs mb-2">
              Company
            </h3>
            <ul className="space-y-1">
              {/* <li>
                <Link href="/about" className="hover:underline">
                  About LinesApparel
                </Link>
              </li> */}
              <li>
                <Link
                  href="/legal/terms-of-service"
                  className="hover:underline"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="uppercase font-bold text-gray-100 text-xs mb-2">
              Connect With Us
            </h3>
            <div className="flex gap-3 mb-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-gray-100"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-gray-100"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="hover:text-gray-100"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-gray-100"
              >
                <FaLinkedin size={20} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-gray-100"
              >
                <FaYoutube size={20} />
              </a>
            </div>
            <div className="text-xs text-gray-400">1M+ People like this</div>
          </div>

          {/* Newsletter */}
          {/* <div>
            <h3 className="uppercase font-bold text-gray-100 text-xs mb-2">
              Keep Up To Date
            </h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter Email Id"
                className="rounded-l px-3 py-2 text-sm bg-neutral-800 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-100"
              />
              <button
                type="submit"
                className="bg-gray-100 text-black font-semibold px-4 rounded-r hover:bg-yellow-500 transition"
              >
                Subscribe
              </button>
            </form>
          </div> */}
        </div>

        <hr className="my-8 border-neutral-700" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-300">
              Powered by
            </span>
            <FaShopify className="h-6 w-auto" /> Shopify
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-xs text-gray-400">
              © 2025 LinesApparel. All rights reserved.
            </p>
            <a
              href="https://tryntest.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
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
