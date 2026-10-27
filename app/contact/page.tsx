import type { Metadata } from "next";
import ContactForm from "@/components/storefront/contact-form";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with the Oakmere Living team. Questions about delivery, fabric samples, availability or an existing order — we are here to help.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; product?: string; order?: string }>;
}) {
  const params = await searchParams;
  const raw =
    params.message ||
    (params.product
      ? `Please tell me more about ${params.product}.`
      : params.order
        ? `Please help me with order ${params.order}.`
        : "");
  // Strip control characters and cap length before passing to the client.
  const initialMessage = raw.replace(/[\x00-\x1f\x7f]/g, "").slice(0, 2000);

  return (
    <div className="container section max-w-4xl">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h1 className="display text-4xl mb-4">Contact Us</h1>
          <p className="text-muted-foreground mb-8">
            Whether you have a question about our products, need help with an
            order, or want to check delivery options, our team is here to help.
            Include the sofa name and the details you would like us to confirm.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif text-primary mb-2">
                A conversation, not a commitment
              </h2>
              <p className="text-muted-foreground">
                Design and appointment enquiries are requests. The team will
                confirm availability, prices and arrangements before anything is
                agreed.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-serif text-primary mb-2">
                Direct Contact
              </h2>
              <p className="text-muted-foreground">
                Our direct contact details are being confirmed.
              </p>
              <p className="text-muted-foreground mt-2 text-sm italic">
                * Phone and WhatsApp contacts will be available once confirmed
                by our team.
              </p>
            </div>
          </div>
        </div>

        <ContactForm initialMessage={initialMessage} />
      </div>
    </div>
  );
}
