"use client";
import { useState } from "react";
import { uploadProductImage } from "@/app/admin/(dashboard)/products/actions";

export function PhotoUpload({
  onUploaded,
}: {
  onUploaded: (url: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(file: File | undefined) {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 15000000
    ) {
      setMessage("Choose a JPEG, PNG or WebP photograph below 15 MB.");
      return;
    }
    setBusy(true);
    setMessage("Optimising photograph…");
    try {
      const bitmap = await createImageBitmap(file);
      let blob: Blob | null;
      try {
        if (bitmap.width * bitmap.height > 50000000)
          throw new Error("Image is too large");
        const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Image conversion unavailable");
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/webp", 0.82),
        );
      } finally {
        bitmap.close();
      }
      if (!blob || blob.size > 900000)
        throw new Error("Please choose a smaller photograph");
      const form = new FormData();
      form.set(
        "image",
        new File([blob], "product.webp", { type: "image/webp" }),
      );
      const result = await uploadProductImage(form);
      if (!result.url) throw new Error(result.error);
      onUploaded(result.url);
      setMessage(
        "Photograph uploaded. Save the product to use it in the shop.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Upload failed. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-2">
      <label className="block text-sm">
        Upload a product photograph
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          className="mt-2 block w-full text-sm"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            void upload(file);
          }}
        />
      </label>
      <p className="text-xs text-stone-500">
        Product photographs are public. Upload images you have permission to
        publish. Images are resized and converted to WebP.
      </p>
      <p role="status" className="text-sm">
        {message}
      </p>
    </div>
  );
}
