import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Our privacy policy explains how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="container section max-w-3xl">
      <h1 className="display text-4xl mb-4">Privacy Policy</h1>
      <p className="text-muted-foreground mb-8">
        Last updated: 20 October 2026
      </p>

      <div className="prose prose-sm md:prose-base text-muted-foreground max-w-none space-y-6">
        <p>
          At Oakmere Living, we take your privacy seriously. This Privacy Policy
          describes how your personal information is collected, used, and shared
          when you visit or make a purchase from our website.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          1. Personal information we collect
        </h2>
        <p>
          When you visit the Site, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device.
        </p>
        <p>
          Additionally, when you make a purchase or attempt to make a purchase
          through the Site, we collect certain information from you, including
          your name, delivery address, access notes, payment method (note: we do
          not store credit card numbers online as payments are taken on
          delivery), email address, and phone number. We refer to this
          information as "Order Information."
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          2. How we use your personal information
        </h2>
        <p>
          We use the Order Information that we collect generally to fulfill any
          orders placed through the Site (including arranging for delivery and
          providing you with invoices and/or order confirmations).
        </p>
        <p>Additionally, we use this Order Information to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-4">
          <li>Communicate with you regarding your order or delivery;</li>
          <li>
            Protect the ordering service against abuse and repeated requests.
          </li>
        </ul>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          3. Sharing your personal information
        </h2>
        <p>
          We share your Personal Information with third parties to help us use
          your Personal Information, as described above. We use Vercel for
          website hosting and Supabase for database management. We may also
          share your Personal Information to comply with applicable laws and
          regulations, to respond to a subpoena, search warrant or other lawful
          request for information we receive, or to otherwise protect our
          rights.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          Essential browser storage
        </h2>
        <p>
          Your basket is saved in this browser's local storage. Checkout uses an
          essential, HTTP-only session cookie for up to 30 days to associate
          quotes, orders and private confirmations with your browser. The
          database stores a hash of this session identifier. Quotes expire after
          15 minutes. Abuse prevention uses short-lived request counters; on
          Vercel these are associated with a salted hash of the client IP
          address.
        </p>
        <p>
          The current room moodboard processes room photographs locally in your
          browser. Administrator product photographs uploaded for catalogue use
          are publicly accessible product media. Room photographs are not
          uploaded to that public catalogue bucket.
        </p>
        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          4. Data retention
        </h2>
        <p>
          When you place an order through the Site, we will maintain your Order
          Information for our records unless and until you ask us to delete this
          information.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          5. Your rights
        </h2>
        <p>
          If you are a European resident, you have the right to access personal
          information we hold about you and to ask that your personal
          information be corrected, updated, or deleted. If you would like to
          exercise this right, please contact us through the contact information
          below.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          6. Changes
        </h2>
        <p>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
        </p>

        <h2 className="text-2xl font-serif text-primary mt-12 mb-4">
          7. Contact us
        </h2>
        <p>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e-mail or by mail using the details provided on our Contact page.
        </p>
      </div>
    </div>
  );
}
