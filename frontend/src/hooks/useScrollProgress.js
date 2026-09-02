import { useEffect, useRef, useState } from "react";

/**
 * Returns 0..1 representing how far a section has scrolled through the
 * viewport — 0 when its top just enters the bottom of the screen,
 * 1 when its bottom just exits the top. Used for parallax/scale transforms.
 * No scroll-jacking — this only reads scroll position, never controls it.
 */
export function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function update() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const distanceScrolled = vh - rect.top;
      const p = Math.min(Math.max(distanceScrolled / total, 0), 1);
      setProgress(p);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return [ref, progress];
}
