"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

export default function LenisWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      // Disable smooth scroll on touch — native momentum is faster on mobile
      syncTouch: false,
      touchMultiplier: 1,
    });

    // Plug Lenis into GSAP's ticker — one shared RAF loop, zero jank
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0); // disable lag compensation for crisp scroll

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
