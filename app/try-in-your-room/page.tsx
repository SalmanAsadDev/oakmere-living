import { permanentRedirect } from "next/navigation";
export default async function TryInYourRoomPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  permanentRedirect(`/room-planner${product ? `?product=${encodeURIComponent(product)}` : ""}`);
}
