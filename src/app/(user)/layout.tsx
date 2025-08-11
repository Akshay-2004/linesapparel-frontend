import Footer from "@/components/shared/Footer";
import UserNavBar from "@/components/shared/UserNavBar";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserNavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
