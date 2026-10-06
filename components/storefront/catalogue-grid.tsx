import Link from "next/link";
import { products } from "@/lib/domain/catalogue";
import { ProductCard } from "./product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CatalogueGrid({ category, query = "", sort = "featured" }: {category?:string;query?:string;sort?:string}) {
  const categoryNames = [...new Set(products.flatMap(p=>p.categories))];
  const filtered=products.filter(p=>(!category||p.categories.includes(category))&&`${p.name} ${p.materials.join(" ")} ${p.colours.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  if(sort==="price-low") filtered.sort((a,b)=>(a.price??Infinity)-(b.price??Infinity));
  if(sort==="price-high") filtered.sort((a,b)=>(b.price??-1)-(a.price??-1));
  return <div className="container section"><p className="eyebrow text-muted-foreground">Find your place to unwind</p><h1 className="display mt-4 text-5xl capitalize">{category?.replaceAll("-"," ")||"The sofa collection"}</h1><p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">From a cosy corner to room for the whole family. Explore shapes, fabrics and colours to suit your home.</p><nav aria-label="Sofa categories" className="my-8 flex flex-wrap gap-2"><Link href="/sofas" className="rounded-full border px-4 py-2 text-xs">All sofas</Link>{categoryNames.map(name=><Link key={name} href={`/sofas/${name}`} aria-current={name===category?"page":undefined} className={`rounded-full border px-4 py-2 text-xs capitalize ${name===category?"bg-primary text-white":""}`}>{name.replaceAll("-"," ")}</Link>)}</nav><form className="mb-9 flex flex-wrap items-center gap-3 border-y py-5"><Input aria-label="Search sofas" name="q" defaultValue={query} placeholder="Search a name, colour or fabric" className="max-w-sm"/><select aria-label="Sort sofas" name="sort" defaultValue={sort} className="h-10 border bg-background px-3 text-sm"><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><Button type="submit">Apply</Button><span className="text-xs text-muted-foreground sm:ml-auto">{filtered.length} sofas</span></form>{filtered.length?<div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{filtered.map(product=><ProductCard key={product.id} product={product}/>)}</div>:<p className="py-16 text-center">No sofas match your search. Try another colour or name.</p>}</div>;
}
