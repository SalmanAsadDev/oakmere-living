"use client";
import { useEffect, useRef } from "react";
import { stagger } from "@/lib/presentation/motion";
export function Reveal({
  children,
  className = "",
  index = 0,
}: {
  children: React.ReactNode;
  className?: string;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.IntersectionObserver) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    // Each wrapper owns its own choreography. Nested product cards must not be
    // hidden again by the enclosing section's observer.
    const items = [...el.querySelectorAll<HTMLElement>(".line-mask > span, .reveal-text, .asset-mask")]
      .filter((item) => item.closest(".reveal") === el);
    items.forEach((item, position) => {
      item.style.setProperty("--reveal-delay", stagger(index + position)["--reveal-delay"] as string);
    });
    const reveal = (state: "waiting" | "visible") => {
      el.dataset.reveal = state;
      items.forEach((item) => { item.dataset.reveal = state; });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          reveal("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (el.getBoundingClientRect().top >= window.innerHeight)
      reveal("waiting");
    else reveal("visible");
    observer.observe(el);
    const reduce = () => {
      if (preference.matches) {
        reveal("visible");
        observer.disconnect();
      }
    };
    preference.addEventListener("change", reduce);
    const focus = () => { reveal("visible"); observer.disconnect(); };
    el.addEventListener("focusin", focus);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", reduce);
      el.removeEventListener("focusin", focus);
    };
  }, [index]);
  return (
    <div ref={ref} style={stagger(index)} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
