import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Showrooms",
  description: "Information about Oakmere Living showrooms and our online-first approach.",
  alternates: { canonical: "/showrooms" },
};

export default function ShowroomsPage() {
  return (
    <div className="container section max-w-3xl text-center">
      <h1 className="display text-4xl mb-6">Our Showrooms</h1>
      
      <div className="bg-muted/30 p-8 rounded-lg border border-border mt-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-serif text-primary mb-4">Direct to You</h2>
        <p className="text-muted-foreground mb-6">
          Currently, Oakmere Living operates primarily as an online-first retailer. 
          By avoiding expensive high-street showroom overheads, we are able to invest more 
          in the quality of our furniture and pass those savings directly to you.
        </p>
        
        <p className="text-muted-foreground mb-8">
          We understand that buying a sofa online can feel like a big decision. That's why we offer 
          free fabric swatches so you can feel the quality of our materials, and comprehensive 
          guides to help you measure perfectly for your space.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/swatches">Request Free Swatches</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/guides">Read Our Buying Guides</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
