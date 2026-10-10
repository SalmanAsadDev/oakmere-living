import type { Product } from "./catalogue";
export type PlanningProduct = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "categories"
  | "materials"
  | "dimensions"
  | "variants"
> & { image: string };
