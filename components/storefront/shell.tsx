"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ChevronDown, Menu, Search } from "lucide-react";
import { DropdownMenu } from "radix-ui";
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
  { href: "/swatches", label: "Swatches" },
  { href: "/build", label: "Build your sofa" },
  { href: "/room-planner", label: "Plan your room" },
  { href: "/about", label: "About" },
  { href: "/reviews", label: "Reviews" },
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
                className="icon-action p-2 xl:hidden"
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
                <nav
                  aria-label="Mobile navigation"
                  className="grid gap-4 overflow-y-auto px-7 pb-8"
                >
                  {navigation.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={path === link.href ? "page" : undefined}
                        className="nav-link w-fit font-serif text-2xl"
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
            className="hidden items-center gap-6 text-xs xl:flex"
          >
            {navigation.map((link) =>
              link.href === "/shop" ? (
                <DropdownMenu.Root key={link.href}>
                  <DropdownMenu.Trigger
                    className="nav-link flex min-h-11 items-center gap-2 py-3"
                    aria-current={path === "/shop" ? "page" : undefined}
                  >
                    Shop <ChevronDown size={12} />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      align="start"
                      sideOffset={12}
                      className="shop-menu z-50 min-w-64 border bg-background p-3 shadow-lg"
                    >
                      {[
                        ["Explore all sofas", "/shop"],
                        ["Corner sofas", "/shop?category=corner-sofas"],
                        ["Sofa sets", "/shop?category=3-2-seater-sofa-sets"],
                        ["U-shaped sofas", "/shop?category=u-shaped-sofas"],
                        ["Recliners", "/shop?category=recliner-sofas"],
                        ["Sofa beds", "/shop?category=sofa-beds"],
                      ].map(([label, href]) => (
                        <DropdownMenu.Item asChild key={href}>
                          <Link
                            className="nav-link block min-h-11 px-3 py-3 text-xs outline-none data-highlighted:bg-accent"
                            href={href}
                          >
                            {label}
                          </Link>
                        </DropdownMenu.Item>
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              ) : (
                <Link
                  className="nav-link py-3"
                  aria-current={path === link.href ? "page" : undefined}
                  href={link.href}
                  key={link.href}
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>
          <div className="flex items-center gap-2 sm:gap-5">
            <Link
              href="/shop"
              aria-label="Search the shop"
              className="icon-action p-2"
            >
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
      <div className="container grid gap-6 border-b py-9 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [
            "01",
            "Feel it for yourself",
            "Request fabric swatches",
            "/swatches",
          ],
          ["02", "A sofa that suits you", "Build your sofa", "/build"],
          [
            "03",
            "Picture the possibilities",
            "Plan your room",
            "/room-planner",
          ],
          ["04", "A little reassurance", "Delivery & payment", "/delivery"],
        ].map(([number, title, label, href]) => (
          <Link
            key={href}
            href={href}
            className="editorial-link flex items-start gap-4 py-3"
          >
            <span className="font-serif text-xl text-muted-foreground">
              {number}
            </span>
            <span>
              <span className="block font-serif text-lg">{title}</span>
              <span className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                {label}
                <ArrowUpRight size={14} />
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="container grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
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
            className="editorial-link mt-6 inline-flex items-center gap-2 text-xs"
          >
            Meet the family <ArrowUpRight size={14} />
          </Link>
        </div>
        {[
          {
            title: "The collection",
            links: [
              ["Shop the collection", "/shop"],
              ["Corner sofas", "/shop?category=corner-sofas"],
              ["Sofa sets", "/shop?category=3-2-seater-sofa-sets"],
              ["U-shaped sofas", "/shop?category=u-shaped-sofas"],
              ["Recliners", "/shop?category=recliner-sofas"],
              ["Build your sofa", "/build"],
            ],
          },
          {
            title: "A little guidance",
            links: [
              ["Get in touch", "/contact"],
              ["Delivery & returns", "/delivery"],
              ["Measuring your space", "/guides"],
              ["Fabric swatches", "/swatches"],
              ["Plan your room", "/room-planner"],
              ["FAQs", "/faqs"],
              ["Order help", "/my-orders"],
            ],
          },
          {
            title: "At Oakmere",
            links: [
              ["Our story", "/about"],
              ["Customer reviews", "/reviews"],
              ["Request a consultation", "/appointment"],
              ["The journal", "/blog"],
              ["Your basket", "/cart"],
              ["Staff access", "/admin"],
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
                  <Link className="nav-link inline-block py-1" href={href}>
                    {label}
                  </Link>
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
        </div>
      </div>
    </footer>
  );
}
