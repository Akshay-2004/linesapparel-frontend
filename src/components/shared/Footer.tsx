import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa'
import Logo from '@/assets/logowhite.png'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Logo & Contact */}
          <div className="flex flex-col gap-4">
            <Image src={Logo} alt="Logo" className="object-contain h-8 w-auto mb-2" />
            <p className="text-sm text-gray-400">Lines Apparel is a leading online fashion store offering a wide range of clothing and accessories for men and women.</p>
            <p className='text-sm text-gray-400'>Address: 123 Fashion St, Style City, CA 12345</p>
          </div>

          {/* Company */}
          <div>
            <div>
              <h3 className="uppercase font-bold text-gray-100 text-xs mb-2">Customer Service</h3>
              <ul className="space-y-1">
                <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
                <li><Link href="/track-order" className="hover:underline">Track Order</Link></li>
                <li><Link href="/return-order" className="hover:underline">Return Order</Link></li>
                <li><Link href="/cancel-order" className="hover:underline">Cancel Order</Link></li>
              </ul>
              <div className="flex flex-col gap-1 mt-2 text-xs text-gray-400">
                <span>15 Days Return Policy*</span>
                <span>Cash On Delivery*</span>
              </div>
            </div>
          </div>

          {/* Download the App */}
          <div>
            <h3 className="uppercase font-bold text-gray-100 text-xs mb-2">Company</h3>
            <ul className="space-y-1">
              <li><Link href="/about" className="hover:underline">About Us</Link></li>
              <li><Link href="/legal/terms-of-service" className="hover:underline">Terms & Conditions</Link></li>
              <li><Link href="/legal/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="/careers" className="hover:underline">We are Hiring</Link></li>
            </ul>
          </div>

          {/* Connect With Us */}
          <div>
            <h3 className="uppercase font-bold text-gray-100 text-xs mb-2">Connect With Us</h3>
            <div className="flex gap-3 mb-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-gray-100"><FaFacebook size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-gray-100"><FaInstagram size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-gray-100"><FaTwitter size={20} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-gray-100"><FaLinkedin size={20} /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-gray-100"><FaYoutube size={20} /></a>
            </div>
            <div className="text-xs text-gray-400">1M+ People like this</div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="uppercase font-bold text-gray-100 text-xs mb-2">Keep Up To Date</h3>
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
          </div>
        </div>

        <hr className="my-8 border-neutral-700" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <div className="flex gap-2 items-center">
            <span className="uppercase font-bold text-gray-100 text-xs">100% Secure Payment</span>
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-5" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" alt="Mastercard" className="h-5" />
            {/* Add more payment icons as needed */}
          </div>
          <p className="text-xs text-gray-400 mt-2 md:mt-0">© 2025 Try N Test Foundation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
