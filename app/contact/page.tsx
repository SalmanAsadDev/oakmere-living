"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message");
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
          <h1 className="display text-4xl mb-4">Contact Us</h1>
          <p className="text-muted-foreground mb-8">
            Whether you have a question about our products, need help with an order, or want to check delivery options, 
            our team is here to help. We aim to respond to all enquiries within 24 hours.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif text-primary mb-2">Customer Service Hours</h2>
              <p className="text-muted-foreground">Monday to Friday: 9am – 5pm</p>
              <p className="text-muted-foreground">Saturday: 10am – 4pm</p>
              <p className="text-muted-foreground">Sunday: Closed</p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-primary mb-2">Direct Contact</h2>
              <p className="text-muted-foreground">
                Our direct contact details are being confirmed.
              </p>
              <p className="text-muted-foreground mt-2 text-sm italic">
                * Phone and WhatsApp contacts will be available once confirmed by our team.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted/30 p-6 sm:p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-serif text-primary mb-6">Send a Message</h2>
          {status === "success" ? (
            <div className="p-4 bg-green-50 text-green-800 rounded-md border border-green-200">
              <p className="font-medium">Message sent successfully!</p>
              <p className="text-sm mt-1">Thank you for getting in touch. We will reply as soon as possible.</p>
              <Button variant="outline" className="mt-4" onClick={() => setStatus("idle")}>
                Send another message
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
                  <Input id="email" name="email" type="email" required placeholder="your.email@example.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" name="phone" type="tel" placeholder="For delivery or urgent order updates" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Order Number (Optional)</Label>
                  <Input id="order" name="order" placeholder="If your enquiry is about an existing order" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    name="message" 
                    required 
                    placeholder="How can we help you today?" 
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full mt-2" disabled={status === "loading"}>
                  {status === "loading" ? "Sending..." : "Send Message"}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  By submitting this form, you agree to our <a href="/privacy" className="underline">Privacy Policy</a>.
                </p>
              </fieldset>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
