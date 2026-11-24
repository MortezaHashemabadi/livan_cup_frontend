"use client";

const ANNOUNCEMENTS: string[] = [
  "ارسال رایگان برای سفارش‌های بالای ۵ میلیون تومان",
  "طراحی اختصاصی لیوان با هوش مصنوعی",
  "تحویل سریع به سراسر کشور",
  "تخفیف ویژه برای سفارش‌های عمده",
];

// سرعت: هرچی عدد بیشتر، آهسته‌تر
const SECONDS_PER_ITEM = 8;
// "rtl" = متن از چپ به راست می‌آید (جهت خواندن فارسی) | "ltr" = برعکس
const DIRECTION: "rtl" | "ltr" = "rtl";

function Group({ ariaHidden }: { ariaHidden?: boolean }) {
  // هر گروه ۳ بار تکرار می‌شود تا روی صفحه‌های عریض هم خالی نماند
  return (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
      dir="rtl"
    >
      {[0, 1, 2].flatMap((r) =>
        ANNOUNCEMENTS.map((text, i) => (
          <span key={`${r}-${i}`} className="flex items-center whitespace-nowrap">
            <span className="px-60 text-[13px] font-medium">{text}</span>
            {/* <span className="text-white/40" aria-hidden>
              ✦
            </span> */}
          </span>
        )),
      )}
    </div>
  );
}

export default function AnnouncementBar() {
  const duration = ANNOUNCEMENTS.length * 3 * SECONDS_PER_ITEM;

  return (
    <div
      dir="ltr"
      role="region"
      aria-label="اطلاعیه"
      className="group h-9 w-full overflow-hidden bg-cobalt text-white"
    >
      <div
        className={`flex h-full w-max items-center ${
          DIRECTION === "rtl" ? "announcement-marquee-rtl" : "announcement-marquee-ltr"
        }`}
        style={{ ["--marquee-duration" as string]: `${duration}s` }}
      >
        <Group />
        <Group ariaHidden />
      </div>
    </div>
  );
}
