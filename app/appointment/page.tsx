import Link from "next/link";
import { ArrowRight } from "lucide-react";
export const metadata = {
  title: "Request a consultation",
  description:
    "Ask the Oakmere team for help choosing your sofa, checking the fit or discussing a design.",
  alternates: { canonical: "/appointment" },
};
export default function AppointmentPage() {
  return (
    <div className="container section max-w-4xl">
      <p className="eyebrow mb-5 text-muted-foreground">
        A little time, just for you
      </p>
      <h1 className="display text-5xl sm:text-6xl">
        Let’s talk about your home.
      </h1>
      <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
        Choosing a sofa is easier with someone to talk it through. Tell us what
        you have in mind and ask the family team to arrange a conversation.
      </p>
      <div className="my-10 grid gap-6 sm:grid-cols-3">
        {[
          [
            "01",
            "Share your ideas",
            "Your room, favourite sofa and any questions about the fit.",
          ],
          [
            "02",
            "Suggest a time",
            "Include a preferred day and how you would like us to contact you.",
          ],
          [
            "03",
            "Wait for confirmation",
            "The team will confirm arrangements. This is a request, not a booked slot.",
          ],
        ].map(([n, title, body]) => (
          <div key={n} className="border-t pt-6">
            <p className="font-serif text-2xl text-muted-foreground">{n}</p>
            <h2 className="my-3 font-serif text-xl">{title}</h2>
            <p className="text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>
      <Link
        className="editorial-link inline-flex min-h-12 items-center gap-8 bg-primary px-6 text-sm text-white"
        href="/contact?message=I%20would%20like%20to%20request%20a%20sofa%20consultation.%20My%20preferred%20day%20and%20contact%20method%20are%3A%20"
      >
        Request a consultation <ArrowRight size={16} />
      </Link>
      <p className="mt-5 text-xs text-muted-foreground">
        No showroom appointment is confirmed until the team provides a location
        and time.
      </p>
    </div>
  );
}
