"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin);

const DOWN = "M0-0.3C0-0.3,464,156,1139,156S2278-0.3,2278-0.3V200H0V-0.3z";
const CENTER = "M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V200H0V-0.3z";

export default function FooterWave({ triggerRef }) {
  const pathRef = useRef(null);

  useEffect(() => {
    const trigger = triggerRef?.current;
    if (!trigger || !pathRef.current) return;

    const st = ScrollTrigger.create({
      trigger,
      start: "top bottom",
      toggleActions: "play pause resume reverse",
      onEnter: (self) => {
        const velocity = self.getVelocity();
        const variation = velocity / 10000;

        gsap.fromTo(
          pathRef.current,
          { morphSVG: DOWN },
          {
            duration: 2,
            morphSVG: CENTER,
            ease: `elastic.out(${1 + variation}, ${1 - variation})`,
            overwrite: true,
          },
        );
      },
    });

    return () => st.kill();
  }, [triggerRef]);

  return (
    <svg
      preserveAspectRatio="none"
      viewBox="0 0 2278 200"
      className="absolute -top-[70px] left-0 w-full h-[140px] pointer-events-none z-0"
      style={{ overflow: "visible" }}
    >
      <path
        ref={pathRef}
        className="text-foreground"
        fill="currentColor"
        d="M0-0.3C0-0.3,464,0,1139,0s1139-0.3,1139-0.3V200H0V-0.3z"
      />
    </svg>
  );
}
