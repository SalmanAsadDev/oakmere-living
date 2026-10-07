import { permanentRedirect } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  permanentRedirect(`/shop?category=${encodeURIComponent(category)}`);
}
