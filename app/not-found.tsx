import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="text-center space-y-6">
        <h1 className="text-7xl font-light text-muted-foreground/40">۴۰۴</h1>
        <h2 className="text-2xl font-medium">صفحه پیدا نشد</h2>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-secondary transition-colors"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
