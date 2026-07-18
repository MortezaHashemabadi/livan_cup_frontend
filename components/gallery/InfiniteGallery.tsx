"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type GalleryItem = {
  src: string;
  name: string;
};

type InfiniteGalleryProps = {
  items: GalleryItem[];
};

const CELL = 200;
const GAP = 80;
const STEP = CELL + GAP;
const BUFFER = 1;
const MIN_SCALE = 1;
const MAX_SCALE = 2.5;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function cellHash(row: number, col: number) {
  let h = row * 374761393 + col * 668265263;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = h ^ (h >>> 16);
  return Math.abs(h);
}

export default function InfiniteGallery({ items }: InfiniteGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const viewRef = useRef({ x: 0, y: 0, scale: 1 });

  const [isAnimating, setIsAnimating] = useState(false);
  const [focusedCell, setFocusedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const [activeFilter, setActiveFilter] = useState(0);
  const filterOptions = ["همه", "محبوب‌ترین", "جدیدترین"];

  const glassStyle: React.CSSProperties = {
    backgroundColor: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.25)",
  };

  const dragRef = useRef({
    dragging: false,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
  });
  const pinchRef = useRef<{ dist: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // آپدیت تابع برای پشتیبانی از زوم نرم دکمه‌ها با پارامتر smooth
  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number, smooth = false) => {
      if (isAnimating) return;

      const current = viewRef.current;
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, current.scale * factor),
      );

      if (newScale === current.scale) return;

      setFocusedCell(null);

      const worldX = (clientX - current.x) / current.scale;
      const worldY = (clientY - current.y) / current.scale;

      const newX = clientX - worldX * newScale;
      const newY = clientY - worldY * newScale;

      // اگر زوم از طریق دکمه بود، انیمیشن نرم را فعال کن
      if (smooth) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
        }, 500);
      }

      viewRef.current = { x: newX, y: newY, scale: newScale };
      setView({ x: newX, y: newY, scale: newScale });
    },
    [isAnimating],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const factor = Math.exp(-e.deltaY * 0.001);
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, factor); // زوم آنی اسکرول
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (isAnimating) return;
    dragRef.current = {
      dragging: true,
      lastX: e.clientX,
      lastY: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging || isAnimating) return;

    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      setFocusedCell(null);
    }

    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    viewRef.current.x += dx;
    viewRef.current.y += dy;
    setView({ ...viewRef.current });
  };

  const handleCellClick = (row: number, col: number) => {
    if (!size.w || !size.h) return;

    const cellCenterX = col * STEP + CELL / 2;
    const cellCenterY = row * STEP + CELL / 2;

    const viewportCenterX = size.w / 2;
    const viewportCenterY = size.h / 2;

    const newX = viewportCenterX - cellCenterX * MAX_SCALE;
    const newY = viewportCenterY - cellCenterY * MAX_SCALE;

    setIsAnimating(true);
    setFocusedCell({ row, col });

    viewRef.current = { x: newX, y: newY, scale: MAX_SCALE };
    setView({ x: newX, y: newY, scale: MAX_SCALE });

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const stopDrag = (e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return;

    const moveDistance = Math.hypot(
      e.clientX - dragRef.current.startX,
      e.clientY - dragRef.current.startY,
    );

    if (moveDistance < 5) {
      const rect = containerRef.current!.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const worldX = (clickX - viewRef.current.x) / viewRef.current.scale;
      const worldY = (clickY - viewRef.current.y) / viewRef.current.scale;

      const col = Math.floor(worldX / STEP);
      const row = Math.floor(worldY / STEP);

      const cellLeft = col * STEP;
      const cellTop = row * STEP;
      if (
        worldX >= cellLeft &&
        worldX <= cellLeft + CELL &&
        worldY >= cellTop &&
        worldY <= cellTop + CELL
      ) {
        handleCellClick(row, col);
      } else {
        setFocusedCell(null);
      }
    }

    dragRef.current.dragging = false;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length !== 2 || isAnimating) return;
    const [a, b] = [e.touches[0], e.touches[1]];
    const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    if (pinchRef.current) {
      const factor = dist / pinchRef.current.dist;
      const rect = containerRef.current!.getBoundingClientRect();
      const cx = (a.clientX + b.clientX) / 2 - rect.left;
      const cy = (a.clientY + b.clientY) / 2 - rect.top;
      zoomAt(cx, cy, factor); // زوم آنی پینچ موبایل
    }
    pinchRef.current = { dist };
  };

  const onTouchEnd = () => {
    pinchRef.current = null;
  };

  // ارسال پارامتر true برای اجرای نرم زوم دکمه‌ها
  const zoomButton = (factor: number) => () =>
    zoomAt(size.w / 2, size.h / 2, factor, true);

  const cells: { row: number; col: number }[] = [];
  if (size.w && size.h && items.length > 0) {
    const worldLeft = -view.x / view.scale;
    const worldTop = -view.y / view.scale;
    const worldRight = worldLeft + size.w / view.scale;
    const worldBottom = worldTop + size.h / view.scale;

    const colStart = Math.floor(worldLeft / STEP) - BUFFER;
    const colEnd = Math.ceil(worldRight / STEP) + BUFFER;
    const rowStart = Math.floor(worldTop / STEP) - BUFFER;
    const rowEnd = Math.ceil(worldBottom / STEP) + BUFFER;

    for (let row = rowStart; row <= rowEnd; row++) {
      for (let col = colStart; col <= colEnd; col++) {
        cells.push({ row, col });
      }
    }
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerLeave={stopDrag}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className={`relative h-full w-full touch-none select-none overflow-hidden ${
        focusedCell ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      }`}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})`,
          transformOrigin: "0 0",
          transition: isAnimating
            ? "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)"
            : "none",
        }}
      >
        {cells.map(({ row, col }) => {
          const index = mod(cellHash(row, col), items.length);
          const item = items[index];
          const isFocused =
            focusedCell?.row === row && focusedCell?.col === col;

          return (
            <div
              key={`${row}_${col}`}
              className="absolute overflow-hidden rounded-xl bg-gray-200/50 transition-all duration-500 ease-out hover:cursor-pointer"
              style={{
                left: col * STEP,
                top: row * STEP,
                width: CELL,
                height: CELL,
                zIndex: isFocused ? 50 : 1,
                transform: isFocused ? "scale(1.05)" : "scale(1)",
                boxShadow: isFocused ? "0 30px 60px rgba(0,0,0,0.4)" : "none",
              }}
            >
              <div
                className={`absolute right-2 top-2 z-10 rounded-md bg-black/70 px-2 py-1 text-[12px] font-medium text-white backdrop-blur-sm pointer-events-none transition-opacity duration-500 ${
                  isFocused ? "opacity-100" : "opacity-0"
                }`}
              >
                {item.name}
              </div>

              <Image
                src={item.src}
                alt={item.name}
                fill
                unoptimized={true}
                className="object-cover"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {/* دکمه برگشت */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{ position: "absolute", top: 16, left: 16, zIndex: 60 }}
      >
        <Link
          href="/"
          style={glassStyle}
          className="flex h-11 w-11 items-center justify-center rounded-full text-black shadow-lg"
        >
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* فیلترها */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{ position: "absolute", top: 16, right: 16, zIndex: 60 }}
      >
        <div
          style={glassStyle}
          className="flex gap-1 rounded-full p-1 shadow-lg"
        >
          {filterOptions.map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveFilter(i)}
              className="rounded-full px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor:
                  activeFilter === i ? "rgba(216,203,187,0.9)" : "transparent",
                color: "#000",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* دکمه‌های زوم آپدیت شده (عمودی، وسط سمت راست و زوم نرم) */}
      {(() => {
        const atMax = view.scale >= MAX_SCALE;
        const atMin = view.scale <= MIN_SCALE;

        return (
          <div
            onPointerDown={(e) => e.stopPropagation()}
            // قرارگیری در وسط صفحه سمت راست به صورت عمودی (flex-col)
            className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-60 shadow-lg transition-opacity py-3 px-2 rounded-full"
          >
            <button
              onClick={zoomButton(1.3)}
              disabled={atMax}
              style={{ ...glassStyle, opacity: atMax ? 0.35 : 1 }}
              className="h-10 w-10 rounded-full text-lg font-bold text-black shadow-lg disabled:cursor-not-allowed transition-opacity"
            >
              +
            </button>
            <button
              onClick={zoomButton(1 / 1.3)}
              disabled={atMin}
              style={{ ...glassStyle, opacity: atMin ? 0.35 : 1 }}
              className="h-10 w-10 rounded-full text-lg font-bold text-black shadow-lg disabled:cursor-not-allowed transition-opacity"
            >
              −
            </button>
          </div>
        );
      })()}
    </div>
  );
}
