# LivanCup Frontend

فرانت‌اند Next.js برای [iranlivan.ir](https://iranlivan.ir) — فروشگاه آنلاین لیوان و ظروف قابل سفارشی‌سازی با طراحی هوش مصنوعی.

## ویژگی‌ها

- احراز هویت با شماره موبایل (OTP) + JWT (با refresh token خودکار)
- کاتالوگ محصولات با فیلتر بر اساس دسته و ویژگی‌ها
- طراح سفارشی با Konva.js (`/designer`) — طراحی روی canvas و آپلود به سفارش
- سبد خرید و تسویه‌حساب چندمرحله‌ای
- پنل کاربری: سفارش‌ها، طرح‌های ذخیره‌شده، پروفایل و آدرس‌ها
- گالری طرح‌های عمومی
- رابط کاملاً راست‌چین (RTL) با فونت وزیرمتن

## تکنولوژی‌ها

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config)
- shadcn/ui (radix-nova style) + Radix UI primitives
- TanStack Query برای مدیریت state سرور
- Konva / react-konva برای طراحی سفارشی
- Framer Motion برای انیمیشن
- Vitest + React Testing Library برای تست

## ساختار پروژه

```
app/
├── checkout/       # تسویه‌حساب
├── dashboard/      # پنل کاربری (سفارش‌ها، طرح‌ها، پروفایل)
├── designer/       # طراح سفارشی (Konva canvas)
├── gallery/        # گالری طرح‌ها
├── products/       # کاتالوگ و صفحه محصول
lib/
├── api/            # کلاینت API و endpoint‌ها
├── auth-context    # مدیریت احراز هویت
├── cart-context    # مدیریت سبد خرید
```

## راه‌اندازی

```bash
npm install
cp .env.example .env.production
npm run dev
```

## Build پروداکشن

```bash
npm run build
npm start
```

## تست

```bash
npm run test
```

تست‌ها فلوهای حیاتی (auth, cart) رو با mock کردن API پوشش می‌دن.

## Environment Variables

| متغیر | توضیح |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | آدرس API بک‌اند |
| `NEXT_PUBLIC_MEDIA_URL` | آدرس سرو فایل‌های media |

## Deployment

با Docker و `output: 'standalone'` اجرا می‌شه. برای اجرای کامل (همراه بک‌اند و bridge)، به ریپوی deploy مراجعه کن.

## لایسنس

Private / Proprietary
