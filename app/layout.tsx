import type { Metadata } from "next";
import "./globals.css";
import { site } from "@/lib/config/site";
import { BasketProvider } from "@/components/storefront/basket-provider";
import { Header, Footer } from "@/components/storefront/shell";
export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  title: {
    default: "Oakmere Living | Sofas for a life well lived",
    template: "%s | Oakmere Living",
  },
  description: site.description,
  robots:
    process.env.APP_ENV === "production"
      ? { index: true, follow: true }
      : { index: false, follow: false },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        <BasketProvider>
          <a
            href="#main"
            className="fixed -top-20 left-4 z-50 bg-white p-4 focus:top-4"
          >
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </BasketProvider>
      </body>
    </html>
  );
}
