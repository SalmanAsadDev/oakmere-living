"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { Armchair } from "lucide-react";
export function ProductImage(props: ImageProps) {
  const [failed, setFailed] = useState<string | null>(null);
  if (!props.src || failed === String(props.src))
    return (
      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted text-muted-foreground"
        role="img"
        aria-label={`${props.alt}: photograph unavailable`}
      >
        <Armchair size={38} strokeWidth={1} />
        <span className="text-xs">Photograph coming soon</span>
      </div>
    );
  return <Image {...props} onError={() => setFailed(String(props.src))} />;
}
