import { ProductImage as Image } from "./product-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/domain/catalogue";
import { money } from "@/lib/presentation/format";
export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="asset-mask relative block aspect-[5/4] overflow-hidden bg-[#eeece7]"
      >
        {product.images[0] && (
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            fill
            sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 24vw"
            priority={priority}
            className="product-photo object-cover"
          />
        )}
        <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90">
          <ArrowUpRight size={16} />
        </span>
      </Link>
      <div className="pt-4">
        <p className="mb-2 text-[10px] uppercase tracking-[.12em] text-muted-foreground">
          {product.materials[0] || "Thoughtful comfort"}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-serif text-xl leading-snug">{product.name}</h3>
        </Link>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-sm">
            {product.priceType === "from" && "From "}
            {product.price !== null
              ? money(product.price)
              : "Enquire for price"}
          </p>
          <div
            className="flex gap-1.5"
            aria-label={`${product.colours.length} listed colours`}
          >
            {product.variants.slice(0, 4).map((variant) => (
              <span
                key={variant.id}
                title={variant.colour}
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ background: variant.hex }}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
