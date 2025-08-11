import React from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingCart,
  Users,
  BarChart2,
  Settings,
  FileText,
  Home,
  Phone,
  Info,
  PlusCircle,
  Quote,
  Star,
  Mail, // Better option for inquiries
} from "lucide-react";

export interface NavItem {
  name: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  submenu?: NavItem[];
}

export const navigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Pages",
    icon: FileText,
    submenu: [
      { name: "All Pages", href: "/dashboard/pages", icon: FileText },
      {
        name: "Create Page",
        href: "/dashboard/pages/create",
        icon: PlusCircle,
      },
      { name: "Homepage", href: "/dashboard/pages/homepage", icon: Home },
      { name: "Legal Pages", href: "/dashboard/pages/legal", icon: FileText },
      { name: "Contact Page", href: "/dashboard/pages/contact", icon: Phone },
      { name: "About Page", href: "/dashboard/pages/about", icon: Info },
    ],
  },
  {
    name: "User Management",
    icon: Users,
    href: "/dashboard/users",
  },
  {
    name: "Testimonials",
    icon: Quote,
    submenu: [
      {
        name: "All Testimonials",
        href: "/dashboard/testimonials",
        icon: Quote,
      },
      {
        name: "Add Testimonial",
        href: "/dashboard/testimonials/add",
        icon: PlusCircle,
      },
    ],
  },
  { name: "Inquiries", href: "/dashboard/inquiries", icon: Mail },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];
