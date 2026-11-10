import type { Metadata } from "next";
import "./globals.css";
import { searchIndexingEnabled, site } from "@/lib/config/site";
import { BasketProvider } from "@/components/storefront/basket-provider";
import { Header, Footer, ScrollToTop } from "@/components/storefront/shell";
import { SofaGuide } from "@/components/storefront/sofa-guide";
import { getProducts } from "@/lib/domain/catalogue";
import { Suspense } from "react";
async function CatalogueGuide() {
  const products = await getProducts().catch(() => []);
  return (
    <SofaGuide
      catalogue={products.map((p) => ({
        name: p.name,
        slug: p.slug,
        price: p.price,
        search: [p.name, ...p.categories, ...p.materials, ...p.colours].join(
          " ",
        ),
      }))}
    />
  );
}
export const metadata: Metadata = {
  metadataBase: new URL(site.origin),
  applicationName: site.name,
  category: "shopping",
  title: {
    default: "Corner Sofas, Sofa Sets & Recliners UK | Oakmere Living",
    template: "%s | Oakmere Living",
  },
  description: site.description,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
    url: site.origin,
    title: {
      default: "Corner Sofas, Sofa Sets & Recliners UK | Oakmere Living",
      template: "%s | Oakmere Living",
    },
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: {
      default: "Corner Sofas, Sofa Sets & Recliners UK | Oakmere Living",
      template: "%s | Oakmere Living",
    },
    description: site.description,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
  robots: searchIndexingEnabled
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: false },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.origin}/#website`,
      url: site.origin,
      name: site.name,
      description: site.description,
      inLanguage: "en-GB",
    },
    {
      "@type": "OnlineStore",
      "@id": `${site.origin}/#store`,
      url: site.origin,
      name: site.name,
      description: site.description,
      areaServed: { "@type": "Country", name: "United Kingdom" },
      currenciesAccepted: "GBP",
    },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
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
          <Suspense fallback={null}>
            <CatalogueGuide />
          </Suspense>
          <ScrollToTop />
        </BasketProvider>
      </body>
    </html>
  );
}
