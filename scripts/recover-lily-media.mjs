// Exact product/colour matches observed in the reference UI on 7 October 2026.
// This recovers photographs only; it never creates or changes catalogue variants.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const source = JSON.parse(await readFile('sofa-catalogue-for-codex.json', 'utf8'));
const manifest = JSON.parse(await readFile('lib/data/media-manifest.json', 'utf8'));
const groups = [
  ['Lily 5 Seater Corner 2c2 High Back', 'c106388e-7887-5e1e-af39-643201484bdc', [['Grey','45d1a3d1d702990f12976c1e'],['Black','db2820ed3d152f46954fbfa2'],['Navy Blue','65f68f9bc0e6cfb191dcbc23'],['Beige','f957bd2750bbcb98408233c1']]],
  ['Lily Armed U-Shape High Back', '72c383f2-9f21-5fe4-a2ed-406872325c7f', [['Beige','eef834595e2d01291ef7c34e'],['Cream','1f7ce0fda379b493590c4889']]],
  ['Lily U-Shape High Back', 'd018b8af-feaa-5a16-a242-a744dec9ec56', [['Grey','abf3b97dba09c96bef6790f7'],['Black','b25edf58ece7f3c6e227558c'],['Navy Blue','6f5b92b0a08aa8cabf16798e']]],
  ['Lily Footstool', '93dcc86c-6405-5512-a565-b492aef00a4f', [['Grey','17b99dd49129ba6c82a46c45'],['Navy Blue','74b9be4a9571e449659006d9']]],
  ['Lily 3+2 Seater Scattered Back', '4477808a-749c-55fa-a5d9-5591a1d89141', [['Grey','6c34182af6443acd545bd78d'],['Black','054eabaa3f91dd645a9a224c'],['Navy Blue','841b429760d4cdff8a9534ea'],['Beige','2af5b5a9dcf359d3dd38db1c']]],
  ['Lily 5 Seater Corner 2c2 Scattered Back', '26caace8-4cf6-5751-a3e9-fe4be13016ba', [['Grey','c115124278b4cd497bfd8407'],['Black','e351c6315d41a3bc4170863f'],['Navy Blue','c33fe7fe35e6afcfb483a2cd'],['Beige','a05a9b6ef63ee3d15855f3be']]],
  ['Lily 3+2 Seater High Back', 'afa3b0ef-c089-5f58-a2cc-33256810933e', [['Grey','2a1be3bab9b29e8bf9bd6bf1'],['Black','cc2ba419a77d5d18cba38ac8'],['Navy Blue','c07db0a0e799665523df3bdf'],['Beige','684c197af7bbdfde32157897']]],
];
await mkdir('public/images/catalogue', { recursive: true });
const recovered = [];
for (const [name, refId, colours] of groups) {
  const product = source.products.find(p => p.name === name);
  if (!product) throw new Error(`No exact product match: ${name}`);
  for (const [colour, hash] of colours) {
    const variant = product.variants.find(v => v.colour === colour);
    if (!variant?.image_url) throw new Error(`No exact variant photo match: ${name} / ${colour}`);
    const url = `https://www.cornersofa.online/images/catalogue/${hash}.webp`;
    const local = `/images/catalogue/reference-${hash}.webp`;
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Invalid asset response: ${response.status} ${url}`);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') throw new Error(`Not a WebP: ${url}`);
    await writeFile(`public${local}`, bytes);
    manifest[variant.image_url] = local;
    recovered.push({ productId: product.id, name, colour, originalUrl: variant.image_url, referencePage: `https://www.cornersofa.online/product/${refId}/`, referenceImage: url, local, bytes: bytes.length });
  }
}
await writeFile('lib/data/media-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
await writeFile('docs/research/lily-media-recovery.json', JSON.stringify({ observedAt: '2026-10-07', method: 'Matched exact product name and selected finish in public reference UI', recovered }, null, 2) + '\n');
console.log(`Recovered ${recovered.length} exact colour photographs across ${groups.length} Lily products.`);
