export type GuideProduct = {
  name: string;
  slug: string;
  price: number | null;
  search: string;
};
export type GuideReply = {
  text: string;
  links: { label: string; href: string }[];
};
export function answerQuestion(
  input: string,
  catalogue?: GuideProduct[],
): GuideReply;
