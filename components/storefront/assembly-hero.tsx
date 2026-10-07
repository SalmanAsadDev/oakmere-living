"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowDown, ArrowUpRight } from "lucide-react";

// Generated design study, not a catalogue product. Static crops share one image
// and coordinate system; only each layer's transform changes during assembly.
function SofaLayer({ part }: { part: "feet" | "frame" | "cushions" }) {
  return (
    <div aria-hidden="true" className={`assembly-layer assembly-${part}`}>
      <Image
        src="/images/hero/comfort-study.webp"
        alt=""
        fill
        preload
        sizes="(max-width: 767px) 100vw, 65vw"
        className="object-contain"
      />
    </div>
  );
}
export function AssemblyHero() {
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let active = false;
    let idle: ReturnType<typeof setTimeout> | undefined;
    const settleMs =
      Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--motion-duration-responsive",
        ),
      ) || 0;
    const update = () => {
      raf = 0;
      const progress = preference.matches
        ? 1
        : Math.max(
            0,
            Math.min(1, -el.getBoundingClientRect().top / window.innerHeight),
          );
      el.style.setProperty("--scroll-progress", String(progress));
      el.dataset.scrubbing = String(
        !preference.matches && progress > 0 && progress < 1,
      );
      clearTimeout(idle);
      idle = setTimeout(() => {
        el.dataset.scrubbing = "false";
      }, settleMs);
    };
    const scroll = () => {
      if (active && !raf) raf = requestAnimationFrame(update);
    };
    const observer = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active) scroll();
      else el.dataset.scrubbing = "false";
    });
    observer.observe(el);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll);
    preference.addEventListener("change", update);
    update();
    return () => {
      clearTimeout(idle);
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      preference.removeEventListener("change", update);
    };
  }, []);
  return (
    <section
      ref={section}
      className="assembly-section"
      style={{ "--scroll-progress": 0 } as React.CSSProperties}
    >
      <div className="assembly-sticky">
        <div className="container relative z-10 pt-10 sm:pt-14">
          <p className="eyebrow text-primary">Welcome to Oakmere Living</p>
          <div className="mt-5">
            <h1 className="display text-[clamp(46px,6.5vw,96px)]">
              <span className="line-mask">
                <span>A little more</span>
              </span>
              <span className="line-mask">
                <span>
                  <em className="font-normal text-[#6b745a]">room to live.</em>
                </span>
              </span>
            </h1>
            <div className="mt-7 hidden max-w-[280px] pb-3 md:block">
              <p className="text-sm leading-7 text-muted-foreground">
                For the slow Sundays. The long conversations. The moments that
                make a house your home.
              </p>
              <Link
                className="group mt-5 inline-flex items-center gap-8 border-b border-primary pb-2 text-xs"
                href="/shop"
              >
                Discover the collection <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <Link
            href="/shop"
            className="mt-6 inline-flex items-center gap-6 bg-primary px-5 py-3 text-xs text-white md:hidden"
          >
            Explore the collection <ArrowUpRight size={16} />
          </Link>
        </div>
        <div
          className="assembly-stage"
          role="img"
          aria-label="An illustrated modular sofa assembles as you scroll"
        >
          <div className="assembly-shadow" />
          <SofaLayer part="feet" />
          <SofaLayer part="frame" />
          <SofaLayer part="cushions" />
        </div>
        <div className="container absolute inset-x-0 bottom-7 z-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-[9px] text-muted-foreground">
              The comfort study · 01 · Illustration
            </p>
            <p className="mt-2 text-xs">Thoughtfully put together.</p>
          </div>
          <span className="hidden items-center gap-3 text-[10px] uppercase tracking-widest md:flex">
            Scroll to settle in <ArrowDown size={15} />
          </span>
        </div>
      </div>
    </section>
  );
}
