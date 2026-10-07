"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Search } from "lucide-react";
import { CartDrawer } from "./cart-drawer";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
const navigation = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
export function Header() {
  const path = usePathname();
  return (
    <>
      <div className="bg-primary py-2.5 text-center text-[10px] tracking-[.13em] text-white">
        A LITTLE MORE ROOM TO LIVE <span className="mx-3 opacity-40">/</span>{" "}
        PAY ON DELIVERY
      </div>
      <header className="relative z-30 border-b bg-background">
        <div className="container flex h-20 items-center justify-between gap-4 sm:h-24">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger
                className="p-2 md:hidden"
                aria-label="Open navigation"
              >
                <Menu size={22} />
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader className="px-7 py-8">
                  <SheetTitle className="font-serif text-2xl">
                    Oakmere Living
                  </SheetTitle>
                  <SheetDescription>Make yourself at home.</SheetDescription>
                </SheetHeader>
                <nav className="grid gap-6 px-7">
                  {navigation.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={path === link.href ? "page" : undefined}
                        className="font-serif text-3xl"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link
              href="/"
              className="text-center"
              aria-label="Oakmere Living home"
            >
              <span className="block font-serif text-[24px] tracking-[.11em] sm:text-[29px]">
                OAKMERE
              </span>
              <span className="block text-[8px] tracking-[.46em]">LIVING</span>
            </Link>
          </div>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-10 text-xs md:flex"
          >
            {navigation.map((link) => (
              <Link
                className="nav-link py-3"
                aria-current={path === link.href ? "page" : undefined}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-5">
            <Link href="/shop" aria-label="Search the shop" className="p-2">
              <Search size={19} />
            </Link>
            <CartDrawer />
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="bg-[#efede6]">
      <div className="container grid gap-10 py-16 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-serif text-3xl tracking-wider">
            OAKMERE LIVING
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-muted-foreground">
            Good company. Slow Sundays. A place that feels like you. Furniture
            for a life well lived.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 text-xs"
          >
            Meet the family <ArrowUpRight size={14} />
          </Link>
        </div>
        {[
          {
            title: "Make yourself at home",
            links: [
              ["Home", "/"],
              ["Shop the collection", "/shop"],
              ["Our story", "/about"],
              ["Your cart", "/cart"],
            ],
          },
          {
            title: "A little guidance",
            links: [
              ["Get in touch", "/contact"],
              ["Delivery & returns", "/delivery"],
              ["Measuring your space", "/guides"],
              ["Fabric swatches", "/swatches"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"],
            ],
          },
        ].map((group) => (
          <div key={group.title}>
            <h2 className="eyebrow mb-5">{group.title}</h2>
            <ul className="space-y-3 text-xs text-muted-foreground">
              {group.links.map(([label, href]) => (
                <li key={href}>
                  <Link href={href}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container flex flex-wrap justify-between gap-4 border-t py-6 text-[11px] text-muted-foreground">
        <p>© {new Date().getFullYear()} Oakmere Living</p>
        <div className="flex gap-5">
          <span>United Kingdom · GBP £</span>
          <Link href="/admin">Team sign in</Link>
        </div>
      </div>
    </footer>
  );
}
