"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Layers,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { navigation } from "@/constants/links";

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

interface NavItemProps {
    name: string;
    href?: string;
    icon?: React.ComponentType<{ className?: string }>;
    submenu?: NavItemProps[];
}

const AdminSidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);
    const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const toggleSubmenu = (name: string) => {
        setOpenSubmenus((prev) =>
            prev.includes(name)
                ? prev.filter((item) => item !== name)
                : [...prev, name]
        );
    };
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])
    const NavItem = ({ item }: { item: NavItemProps }) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isSubmenuOpen = openSubmenus.includes(item.name);
        const isActive = pathname === item.href;
        const isSubmenuActive = item.submenu?.some(
            (subItem) => subItem.href === pathname
        );

        if (hasSubmenu) {
            return (
                <li>
                    <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={cn(
                            "w-full group flex items-center justify-between gap-x-3 rounded-md p-2 text-sm font-semibold transition-colors duration-200",
                            isSubmenuActive
                                ? "bg-primary-6 text-white"
                                : "text-secondary-6 hover:bg-primary-7 hover:text-white"
                        )}
                    >
                        <div className="flex items-center gap-x-3">
                            {item.icon && <item.icon className="h-6 w-6 shrink-0" />}
                            {!isCollapsed && <span>{item.name}</span>}
                        </div>
                        {!isCollapsed && (
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 transition-transform duration-200",
                                    isSubmenuOpen ? "rotate-180" : ""
                                )}
                            />
                        )}
                    </button>
                    <AnimatePresence>
                        {isSubmenuOpen && !isCollapsed && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <ul className="pl-8 space-y-1 py-1">
                                    {item.submenu?.map((subItem) => (
                                        <li key={subItem.name}>
                                            <Link
                                                href={subItem.href || "#"}
                                                className={cn(
                                                    "block rounded-md p-2 text-sm font-medium transition-colors duration-200",
                                                    pathname === subItem.href
                                                        ? "bg-primary-6 text-white"
                                                        : "text-secondary-6 hover:bg-primary-7 hover:text-white"
                                                )}
                                            >
                                                {subItem.icon && <subItem.icon className="h-4 w-4 mr-2 inline" />}
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </li>
            );
        }

        return (
            <li>
                <Link
                    href={item.href || "#"}
                    className={cn(
                        "group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold transition-colors duration-200",
                        isActive
                            ? "bg-primary-6 text-white"
                            : "text-secondary-6 hover:bg-primary-7 hover:text-white"
                    )}
                    title={isCollapsed ? item.name : ""}
                >
                    {item.icon && <item.icon className="h-6 w-6 shrink-0" />}
                    {!isCollapsed && <span>{item.name}</span>}
                </Link>
            </li>
        );
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col bg-primary-9">
            <div className="flex h-16 shrink-0 items-center px-6 border-b border-primary-8">
                {!isCollapsed ? (
                    <span className="text-lg font-bold text-white tracking-wide">
                        Admin Panel
                    </span>
                ) : (
                    <LayoutDashboard className="h-7 w-7 text-white mx-auto" />
                )}
            </div>
            <nav className="flex flex-1 flex-col px-3 py-6">
                <ul className="flex flex-1 flex-col gap-y-1">
                    {navigation.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </ul>
            </nav>
        </div>
    );

    if (!isMounted) {
        return null;
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <motion.div
                className="hidden md:flex bg-primary-9 border-r border-primary-8"
                animate={{ width: isCollapsed ? 64 : 256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="relative h-full w-full">
                    <SidebarContent />
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-20 bg-primary-7 text-white rounded-full p-1.5 shadow-lg hover:bg-primary-6 transition-colors duration-200 z-10 border border-primary-6"
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="ml-2">
                            <Layers className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
};

export default AdminSidebar;

