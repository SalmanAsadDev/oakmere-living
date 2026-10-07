"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SwatchesPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/swatches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit request");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong.");
    }
  }

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
          {status === "success" ? (
            <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
              <p className="font-medium">Request submitted successfully!</p>
              <p className="text-sm mt-1">We'll process your swatches shortly and send them to your address.</p>
              <Button variant="outline" className="mt-4" onClick={() => setStatus("idle")}>
                Request more
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === "error" && (
                <div className="p-3 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
                  {errorMessage}
                </div>
              )}
              <fieldset disabled={status === "loading"} className="space-y-4">
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

                <Button type="submit" className="w-full mt-4" disabled={status === "loading"}>
                  {status === "loading" ? "Submitting..." : "Request Swatches"}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Your details will only be used to send your swatches. See our <a href="/privacy" className="underline">Privacy Policy</a>.
                </p>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
