import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa'
import Logo from '@/assets/logowhite.png'
import Image from 'next/image'

interface FooterLink {
  id: number;
  name: string;
  url: string;
}

interface SocialLink {
  id: number;
  icon: React.ReactNode;
  url: string;
}

const Footer = () => {
  const contactInfo = {
    address: 'Level 1, 12 Sample St, Sydney NSW 2000',
    phone: '62990 35580',
    email: 'tnt.tryntest@gmail.com'
  }

  const footerLinksLeft: FooterLink[] = [
    { id: 1, name: 'Contact Us', url: '/contact' },
    { id: 2, name: 'About Us', url: '/about' },
    { id: 3, name: 'Services', url: '/services' },
    { id: 4, name: 'Blog', url: '/blog' },
    { id: 5, name: 'Support', url: '/support' },
  ]

  const footerLinksRight: FooterLink[] = [
    { id: 6, name: 'Legal Pages', url: '/legal' },
    { id: 7, name: 'Privacy Policy', url: '/legal/privacy-policy' },
    { id: 8, name: 'Terms of Service', url: '/legal/terms-of-service' },
    { id: 9, name: 'Cookie Policy', url: '/legal/cookie-policy' },
    { id: 10, name: 'Refund Policy', url: '/legal/refund-policy' },
  ]

  const socialLinks: SocialLink[] = [
    { id: 1, icon: <FaFacebook size={24} />, url: 'https://facebook.com' },
    { id: 2, icon: <FaInstagram size={24} />, url: 'https://instagram.com' },
    { id: 3, icon: <FaTwitter size={24} />, url: 'https://twitter.com' },
    { id: 4, icon: <FaLinkedin size={24} />, url: 'https://linkedin.com' },
    { id: 5, icon: <FaYoutube size={24} />, url: 'https://youtube.com' },
  ]

  return (
    <footer className="bg-primary-6 text-white">
      <div className="container mx-auto px-4 pb-8 pt-16">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Logo and Contact Info */}
          <div className="mb-8">
            <div className="flex items-center mb-8 w-auto h-8">
              <Image src={Logo} alt="Logo" className="object-contain" />
            </div>
            
            <div className="mb-4">
              <p className="font-semibold mb-1">Address:</p>
              <p>{contactInfo.address}</p>
            </div>
            
            <div className="mb-4">
              <p className="font-semibold mb-1">Contact:</p>
              <p>{contactInfo.phone}</p>
              <a href={`mailto:${contactInfo.email}`} className="hover:underline">{contactInfo.email}</a>
            </div>
            
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link) => (
                <Link 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80"
                >
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Links - Left Column */}
          <div className="mb-8 md:mb-0">
            {footerLinksLeft.map((link) => (
              <div key={link.id} className="mb-3">
                <Link href={link.url} className="hover:underline">
                  {link.name}
                </Link>
              </div>
            ))}
          </div>

          {/* Footer Links - Right Column */}
          <div>
            {footerLinksRight.map((link) => (
              <div key={link.id} className="mb-3">
                <Link href={link.url} className="hover:underline">
                  {link.name}
                </Link>
              </div>
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-300/30" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 Try N Test Foundation. All rights reserved.</p>
          
          <div className="mt-4 md:mt-0">
            <p className="text-xs text-gray-300">
              Website made by{' '}
              <a 
                href="https://tryntest.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline hover:text-white transition-colors"
              >
                Try N Test Foundation
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
