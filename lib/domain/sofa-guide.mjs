const link = (label, href) => ({ label, href });
export function answerQuestion(input, catalogue = []) {
  const query = input.trim().toLowerCase().slice(0, 240);
  if (/order|tracking|refund|cancel/.test(query))
    return {
      text: "For an existing order, the Oakmere team needs to check the details privately. This guide cannot access orders or arrange refunds.",
      links: [link("Get order help", "/my-orders")],
    };
  if (/pay|cash|card|deposit|finance/.test(query))
    return {
      text: "Oakmere's payment options are cash or card on delivery. The team must confirm availability and delivery details. This guide cannot accept payments or offer finance.",
      links: [
        link("Delivery & payment", "/delivery"),
        link("Ask the team", "/contact"),
      ],
    };
  if (/deliver|postcode|shipping|stock|arrive|available/.test(query))
    return {
      text: "Delivery coverage, charges and timing need confirmation for your address and chosen sofa. I cannot promise a delivery date or live stock availability.",
      links: [
        link("Delivery information", "/delivery"),
        link(
          "Check with the team",
          "/contact?message=Please%20help%20me%20check%20delivery%20availability%20for%20my%20chosen%20sofa.",
        ),
      ],
    };
  if (/swatch|sample|feel/.test(query))
    return {
      text: "A fabric sample helps you compare texture and colour in your own lighting. Request swatches and tell the team which sofa interests you.",
      links: [link("Explore swatches", "/swatches")],
    };
  if (/measure|fit|door|dimension|left|right|orientation/.test(query))
    return {
      text: "Check the sofa measurements, room layout and the entire delivery route. Corner orientation must match the selected configuration. A photo moodboard cannot confirm physical fit.",
      links: [
        link("Measuring guide", "/guides/measuring-for-delivery"),
        link("Corner orientation", "/guides/corner-orientation"),
        link("Room planner", "/room-planner"),
      ],
    };
  if (/room|photo|visual/.test(query))
    return {
      text: "Try the room planner to arrange a catalogue photograph over your own room photo. It stays on your device and you can save the moodboard.",
      links: [link("Plan your room", "/room-planner")],
    };
  if (/custom|build|piping|bespoke/.test(query))
    return {
      text: "The sofa builder uses listed designs and configurations. Custom finishes or extras become a request for quotation, so no unconfirmed price is added to your basket.",
      links: [link("Build your sofa", "/build")],
    };
  const limitMatch = query.match(
    /(?:under|below|budget|up to)\s*£?\s*(\d[\d,]*)/,
  );
  const limit = limitMatch
    ? Number(limitMatch[1].replaceAll(",", "")) * 100
    : Infinity;
  const tokens = query
    .replace(/[^a-z0-9 -]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 &&
        ![
          "can",
          "you",
          "show",
          "find",
          "need",
          "want",
          "sofa",
          "sofas",
          "the",
          "for",
          "with",
          "under",
          "below",
          "budget",
          "please",
          "recommend",
          "help",
          "choose",
        ].includes(word) &&
        !/^\d+$/.test(word),
    );
  if (!tokens.length && !limitMatch && !/sofa/.test(query))
    return {
      text: "I can help you browse sofas, compare listed prices, use the room planner or find delivery and fabric guidance. For anything specific to your order or a custom request, please speak to the team.",
      links: [
        link("Ask Oakmere", "/contact"),
        link("Browse the collection", "/shop"),
      ],
    };
  const matches = catalogue
    .filter(
      (p) =>
        p.price !== null &&
        p.price <= limit &&
        tokens.every((t) => p.search.toLowerCase().includes(t)),
    )
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
  return matches.length
    ? {
        text: "These are matches from the listed catalogue, ordered by starting price. Open a sofa to check its exact configuration, photographs and price; availability needs confirmation.",
        links: matches.map((p) => link(p.name, `/products/${p.slug}`)),
      }
    : {
        text: "I could not find a listed match for that request. Try a model name, ‘corner sofa’ or ‘under £900’, or ask the team for help.",
        links: [
          link("Explore all sofas", "/shop"),
          link("Ask the team", "/contact"),
        ],
      };
}
