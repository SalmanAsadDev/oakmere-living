import { notFound } from "next/navigation";
import { getProduct } from "@/lib/domain/catalogue";
import { ProductDetail } from "@/components/storefront/product-detail";
export async function generateMetadata({params}:{params:Promise<{slug:string}>}) { const {slug}=await params;const p=getProduct(slug);return {title:p?.name||"Sofa not found",description:p?.description.slice(0,160),alternates:{canonical:`/products/${slug}`}}; }
export default async function Page({params}:{params:Promise<{slug:string}>}) {const {slug}=await params;const product=getProduct(slug);if(!product)notFound();return <ProductDetail product={product}/>;}
