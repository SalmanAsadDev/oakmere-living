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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.dataset.reveal = "visible";
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    if (el.getBoundingClientRect().top >= window.innerHeight)
      el.dataset.reveal = "waiting";
    else el.dataset.reveal = "visible";
    observer.observe(el);
    const reduce = () => {
      if (preference.matches) {
        el.dataset.reveal = "visible";
        observer.disconnect();
      }
    };
    preference.addEventListener("change", reduce);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", reduce);
    };
  }, []);
  return (
    <div ref={ref} style={stagger(index)} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
