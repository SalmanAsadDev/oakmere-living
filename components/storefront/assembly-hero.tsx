"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

// Original vector design study: separate components share a fixed coordinate system.
// It illustrates assembly; it is not a photograph or a claim about a catalogue SKU.
function SofaLayer({ part }: { part: "feet" | "frame" | "cushions" }) {
  return (
    <svg
      viewBox="0 0 900 650"
      aria-hidden="true"
      className={`assembly-layer assembly-${part}`}
    >
      <defs>
        <linearGradient id={`fabric-${part}`} x1="0" y1="0" x2=".8" y2="1">
          <stop stopColor="#c9c4b3" />
          <stop offset=".5" stopColor="#b2ac96" />
          <stop offset="1" stopColor="#969078" />
        </linearGradient>
        <linearGradient id={`edge-${part}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#948d76" />
          <stop offset="1" stopColor="#736e5c" />
        </linearGradient>
        <pattern
          id={`weave-${part}`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M0 1H4M1 0V4"
            stroke="#fff"
            strokeOpacity=".07"
            strokeWidth=".6"
          />
        </pattern>
      </defs>
      {part === "feet" && (
        <g fill="#544333">
          <path d="M203 444l22 6-7 55-16-5zM633 463l21-7 8 53-17 5zM731 389l18-5 7 47-16 6z" />
          <path d="M347 369l18 5-3 42-15-3z" />
        </g>
      )}
      {part === "frame" && (
        <g stroke="#77715f" strokeWidth="1">
          <path
            d="M181 319 Q178 303 197 297 L594 197 Q607 193 618 204 L749 319 640 432 217 440Z"
            fill={`url(#fabric-${part})`}
          />
          <path
            d="M208 385L611 286 750 365 638 461 217 445Q202 443 201 425Z"
            fill={`url(#edge-${part})`}
          />
          <path
            d="M209 365L612 265 750 343 638 432 218 417Q201 411 202 392Z"
            fill={`url(#fabric-${part})`}
          />
          <path
            d="M176 308Q185 297 207 301L251 328Q262 336 260 353L256 420Q254 438 233 436L189 414Q175 408 175 391Z"
            fill={`url(#fabric-${part})`}
          />
          <path
            d="M176 309L220 334Q231 340 230 357L228 433"
            fill="none"
            stroke="#ddd7c5"
          />
          <path
            d="M656 327L716 281Q728 274 740 282L768 305Q777 313 774 326L766 385Q762 400 750 408L674 459Q659 465 652 452L650 359Q650 337 656 327Z"
            fill={`url(#fabric-${part})`}
          />
          <path
            d="M666 340L747 292M662 354L660 446"
            fill="none"
            stroke="#e0d9c7"
          />
          <path d="M205 420L636 446" fill="none" opacity=".5" />
        </g>
      )}
      {part === "cushions" && (
        <g stroke="#8b846f" strokeWidth="1">
          <path
            d="M238 315L423 267Q433 264 439 275L463 331 282 380Q270 383 263 372Z"
            fill={`url(#fabric-${part})`}
          />
          <path
            d="M443 265L610 222Q622 218 630 230L661 289 482 335Q469 338 463 326Z"
            fill={`url(#fabric-${part})`}
          />
          <path
            d="M270 365L459 317 519 353Q526 359 520 366L349 410Q331 414 320 406L268 378Q260 372 270 365Z"
            fill={`url(#fabric-${part})`}
          />
          <path
            d="M470 314L646 270 708 313Q716 320 706 327L541 370Q529 373 520 367L469 330Q459 321 470 314Z"
            fill={`url(#fabric-${part})`}
          />
          <path
            d="M277 373L332 402Q340 407 352 403L509 362M479 322L532 362 700 320M249 321L429 277M455 270L615 230"
            fill="none"
            stroke="#e1dac7"
            strokeWidth="1.5"
          />
          <path
            d="M238 315L423 267 463 331 349 410 270 378ZM443 265L610 222 708 313 541 370 470 330Z"
            fill={`url(#weave-${part})`}
            stroke="none"
          />
        </g>
      )}
    </svg>
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
          <div className="mt-5 flex items-end justify-between gap-8">
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
            <div className="hidden max-w-[260px] pb-3 md:block">
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
              The comfort study · 01
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
