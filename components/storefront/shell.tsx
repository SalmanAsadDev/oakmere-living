"use client";
import Link from "next/link";
import { ArrowUpRight, Menu, Search, ShoppingBag, Leaf, Truck, CreditCard } from "lucide-react";
import { useBasket } from "./basket-provider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
const navigation = [{href:"/sofas",label:"All sofas"},{href:"/sofas/corner-sofas",label:"Corner sofas"},{href:"/sofas/3-2-seater-sofa-sets",label:"Sofa sets"},{href:"/sofas/recliner-sofas",label:"Recliners"},{href:"/swatches",label:"Fabric swatches"}];
export function Header() {
  const {items}=useBasket(); const count=items.reduce((sum,i)=>sum+i.quantity,0);
  return <>
    <div className="bg-primary py-2.5 text-center text-[10px] tracking-[.13em] text-white sm:text-xs">MAKE YOURSELF AT HOME <span className="mx-3 opacity-40">/</span> CASH & CARD ON DELIVERY</div>
    <header className="relative z-30 border-b border-border bg-background">
      <div className="container flex h-24 items-center justify-between gap-4">
        <div className="flex items-center gap-4"><Sheet><SheetTrigger className="p-2 lg:hidden" aria-label="Open menu"><Menu size={22}/></SheetTrigger><SheetContent side="left" className="bg-background"><SheetHeader><SheetTitle>Oakmere Living</SheetTitle></SheetHeader><nav className="grid gap-6 p-6">{navigation.map(link=><SheetClose asChild key={link.href}><Link href={link.href}>{link.label}</Link></SheetClose>)}<Link href="/about">Our story</Link><Link href="/contact">Get in touch</Link></nav></SheetContent></Sheet><Link href="/" className="text-center" aria-label="Oakmere Living home"><span className="block font-serif text-[27px] tracking-[.11em] sm:text-[32px]">OAKMERE</span><span className="block text-[9px] tracking-[.46em]">LIVING</span></Link></div>
        <nav className="hidden items-center gap-7 text-xs lg:flex">{navigation.map(link=><Link className="py-3 hover:text-muted-foreground" href={link.href} key={link.href}>{link.label}</Link>)}</nav>
        <div className="flex items-center gap-2 sm:gap-5"><Link href="/sofas?search=1" aria-label="Search sofas" className="p-2"><Search size={20}/></Link><Link href="/basket" aria-label={`Basket, ${count} items`} className="relative p-2"><ShoppingBag size={21}/>{count>0&&<span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] text-white">{count}</span>}</Link></div>
      </div>
    </header>
  </>;
}
export function Footer() { return <footer>
  <div className="border-y border-border bg-accent/50"><div className="container grid gap-7 py-8 text-xs sm:grid-cols-3">{[[Leaf,"Comfort, thoughtfully chosen"],[Truck,"Delivery, made clear"],[CreditCard,"Pay when it arrives"]].map(([Icon,label])=>{const I=Icon as typeof Leaf;return <div key={String(label)} className="flex items-center justify-center gap-3"><I size={21} strokeWidth={1.3}/><span>{String(label)}</span></div>;})}</div></div>
  <div className="container grid gap-10 py-16 md:grid-cols-[2fr_1fr_1fr_1fr]"><div><Link href="/" className="font-serif text-3xl tracking-wider">OAKMERE LIVING</Link><p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">Good company. Slow Sundays. A place that feels like you. Furniture for a life well lived.</p><Link href="/about" className="mt-6 inline-flex items-center gap-2 text-xs">Meet Oakmere <ArrowUpRight size={14}/></Link></div>
    {[{title:"Find your comfort",links:[["All sofas","/sofas"],["Corner sofas","/sofas/corner-sofas"],["Recliners","/sofas/recliner-sofas"],["Fabric swatches","/swatches"]]},{title:"A little guidance",links:[["Delivery & returns","/delivery"],["Measuring your space","/guides"],["Try in your room","/try-in-your-room"],["FAQs","/faqs"]]},{title:"Here to help",links:[["Get in touch","/contact"],["Appointments","/showrooms"],["Privacy","/privacy"],["Terms","/terms"]]}].map(group=><div key={group.title}><h2 className="eyebrow mb-5">{group.title}</h2><ul className="space-y-3 text-xs text-muted-foreground">{group.links.map(([label,href])=><li key={href}><Link className="hover:text-foreground" href={href}>{label}</Link></li>)}</ul></div>)}
  </div><div className="container flex flex-wrap justify-between gap-4 border-t border-border py-6 text-[11px] text-muted-foreground"><p>© {new Date().getFullYear()} Oakmere Living</p><div className="flex gap-5"><span>United Kingdom · GBP £</span><Link href="/admin">Team sign in</Link></div></div>
  </footer>; }
