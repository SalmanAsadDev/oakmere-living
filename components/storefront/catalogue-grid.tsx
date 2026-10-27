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
      router.replace(`${path}${next.size ? `?${next}` : ""}`, { scroll: false });
    });
  }

  function clearAll() {
    setSearch("");
    startTransition(() => {
      setOptimistic("");
      router.replace(path, { scroll: false });
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

  const activeCount = [category, material, query].filter(Boolean).length;

  const filterControls = (
    <>
      <fieldset className="border-none p-0">
        <legend className="eyebrow mb-4 text-[10px] text-muted-foreground">
          Shape &amp; style
        </legend>
        <div className="space-y-px">
          <button
            className={`sidebar-filter-btn${!category ? " is-active" : ""}`}
            aria-pressed={!category}
            onClick={() => change("category", "")}
          >
            All sofas
          </button>
          {categories.map((c) => (
            <button
              key={c}
              className={`sidebar-filter-btn capitalize${category === c ? " is-active" : ""}`}
              aria-pressed={category === c}
              onClick={() => change("category", category === c ? "" : c)}
            >
              {c.replaceAll("-", " ")}
            </button>
          ))}
        </div>
      </fieldset>
      {materials.length > 0 && (
        <fieldset className="mt-8 border-none p-0">
          <legend className="eyebrow mb-4 text-[10px] text-muted-foreground">
            Material
          </legend>
          <div className="space-y-px">
            <button
              className={`sidebar-filter-btn${!material ? " is-active" : ""}`}
              aria-pressed={!material}
              onClick={() => change("material", "")}
            >
              All materials
            </button>
            {materials.map((m) => (
              <button
                key={m}
                className={`sidebar-filter-btn${material === m ? " is-active" : ""}`}
                aria-pressed={material === m}
                onClick={() => change("material", material === m ? "" : m)}
              >
                {m}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {activeCount > 0 && (
        <button
          className="mt-8 flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          onClick={clearAll}
        >
          <X size={11} /> Clear all
        </button>
      )}
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
            A cosy corner. Room for the family. A place that&apos;s entirely
            yours. Find your fit with the filters below.
          </p>
        </div>
      </Reveal>
      <div className="container py-9">
        {/* Toolbar */}
        <div className="mb-8 flex flex-wrap items-center gap-3 border-b pb-6">
          {/* Mobile-only filter sheet trigger */}
          <Sheet>
            <SheetTrigger className="flex items-center gap-2.5 border bg-background px-4 py-2.5 text-xs transition-colors hover:bg-muted lg:hidden">
              <SlidersHorizontal size={14} />
              Filters
              {activeCount > 0 && (
                <span className="filter-count">{activeCount}</span>
              )}
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
              <div className="flex-1 overflow-auto p-7">{filterControls}</div>
              <SheetClose className="m-7 block bg-primary p-4 text-center text-sm text-white">
                Show {filtered.length}{" "}
                {filtered.length === 1 ? "sofa" : "sofas"}
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
            <button
              type="submit"
              className="border bg-background px-4 text-xs transition-colors hover:bg-muted"
            >
              Search
            </button>
          </form>

          <div className="filter-select-wrap">
            <select
              aria-label="Sort sofas"
              value={sort}
              onChange={(e) => change("sort", e.target.value)}
              className="filter-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </select>
          </div>

          <span aria-live="polite" className="text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "sofa" : "sofas"}
          </span>
        </div>

        {/* Sidebar + grid */}
        <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-10 xl:grid-cols-[220px_1fr] xl:gap-12">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 pb-10">
              {filterControls}
            </div>
          </aside>

          {/* Product area */}
          <div>
            {/* Mobile quick-filter chips */}
            <div
              role="group"
              aria-label="Quick category filters"
              className="mb-6 flex flex-wrap gap-2 lg:hidden"
            >
              <button
                className={`filter-chip${!category ? " is-active" : ""}`}
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
                    className={`filter-chip capitalize${category === c ? " is-active" : ""}`}
                    aria-pressed={category === c}
                    onClick={() =>
                      change("category", category === c ? "" : c)
                    }
                  >
                    {c.replaceAll("-", " ")}
                  </button>
                ))}
              {activeCount > 0 && (
                <button
                  className="inline-flex items-center gap-2 px-3 text-xs"
                  onClick={clearAll}
                >
                  <X size={13} /> Clear
                </button>
              )}
            </div>

            <div
              aria-busy={pending}
              className={
                pending
                  ? "opacity-60 transition-opacity duration-300"
                  : "transition-opacity duration-300"
              }
            >
              {filtered.length ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-10 xl:grid-cols-3">
                  {filtered.map((product, i) => (
                    <Reveal key={product.id} index={i}>
                      <ProductCard product={product} />
                    </Reveal>
                  ))}
                </div>
              ) : (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No sofas match these filters.{" "}
                  <button
                    onClick={clearAll}
                    className="underline underline-offset-4"
                  >
                    Clear filters
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
