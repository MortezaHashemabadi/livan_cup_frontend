"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Wand2,
  Building2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAuthModal } from "@/lib/auth-modal-context";

const navItems = [
  { label: "داشبورد", path: "/dashboard", icon: LayoutDashboard },
  { label: "سفارش‌ها", path: "/dashboard/orders", icon: Package },
  { label: "طرح‌ها", path: "/dashboard/designs", icon: Wand2 },
  { label: "پروفایل", path: "/dashboard/profile", icon: Building2 },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();
  const pathname = usePathname();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated && !redirected) {
      setRedirected(true);
      router.push("/");
      openAuthModal();
    }
  }, [isLoadingAuth, isAuthenticated, redirected, router, openAuthModal]);

  if (isLoadingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="hidden lg:flex flex-col w-56 flex-shrink-0">
            <div className="sticky top-28 space-y-1">
              <p className="px-4 text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider mb-3">
                حساب من
              </p>
              {navItems.map((item) => {
                const active = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4">
                <Link href="/designer">
                  <button className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-sm font-medium text-cobalt bg-cobalt/8 hover:bg-cobalt/12 transition-colors">
                    <Sparkles className="w-4 h-4" />
                    طرح جدید
                  </button>
                </Link>
              </div>
            </div>
          </aside>

          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-border/50">
            <div className="flex items-center justify-around px-2 py-2">
              {navItems.map((item) => {
                const active = pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors ${active ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          <main className="flex-1 min-w-0 pb-24 lg:pb-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
