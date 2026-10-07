import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Request Free Swatches",
  description: "Request up to four free fabric swatches to see and feel the quality of our materials in your own home.",
};

export default function SwatchesPage() {
  return (
    <div className="container section max-w-4xl">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="display text-4xl mb-4">Request Free Swatches</h1>
          <p className="text-muted-foreground mb-6">
            We understand that choosing a sofa is a tactile experience. 
            Request up to <strong>four free fabric swatches</strong> to see the exact colour 
            in your room's lighting and feel the quality of our materials before you buy.
          </p>

          <div className="bg-muted/30 p-6 rounded-lg border border-border mb-8">
            <h2 className="font-serif text-lg text-primary mb-2">How it works</h2>
            <ol className="list-decimal pl-4 space-y-2 text-sm text-muted-foreground">
              <li>Select up to four fabrics you'd like to see.</li>
              <li>Fill in your delivery details in the form.</li>
              <li>We'll post them to you via Royal Mail within 1-2 working days.</li>
              <li>Use them to check against your decor, lighting, and carpets.</li>
            </ol>
          </div>
          
          <div className="hidden md:block">
            <p className="text-sm text-muted-foreground italic">
              * The fabric selection feature is coming soon as part of our catalogue update. 
              In the meantime, please list the names or colours of the fabrics you are interested in 
              in the notes section.
            </p>
          </div>
        </div>

        <div className="bg-muted/10 p-6 sm:p-8 rounded-lg border border-border">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required placeholder="Your name" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" required placeholder="For dispatch updates" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Postal Address</Label>
              <Textarea 
                id="address" 
                name="address" 
                required 
                placeholder="Include house name/number, street, town, and postcode" 
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Fabrics Requested (Max 4)</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                placeholder="E.g. Emerald Green Velvet, Charcoal Linen..." 
                rows={2}
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Request Swatches
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Your details will only be used to send your swatches. See our <a href="/privacy" className="underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
