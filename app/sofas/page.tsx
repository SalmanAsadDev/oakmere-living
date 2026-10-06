import { CatalogueGrid } from "@/components/storefront/catalogue-grid";
export const metadata={title:"Shop sofas",description:"Explore corner sofas, sofa sets and recliners at Oakmere Living."};
export default async function Page({searchParams}:{searchParams:Promise<{q?:string;sort?:string}>}) {const params=await searchParams;return <CatalogueGrid query={typeof params.q==="string"?params.q:""} sort={typeof params.sort==="string"?params.sort:"featured"}/>;}
