"use client";

import Footer from "@/components/shared/Footer";
import UserNavBar from "@/components/shared/UserNavBar";
import { usePathname } from "next/navigation";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <>
      <UserNavBar />
      <main className={isHomepage ? '' : 'mt-24'}>{children}</main>
      <Footer />
    </>
  );
}
