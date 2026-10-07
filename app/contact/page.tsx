import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Oakmere Living team for questions about our sofas, your order, or delivery.",
};

export default function ContactPage() {
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
          <form className="space-y-4" aria-describedby="contact-form-status">
            <p id="contact-form-status" role="status" className="text-sm text-muted-foreground">
              Online enquiries are not available yet. This form will open once our contact service is ready.
            </p>
            <fieldset disabled className="space-y-4">
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

            <Button type="submit" className="w-full mt-2">
              Send Message
            </Button>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              By submitting this form, you agree to our <a href="/privacy" className="underline">Privacy Policy</a>.
            </p>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
}
