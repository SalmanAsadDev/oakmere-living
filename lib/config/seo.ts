export const shopCategorySeo = {
  "corner-sofas": {
    label: "Corner sofas",
    title: "Corner Sofas & L-Shaped Sofas UK",
    heading: "Corner sofas made for gathering.",
    description:
      "Explore corner sofas and L-shaped designs for UK homes, with family-sized layouts, fabric choices and cash or card payment on delivery.",
  },
  "u-shaped-sofas": {
    label: "U-shaped sofas",
    title: "U-Shaped Sofas for Family Living",
    heading: "U-shaped sofas with room for everyone.",
    description:
      "Browse generous U-shaped sofas for larger living rooms and open-plan spaces. Compare dimensions, materials and available configurations.",
  },
  "3-2-seater-sofa-sets": {
    label: "3 and 2 seater sofa sets",
    title: "3 & 2 Seater Sofa Sets UK",
    heading: "Sofa sets that belong together.",
    description:
      "Shop matching 3 and 2 seater sofa sets for coordinated UK living rooms. Compare colours, fabrics, dimensions and delivery details.",
  },
  "sofa-sets": {
    label: "Sofa sets",
    title: "Sofa Sets for UK Living Rooms",
    heading: "Sofa sets for a room that comes together.",
    description:
      "Explore coordinated sofa sets in practical sizes and materials, with clear product details and pay-on-delivery options.",
  },
  "sofa-beds": {
    label: "Sofa beds",
    title: "Sofa Beds for Flexible Guest Space",
    heading: "Sofa beds that make space work harder.",
    description:
      "Browse sofa beds for everyday seating and flexible guest space. Compare sizes, upholstery and product details before ordering.",
  },
  "recliner-sofas": {
    label: "Recliner sofas",
    title: "Recliner Sofas UK | Manual & Electric",
    heading: "Recliner sofas made for switching off.",
    description:
      "Explore manual and electric recliner sofas for UK homes, from compact seats to family-sized corner configurations.",
  },
  "electric-recliners": {
    label: "Electric recliners",
    title: "Electric Recliner Sofas UK",
    heading: "Electric recliners for effortless comfort.",
    description:
      "Shop electric recliner sofas and corner configurations. Compare seating layouts, materials, dimensions and available finishes.",
  },
  "fabric-sofas": {
    label: "Fabric sofas",
    title: "Fabric Sofas UK | Corner, 2 & 3 Seater",
    heading: "Fabric sofas with a softer point of view.",
    description:
      "Browse fabric sofas in corner, 2 seater, 3 seater and set configurations, with colours and textures for everyday UK homes.",
  },
  "leather-sofas": {
    label: "Leather sofas",
    title: "Leather Sofas UK | Corner & Recliner Styles",
    heading: "Leather sofas with lasting presence.",
    description:
      "Explore leather sofas, corner layouts and recliner styles. Compare dimensions, colours and available configurations before ordering.",
  },
  "2-seater-sofas": {
    label: "2 seater sofas",
    title: "2 Seater Sofas for Smaller UK Spaces",
    heading: "Two seater sofas for considered spaces.",
    description:
      "Browse compact 2 seater sofas for flats, snug rooms and flexible seating, with clear measurements and material choices.",
  },
  "3-seater-sofas": {
    label: "3 seater sofas",
    title: "3 Seater Sofas UK",
    heading: "Three seater sofas for everyday living.",
    description:
      "Explore 3 seater sofas in fabric and leather finishes, with practical dimensions, available colours and pay-on-delivery options.",
  },
  armchairs: {
    label: "Armchairs",
    title: "Armchairs & Accent Chairs UK",
    heading: "Armchairs for a place of your own.",
    description:
      "Browse comfortable armchairs and accent seating for UK living rooms, bedrooms and reading corners.",
  },
  footstools: {
    label: "Footstools",
    title: "Footstools & Coordinating Sofa Stools",
    heading: "Footstools that complete the room.",
    description:
      "Explore coordinating footstools for extra comfort, flexible seating and practical living-room layouts.",
  },
} as const;

export type ShopCategorySlug = keyof typeof shopCategorySeo;

export function getShopCategorySeo(value?: string) {
  if (!value || !(value in shopCategorySeo)) return null;
  return shopCategorySeo[value as ShopCategorySlug];
}
