import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/query-provider";
import { AuthProvider } from "@/lib/auth-context";
import { AuthModalProvider } from "@/lib/auth-modal-context";
import { CartProvider } from "@/lib/cart-context";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import AuthModal from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "ایران لیوان",
  description: "فروش آنلاین لیوان کاغذی و پلاستیکی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <AuthModalProvider>
              <CartProvider>
                <Header />
                <main className="flex-1 pt-20">{children}</main>
                <Footer />
                <CartDrawer />
                <AuthModal />
                <Toaster position="top-center" richColors />
              </CartProvider>
            </AuthModalProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
