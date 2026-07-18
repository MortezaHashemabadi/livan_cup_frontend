import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Send,
} from "lucide-react";

const footerLinks = {
  محصولات: [
    { label: "لیوان کاغذی", path: "/products?category=paper_cups" },
    { label: "لیوان پلاستیکی", path: "/products?category=plastic_cups" },
    { label: "درپوش", path: "/products?category=lids" },
    { label: "نگه‌دارنده لیوان", path: "/products?category=cup_holders" },
  ],

  // شرکت: [
  //   { label: "درباره ما", path: "/about" },
  //   { label: "تعرفه", path: "/pricing" },
  //   { label: "تماس با ما", path: "/about" },
  // ],
};

const contactInfo = [
  { icon: Phone, text: "۰۲۱-۱۲۳۴۵۶۷۸" },
  { icon: MessageCircle, text: "۰۹۱۲۳۴۵۶۷۸۹" },
  { icon: Mail, text: "info@cupcraft.ir" },
  {
    icon: MapPin,
    text: "تهران، شهرک صنعتی، خیابان تولید، پلاک ۱۲",
  },
  {
    icon: Clock,
    text: "شنبه تا پنجشنبه، ۸ تا ۱۷",
  },
];

const socialLinks = [
  // {
  //   icon: Instagram,
  //   href: "#",
  // },
  {
    icon: Send,
    href: "#",
  },
  // {
  //   icon: Linkedin,
  //   href: "#",
  // },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/70">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* برند */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-2xl bg-background flex items-center justify-center">
                <span className="text-foreground font-heading font-extrabold text-sm">
                  C
                </span>
              </div>

              <span className="font-heading font-bold text-xl text-background tracking-tight">
                ایران لیوان
              </span>
            </div>

            <p className="text-sm leading-relaxed text-background/50 max-w-xs">
              لیوان‌های سفارشی با کیفیت برتر، طراحی شده با هوش مصنوعی. تلاقی
              تولید ممتاز و خلاقیت نوین.
            </p>
          </div>

          {/* لینک‌ها */}
          <div className="grid grid-cols-2 gap-8">
            {Object.entries(footerLinks).map(([section, links]) => (
              <div key={section}>
                <h4 className="font-heading font-semibold text-background text-sm mb-5">
                  {section}
                </h4>

                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.path}
                        className="text-sm text-background/40 hover:text-background transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h4 className="font-heading font-semibold text-background text-sm mb-5">
              اطلاعات تماس
            </h4>

            <ul className="space-y-4">
              {contactInfo.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-start gap-3 text-sm text-background/50"
                >
                  <Icon
                    size={17}
                    className="mt-0.5 shrink-0 text-background/70"
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div>
            <h4 className="font-heading font-semibold text-background text-sm mb-5">
              ما را دنبال کنید
            </h4>

            <div className="flex gap-3 mb-8">
              {socialLinks.map(({ icon: Icon, href }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="w-10 h-10 rounded-xl border border-background/10 flex items-center justify-center hover:bg-background hover:text-foreground hover:border-background transition-all duration-300"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>

            {/* <div className="border-t border-background/10 pt-8">
              <div className="w-28 h-28 rounded-xl border-2 border-dashed border-background/20 flex items-center justify-center text-xs text-background/30">
                لوگوی اینماد
              </div>
            </div> */}
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/30">
            &copy; {new Date().getFullYear()} ایران لیوان. تمامی حقوق محفوظ است.
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-xs text-background/30 hover:text-background/60 transition-colors"
            >
              حریم خصوصی
            </Link>

            <Link
              href="/terms"
              className="text-xs text-background/30 hover:text-background/60 transition-colors"
            >
              شرایط استفاده
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
