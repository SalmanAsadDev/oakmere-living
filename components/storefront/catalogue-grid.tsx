"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition, useOptimistic } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Product } from "@/lib/domain/catalogue";
import { ProductCard } from "./product-card";
import { Reveal } from "./reveal";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
export function CatalogueGrid({ products }: { products: Product[] }) {
  const router = useRouter();
  const path = usePathname();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(params.toString());
  const selectedParams = new URLSearchParams(optimistic);
  const [search, setSearch] = useState(selectedParams.get("q") || "");
  const category = selectedParams.get("category") || "";
  const material = selectedParams.get("material") || "";
  const query = selectedParams.get("q") || "";
  useEffect(() => { setSearch(query); }, [query]);
  const sort = selectedParams.get("sort") || "featured";
  const categories = [...new Set(products.flatMap((p) => p.categories))].sort();
  const materials = [...new Set(products.flatMap((p) => p.materials))].sort();
  function change(key: string, value: string) {
    const next = new URLSearchParams(selectedParams);
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => {
      setOptimistic(next.toString());
      router.replace(`${path}${next.size ? `?${next}` : ""}`, {
        scroll: false,
      });
    });
  }
  const filtered = products.filter(
    (p) =>
      (!category || p.categories.includes(category)) &&
      (!material || p.materials.includes(material)) &&
      `${p.name} ${p.materials.join(" ")} ${p.colours.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  if (sort === "price-low")
    filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  if (sort === "price-high")
    filtered.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  const filters = (
    <>
      <fieldset>
        <legend className="eyebrow mb-5">Shape & style</legend>
        <div className="grid gap-3">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="radio"
              name="category"
              checked={!category}
              onChange={() => change("category", "")}
            />{" "}
            All sofas
          </label>
          {categories.map((c) => (
            <label
              key={c}
              className="flex items-center gap-3 text-sm capitalize"
            >
              <input
                type="radio"
                name="category"
                checked={category === c}
                onChange={() => change("category", c)}
              />
              {c.replaceAll("-", " ")}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field mt-8">
        Material
        <select
          value={material}
          onChange={(e) => change("material", e.target.value)}
        >
          <option value="">All materials</option>
          {materials.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </label>
    </>
  );
  return (
    <>
      <Reveal className="bg-muted">
        <div className="container py-12 sm:py-16">
          <p className="eyebrow reveal-text text-muted-foreground">
            The Oakmere collection
          </p>
          <h1 className="line-mask display mt-4 text-5xl sm:text-6xl">
            <span>Find your favourite seat.</span>
          </h1>
          <p className="reveal-text mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            A cosy corner. Room for the family. A place that’s entirely yours.
            Find your fit with the filters below.
          </p>
        </div>
      </Reveal>
      <div className="container py-9">
        <div className="mb-7 flex flex-wrap items-center gap-4 border-b pb-6">
          <Sheet>
            <SheetTrigger className="flex items-center gap-3 border px-5 py-3 text-xs">
              <SlidersHorizontal size={16} /> Filters{" "}
              {(category || material) && "•"}
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-md">
              <SheetHeader className="border-b p-7">
                <SheetTitle className="font-serif text-3xl font-normal">
                  A sofa that fits you.
                </SheetTitle>
                <SheetDescription>
                  Filter the collection by category and fabric.
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-auto p-7">{filters}</div>
              <SheetClose className="m-7 bg-primary p-4 text-sm text-white">
                Show {filtered.length} sofas
              </SheetClose>
            </SheetContent>
          </Sheet>
          <form
            className="flex min-w-48 flex-1 gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              change("q", search);
            }}
          >
            <Input
              aria-label="Search sofas"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search a name, colour or fabric"
            />
            <button type="submit" className="border px-4 text-xs">
              Search
            </button>
          </form>
          <select
            aria-label="Sort sofas"
            value={sort}
            onChange={(e) => change("sort", e.target.value)}
            className="h-10 border bg-background px-3 text-xs"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
          <span aria-live="polite" className="text-xs text-muted-foreground">
            {filtered.length} sofas
          </span>
        </div>
        <div
          role="group"
          aria-label="Quick category filters"
          className="mb-8 flex flex-wrap gap-2"
        >
          <button
            className={`filter-chip ${!category ? "is-active" : ""}`}
            aria-pressed={!category}
            onClick={() => change("category", "")}
          >
            All sofas
          </button>
          {[
            "corner-sofas",
            "3-2-seater-sofa-sets",
            "electric-recliners",
            "2-seater-sofas",
            "armchairs",
          ]
            .filter((c) => categories.includes(c))
            .map((c) => (
              <button
                key={c}
                className={`filter-chip capitalize ${category === c ? "is-active" : ""}`}
                aria-pressed={category === c}
                onClick={() => change("category", category === c ? "" : c)}
              >
                {c.replaceAll("-", " ")}
              </button>
            ))}
          {(category || material || query) && (
            <button
              className="inline-flex items-center gap-2 px-3 text-xs"
              onClick={() => {
                setSearch("");
                startTransition(() => {
                  setOptimistic("");
                  router.replace(path, { scroll: false });
                });
              }}
            >
              <X size={13} /> Clear filters
            </button>
          )}
        </div>
        <div aria-busy={pending} className={pending ? "opacity-60" : ""}>
          {filtered.length ? (
            <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, i) => (
                <Reveal key={product.id} index={i}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="py-16 text-center">
              No sofas match these filters. Try another colour or category.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
