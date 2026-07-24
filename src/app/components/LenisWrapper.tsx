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
    
    // Stop Lenis initially because the loading screen is active
    lenis.stop();
    
    import("../store").then(({ loadingStore }) => {
      const unsub = loadingStore.subscribe(() => {
        if (loadingStore.progress >= 100 && loadingStore.revealing) {
          // Wait a tiny bit for the reveal animation to finish its first frame
          setTimeout(() => lenis.start(), 100);
        } else {
          lenis.stop();
        }
      });
      
      // Store the unsub function on the lenis instance so we can clean it up
      (lenis as any)._unsubLoader = unsub;
    });

    return () => {
      if ((lenis as any)._unsubLoader) (lenis as any)._unsubLoader();
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
