"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Upload, RotateCcw, Download, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PlanningProduct } from "@/lib/domain/planning";
const defaults = { x: 50, y: 65, scale: 50, rotation: 0, flipped: false };
const clamp = (n: number) => Math.min(95, Math.max(5, n));

export function RoomPlanner({
  products,
  initialSlug,
}: {
  products: PlanningProduct[];
  initialSlug?: string;
}) {
  const [slug, setSlug] = useState(
    products.find((p) => p.slug === initialSlug)?.slug ||
      products[0]?.slug ||
      "",
  );
  const product = products.find((p) => p.slug === slug);
  const [variantId, setVariantId] = useState("");
  const variant = product?.variants.find((v) => v.id === variantId);
  const source = variant?.image.startsWith("/images/")
    ? variant.image
    : product?.image;
  const [room, setRoom] = useState<HTMLImageElement | null>(null);
  const [sofa, setSofa] = useState<{
    source: string;
    image: HTMLImageElement;
  } | null>(null);
  const [layout, setLayout] = useState(defaults);
  const [error, setError] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [reading, setReading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadVersion = useRef(0);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    startX: number;
    startY: number;
  } | null>(null);
  const ready = Boolean(room && sofa?.source === source);
  useEffect(() => {
    if (!source) return;
    let ignore = false;
    const image = new Image();
    image.src = `/_next/image?url=${encodeURIComponent(source)}&w=1080&q=75`;
    image
      .decode()
      .then(() => {
        if (!ignore) {
          setSofa({ source, image });
          setPhotoError("");
        }
      })
      .catch(() => {
        if (!ignore)
          setPhotoError(
            "This photograph could not load. Please choose another sofa.",
          );
      });
    return () => {
      ignore = true;
    };
  }, [source]);
  useEffect(
    () => () => {
      uploadVersion.current += 1;
    },
    [],
  );
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#eeece5";
    ctx.fillRect(0, 0, 1200, 800);
    if (room) {
      const fit = Math.min(1200 / room.width, 800 / room.height);
      const width = room.width * fit,
        height = room.height * fit;
      ctx.drawImage(
        room,
        (1200 - width) / 2,
        (800 - height) / 2,
        width,
        height,
      );
    }
    if (room && sofa && sofa.source === source) {
      const width = (1200 * layout.scale) / 100,
        height = (width * sofa.image.height) / sofa.image.width;
      ctx.save();
      ctx.translate(layout.x * 12, layout.y * 8);
      ctx.rotate((layout.rotation * Math.PI) / 180);
      ctx.scale(layout.flipped ? -1 : 1, 1);
      ctx.drawImage(sofa.image, -width / 2, -height / 2, width, height);
      ctx.restore();
    }
    ctx.fillStyle = "#fbfaf7";
    ctx.fillRect(0, 764, 1200, 36);
    ctx.fillStyle = "#344639";
    ctx.font = "16px Arial";
    ctx.fillText("OAKMERE LIVING · Photo moodboard · Not to scale", 20, 788);
  }, [room, sofa, source, layout]);
  async function upload(file?: File) {
    if (!file) return;
    const version = ++uploadVersion.current;
    setError("");
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 15 * 1024 * 1024
    ) {
      setError("Choose a JPEG, PNG or WebP photograph up to 15 MB.");
      setReading(false);
      return;
    }
    setReading(true);
    const url = URL.createObjectURL(file);
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (version !== uploadVersion.current) return;
      if (image.width * image.height > 40_000_000)
        throw new Error(
          "Please resize your photograph to under 40 megapixels.",
        );
      setRoom(image);
      setLayout(defaults);
    } catch (err) {
      if (version === uploadVersion.current)
        setError(
          err instanceof Error && err.message.startsWith("Please")
            ? err.message
            : "We could not read that photograph. Try another image.",
        );
    } finally {
      URL.revokeObjectURL(url);
      if (version === uploadVersion.current) setReading(false);
    }
  }
  function save() {
    if (!ready) return;
    try {
      canvasRef.current?.toBlob(
        (blob) => {
          if (!blob) {
            setError("Your image could not be saved. Please try again.");
            return;
          }
          const url = URL.createObjectURL(blob),
            link = document.createElement("a");
          link.href = url;
          link.download = "oakmere-room-moodboard.jpg";
          link.click();
          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        0.9,
      );
    } catch {
      setError(
        "Your browser could not export this photograph. Please choose another sofa.",
      );
    }
  }
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="relative aspect-[3/2] overflow-hidden border bg-muted">
          <canvas
            ref={canvasRef}
            width={1200}
            height={800}
            aria-label="Room moodboard. Use the labelled sliders to position your sofa."
            className="block h-full w-full touch-none cursor-grab active:cursor-grabbing"
            onPointerDown={(event) => {
              if (!ready) return;
              event.currentTarget.setPointerCapture(event.pointerId);
              drag.current = {
                id: event.pointerId,
                x: event.clientX,
                y: event.clientY,
                startX: layout.x,
                startY: layout.y,
              };
            }}
            onPointerMove={(event) => {
              const current = drag.current;
              if (!current || current.id !== event.pointerId) return;
              const rect = event.currentTarget.getBoundingClientRect();
              setLayout((old) => ({
                ...old,
                x: clamp(
                  current.startX +
                    ((event.clientX - current.x) / rect.width) * 100,
                ),
                y: clamp(
                  current.startY +
                    ((event.clientY - current.y) / rect.height) * 100,
                ),
              }));
            }}
            onPointerUp={() => {
              drag.current = null;
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
            onLostPointerCapture={() => {
              drag.current = null;
            }}
          />
          {!room && (
            <div className="absolute inset-0 grid place-content-center gap-4 px-6 text-center">
              <Upload className="mx-auto" size={28} strokeWidth={1} />
              <h2 className="font-serif text-2xl sm:text-3xl">
                Start with your space.
              </h2>
              <p className="mx-auto hidden max-w-sm text-sm leading-6 text-muted-foreground sm:block">
                Your room photo stays on this device.
              </p>
              <Button
                className="mx-auto h-12 rounded-none"
                onClick={() => inputRef.current?.click()}
                disabled={reading}
              >
                {reading ? "Opening photograph…" : "Choose room photograph"}
              </Button>
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          aria-label="Upload room photograph"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          onChange={(event) => {
            void upload(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <p className="mt-4 text-xs leading-6 text-muted-foreground">
          Your room photo stays on this device. JPEG, PNG or WebP · up to 15 MB.
          This is a photo moodboard, not an AR fitting tool. Product photographs
          retain their original backgrounds. Scale and colour are illustrative;
          check measurements before ordering.
        </p>
        <p role="status" className="mt-3 text-sm">
          {error ||
            photoError ||
            (room && !ready ? "Loading sofa photograph…" : "")}
        </p>
        {room && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={reading}
            >
              Change room photo
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                uploadVersion.current += 1;
                setRoom(null);
                setLayout(defaults);
                setReading(false);
                setError("");
              }}
            >
              Remove photo
            </Button>
            <Button onClick={save} disabled={!ready}>
              <Download /> Save moodboard
            </Button>
          </div>
        )}
      </div>
      <aside className="space-y-6 border bg-white p-6">
        <p className="eyebrow text-muted-foreground">Your room, your way</p>
        <label className="field">
          Choose a sofa
          <select
            value={slug}
            onChange={(event) => {
              setSlug(event.target.value);
              setVariantId("");
              setPhotoError("");
            }}
          >
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        {product &&
          product.variants.some((v) => v.image.startsWith("/images/")) && (
            <label className="field">
              Photographed configuration
              <select
                value={variantId}
                onChange={(event) => {
                  setVariantId(event.target.value);
                  setPhotoError("");
                }}
              >
                <option value="">Main photograph</option>
                {product.variants
                  .filter((v) => v.image.startsWith("/images/"))
                  .map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.label}
                    </option>
                  ))}
              </select>
            </label>
          )}
        <fieldset disabled={!room} className="space-y-5 disabled:opacity-50">
          <legend className="mb-5 flex items-center gap-2 text-sm">
            <Move size={16} /> Position & proportion
          </legend>
          {(
            [
              { key: "x", label: "Horizontal position", min: 5, max: 95 },
              { key: "y", label: "Vertical position", min: 5, max: 95 },
              { key: "scale", label: "Sofa size", min: 15, max: 90 },
              { key: "rotation", label: "Rotation", min: -45, max: 45 },
            ] as const
          ).map((control) => (
            <label key={control.key} className="grid gap-2 text-xs">
              {control.label}
              <input
                type="range"
                min={control.min}
                max={control.max}
                value={layout[control.key]}
                onChange={(event) =>
                  setLayout((old) => ({
                    ...old,
                    [control.key]: Number(event.target.value),
                  }))
                }
                className="w-full accent-primary"
              />
            </label>
          ))}
          <label className="flex gap-3 text-xs">
            <input
              type="checkbox"
              checked={layout.flipped}
              onChange={(event) =>
                setLayout((old) => ({ ...old, flipped: event.target.checked }))
              }
            />{" "}
            Mirror photograph (visual only)
          </label>
          <Button variant="outline" onClick={() => setLayout(defaults)}>
            <RotateCcw /> Reset position
          </Button>
        </fieldset>
        {product && (
          <Link
            className="editorial-link block border-t pt-5 text-sm link-underline"
            href={`/products/${product.slug}`}
          >
            View {product.name} →
          </Link>
        )}
        <Link
          className="block text-xs link-underline"
          href="/guides/measuring-for-delivery"
        >
          Check the real measurements
        </Link>
      </aside>
    </div>
  );
}
