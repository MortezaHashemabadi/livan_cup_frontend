"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  User,
  LayoutDashboard,
  Package,
  Building2,
  Wand2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useAuthModal } from "@/lib/auth-modal-context";
import { toast } from "sonner";

const navLinks = [
  { label: "محصولات", path: "/products" },
  { label: "طراح هوش مصنوعی", path: "/designer" },
  { label: "نمونه‌ها", path: "/gallery" },
  { label: "کیفیت تولید", path: "/quality" },
  { label: "درباره ما", path: "/about" },
];

const profileMenuItems = [
  { label: "داشبورد", path: "/dashboard", icon: LayoutDashboard },
  { label: "سفارش‌ها", path: "/dashboard/orders", icon: Package },
  { label: "پروفایل کسب‌وکار", path: "/dashboard/profile", icon: Building2 },
  { label: "طرح‌های ذخیره شده", path: "/dashboard/designs", icon: Wand2 },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { totalItems, setIsOpen } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { openAuthModal } = useAuthModal();

  const handleLogout = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    logout(false);
    toast.info("خروج موفق", { description: "تا دیدار بعدی!" });
    router.push("/");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.04)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="لیوان کاغذی سفارشی"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight block">
                لیوان کاپس
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-full text-[15px] font-medium transition-all duration-300 ${
                    pathname === link.path
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/designer">
                <Button className="hidden sm:flex items-center gap-2 bg-cobalt hover:bg-cobalt-hover text-white rounded-full px-6 h-10 font-medium text-sm shadow-none">
                  <Sparkles className="w-4 h-4" />
                  طراحی لیوان
                </Button>
              </Link>

              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-full hover:bg-secondary transition-colors"
                aria-label="سبد خرید"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -left-0.5 w-5 h-5 bg-cobalt text-white text-[11px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>

              <div ref={profileRef} className="hidden lg:block relative">
                {isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setProfileOpen((o) => !o)}
                      className="flex items-center gap-1.5 p-2 rounded-full hover:bg-secondary transition-colors"
                      aria-label="منوی پروفایل"
                    >
                      <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-bold">
                        {user?.first_name?.[0]?.toUpperCase() || (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {profileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 6, scale: 0.97 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.97 }}
                          transition={{
                            duration: 0.15,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)] border border-border/50 overflow-hidden z-50"
                        >
                          {user && (
                            <div className="px-4 pt-3.5 pb-2.5 border-b border-border/40">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {user.first_name || user.last_name
                                  ? `${user.first_name} ${user.last_name}`.trim()
                                  : user.phone}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.phone}
                              </p>
                            </div>
                          )}
                          <div className="p-1.5">
                            {profileMenuItems.map(
                              ({ label, path, icon: Icon }) => (
                                <Link
                                  key={path}
                                  href={path}
                                  onClick={() => setProfileOpen(false)}
                                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                  <Icon className="w-4 h-4 flex-shrink-0" />
                                  {label}
                                </Link>
                              ),
                            )}
                          </div>
                          <div className="border-t border-border/50 p-1.5">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                            >
                              <LogOut className="w-4 h-4 flex-shrink-0" />
                              خروج
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <button
                    onClick={openAuthModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <User className="w-4 h-4" />
                    ورود
                  </button>
                )}
              </div>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-full hover:bg-secondary transition-colors"
                aria-label="باز کردن منو"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-80 bg-white p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-6 left-6 p-2 rounded-full hover:bg-secondary"
              >
                <X className="w-5 h-5" />
              </button>

              <nav className="flex flex-col gap-2 mt-16">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-4 py-3 rounded-2xl text-lg font-medium transition-colors ${
                      pathname === link.path
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <Link href="/designer" className="block mt-8">
                <Button className="w-full bg-cobalt hover:bg-cobalt-hover text-white rounded-full h-12 font-medium">
                  <Sparkles className="w-4 h-4 ml-2" />
                  طراحی لیوان
                </Button>
              </Link>

              <div className="mt-6 pt-6 border-t border-border/50 space-y-1">
                <p className="px-4 text-xs font-semibold text-muted-foreground/50 uppercase tracking-wide mb-2">
                  حساب کاربری
                </p>
                {isAuthenticated ? (
                  <>
                    {profileMenuItems.map(({ label, path, icon: Icon }) => (
                      <Link
                        key={path}
                        href={path}
                        className="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      خروج
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      openAuthModal();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-medium bg-foreground text-background transition-colors"
                  >
                    <User className="w-4 h-4" />
                    ورود به حساب
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
