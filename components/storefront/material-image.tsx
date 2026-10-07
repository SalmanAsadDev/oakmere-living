"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ProductImage } from "./product-image";
export function MaterialImage({
  src,
  alternatives,
  alt,
}: {
  src: string;
  alternatives: string[];
  alt: string;
}) {
  const [base, setBase] = useState(src);
  const [incoming, setIncoming] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const loaded = useRef(new Set<string>());
  const failedSources = useRef(new Set<string>());
  const requested = useRef(src);
  function show(url: string) {
    if (url !== requested.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBase(url);
      setIncoming(null);
    } else if (url !== base) setIncoming(url);
    else setIncoming(null);
  }
  useEffect(() => {
    requested.current = src;
    setFailed(failedSources.current.has(src));
    setIncoming(null);
    if (loaded.current.has(src)) show(src);
  }, [src]); // Incoming images are only revealed after their load event.
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) {
        if (loaded.current.has(requested.current)) setBase(requested.current);
        setIncoming(null);
      }
    };
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  const sources = [...new Set([src, ...alternatives])].filter(Boolean);
  return (
    <>
      <ProductImage
        src={base}
        alt={alt}
        fill
        preload
        sizes="(max-width:1024px) 95vw, 55vw"
        className="object-contain"
      />
      {sources.map((url, index) => (
        <Image
          key={url}
          src={url}
          alt=""
          aria-hidden
          fill
          preload={index < 3}
          loading={index < 3 ? undefined : "eager"}
          sizes="(max-width:1024px) 95vw, 55vw"
          className={`object-contain ${incoming === url ? "material-incoming" : "invisible"}`}
          onLoad={() => {
            failedSources.current.delete(url);
            loaded.current.add(url);
            if (requested.current === url) show(url);
          }}
          onError={() => {
            failedSources.current.add(url);
            if (requested.current === url) {
              setIncoming(null);
              setFailed(true);
            }
          }}
          onAnimationEnd={() => {
            if (requested.current === url && incoming === url) {
              setBase(url);
              setIncoming(null);
            }
          }}
        />
      ))}
      {failed && (
        <p
          role="status"
          className="absolute inset-x-3 bottom-3 bg-background/95 p-3 text-center text-xs"
        >
          This configuration’s photograph is unavailable. Showing the previous
          view.
        </p>
      )}
    </>
  );
}
