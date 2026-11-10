import Link from "next/link";
export const metadata = {
  title: "Frequently asked questions",
  description:
    "Help with Oakmere sofas, delivery estimates, payment, fabric samples and measuring your space.",
  alternates: { canonical: "/faqs" },
};
const groups = [
  {
    title: "Delivery & payment",
    items: [
      [
        "Where do you deliver?",
        "Standard mainland delivery is estimated as free. Northern Ireland, the Highlands, islands and locations requiring special arrangements need a team-confirmed quote. Use the delivery checker for an initial indication.",
        "/delivery",
        "Check delivery",
      ],
      [
        "How long will my sofa take?",
        "Standard delivery is estimated at 5–7 working days after dispatch. Production or supplier lead time comes first; made-to-order production may take an indicative 2–4 weeks. The team confirms the timing for your sofa.",
        "/delivery",
        "Understand delivery timing",
      ],
      [
        "Can I pay when it arrives?",
        "Yes. Oakmere’s selected methods are cash and card on delivery. No online card payment, finance or deposit is configured on this website.",
        "/delivery",
        "Delivery and payment",
      ],
      [
        "What about stairs, assembly or removing my old sofa?",
        "Describe your floor, lift and access when speaking with the team. Ask them to confirm which services are available and the final charge before booking.",
        "/contact",
        "Discuss your delivery",
      ],
    ],
  },
  {
    title: "Choosing your sofa",
    items: [
      [
        "How do I identify left and right facing?",
        "Stand facing the sofa from the front. The side of the chaise determines the facing direction. Check the exact configuration and measurements with the team before ordering.",
        "/guides/corner-orientation",
        "See the orientation guide",
      ],
      [
        "Can I see the fabric first?",
        "Choose up to four listed samples on the swatches page. Your request is saved only after a successful submission. The team confirms sample availability and delivery arrangements.",
        "/swatches",
        "Choose samples",
      ],
      [
        "Will my sofa fit through the door?",
        "Check the sofa’s dimensions and every stage of its delivery route. Do not assume it separates into smaller sections. The team needs to confirm section and packaging sizes for your exact product.",
        "/guides/measuring-for-delivery",
        "Measure your space",
      ],
      [
        "Can I visualise it in my room?",
        "The current room studio creates a local photo moodboard. Product photos can retain their backgrounds and the result is not to scale. Always check measurements separately.",
        "/room-planner",
        "Open the room studio",
      ],
    ],
  },
  {
    title: "A little more help",
    items: [
      [
        "How do I ask about a return, damage or warranty?",
        "Contact the team with your product or order reference and a description of the issue. The team will confirm the applicable terms and next steps for your purchase.",
        "/contact",
        "Contact the team",
      ],
      [
        "Can I arrange a consultation?",
        "Send your preferred day, contact method and the sofa you are considering. A consultation request is not a confirmed showroom booking; the team confirms the arrangements.",
        "/appointment",
        "Request a consultation",
      ],
    ],
  },
];
export default function FAQsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((group) =>
      group.items.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    ),
  };

  return (
    <div className="container section max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <p className="eyebrow mb-5 text-muted-foreground">A little reassurance</p>
      <h1 className="display text-4xl sm:text-6xl">Make yourself at home.</h1>
      <p className="mt-6 max-w-xl text-sm leading-7 text-muted-foreground">
        The details that help you choose with confidence. Ask the family team
        whenever your sofa or delivery needs a closer look.
      </p>
      <div className="mt-12 space-y-12">
        {groups.map((group) => (
          <section key={group.title}>
            <h2 className="mb-5 font-serif text-2xl">{group.title}</h2>
            <div className="divide-y border-y">
              {group.items.map(([question, answer, href, label]) => (
                <details key={question} className="py-5">
                  <summary className="cursor-pointer pr-4 text-sm font-medium">
                    {question}
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {answer}
                  </p>
                  <Link
                    href={href}
                    className="mt-3 inline-block text-sm link-underline"
                  >
                    {label} →
                  </Link>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
