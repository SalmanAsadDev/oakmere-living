import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Buying Guides",
  description: "Helpful guides on measuring your space, choosing the right material, and understanding corner sofa orientations.",
};

const guides = [
  {
    title: "Measuring for Delivery",
    description: "Learn how to accurately measure your doorways, hallways, and room to ensure your new sofa fits perfectly.",
    slug: "measuring-for-delivery",
  },
  {
    title: "Left vs Right Hand Corner Sofas",
    description: "Confused about corner sofa orientation? Our simple guide explains how to choose the correct side.",
    slug: "corner-orientation",
  },
  {
    title: "Fabric vs Leather",
    description: "Compare the benefits of different materials to find the perfect match for your lifestyle.",
    slug: "materials-guide",
  },
];

export default function GuidesIndexPage() {
  return (
    <div className="container section max-w-5xl">
      <div className="mb-12">
        <h1 className="display text-4xl mb-4">Buying Guides</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Everything you need to know before buying a sofa. From getting the measurements right 
          to choosing the perfect material for your home.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`} className="block group">
            <Card className="h-full transition-colors hover:border-primary/50 hover:bg-muted/10">
              <CardHeader>
                <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                  {guide.title}
                </CardTitle>
                <CardDescription className="pt-2 text-sm leading-relaxed">
                  {guide.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary link-underline">Read guide &rarr;</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
