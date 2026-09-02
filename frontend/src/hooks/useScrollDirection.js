import { useEffect, useRef, useState } from "react";

/**
 * Returns "up" or "down" based on scroll direction.
 * Ignores tiny jitters below `threshold` pixels so it doesn't flicker.
 */
export function useScrollDirection(threshold = 8) {
  const [direction, setDirection] = useState("up");
  const lastY = useRef(typeof window !== "undefined" ? window.scrollY : 0);

  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY;
      const diff = currentY - lastY.current;

      if (Math.abs(diff) < threshold) return;

      if (diff > 0 && currentY > 60) {
        setDirection("down");
      } else {
        setDirection("up");
      }
      lastY.current = currentY;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return direction;
}
