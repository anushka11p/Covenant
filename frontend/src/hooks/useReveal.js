import { useEffect } from "react";

/**
 * Observes .reveal elements and adds .visible when they enter the viewport.
 * If an element has data-stagger="N", its children get staggered reveal
 * delays (N ms apart) instead of all appearing at once.
 */
export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add("visible");

          const staggerMs = el.getAttribute("data-stagger");
          if (staggerMs) {
            const children = el.querySelectorAll(".stagger-child");
            children.forEach((child, i) => {
              child.style.transitionDelay = `${i * Number(staggerMs)}ms`;
              child.classList.add("visible");
            });
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
