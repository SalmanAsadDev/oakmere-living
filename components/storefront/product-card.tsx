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
    <article className="product-card group">
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
        {product.images[1]?.url.startsWith("/images/") && (
          <Image
            src={product.images[1].url}
            alt=""
            fill
            sizes="(max-width:640px) 90vw, (max-width:1024px) 45vw, 24vw"
            className="product-alternative object-cover"
          />
        )}
        <span className="product-card-action absolute bottom-4 right-4 flex h-10 items-center gap-3 rounded-full bg-white/95 px-4 text-[11px]">
          View sofa
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
        <Link
          href={`/room-planner?product=${encodeURIComponent(product.slug)}`}
          className="editorial-link mt-4 inline-flex items-center gap-2 text-[11px] text-muted-foreground"
        >
          Try it in your room <ArrowUpRight size={13} />
        </Link>
      </div>
    </article>
  );
}
