import { notFound } from "next/navigation";
import { products } from "@/lib/domain/catalogue";
import { CatalogueGrid } from "@/components/storefront/catalogue-grid";
export async function generateMetadata({params}:{params:Promise<{category:string}>}) { const {category}=await params;return {title:category.replaceAll("-"," ")}; }
export default async function Page({params,searchParams}:{params:Promise<{category:string}>;searchParams:Promise<{q?:string;sort?:string}>}) {const {category}=await params;const query=await searchParams;if(!products.some(p=>p.categories.includes(category)))notFound();return <CatalogueGrid category={category} query={typeof query.q==="string"?query.q:""} sort={typeof query.sort==="string"?query.sort:"featured"}/>;}
