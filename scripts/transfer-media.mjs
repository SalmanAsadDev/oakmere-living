import { readFile, mkdir, writeFile, access } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const source = JSON.parse(await readFile(new URL('../sofa-catalogue-for-codex.json', import.meta.url), 'utf8'));
const output = new URL('../public/images/products/', import.meta.url);
const manifestFile = new URL('../lib/data/media-manifest.json', import.meta.url);
await mkdir(output, { recursive: true });
const manifest = JSON.parse(await readFile(manifestFile, 'utf8'));
const urls = [...new Set(source.products.filter(p => p.import_status === 'ready').flatMap(p => (p.images || []).slice(0, 2).map(i => i.url)))];
const errors = [];
let cursor = 0;
let copied = 0;
async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    try {
      if (manifest[url]) {
        try { await access(new URL(`../public${manifest[url]}`, import.meta.url)); continue; }
        catch { delete manifest[url]; }
      }
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' || !['res.cloudinary.com', 'furnishingshub.co.uk'].includes(parsed.hostname)) throw new Error('Host not allowlisted');
      const response = await fetch(url, { signal: AbortSignal.timeout(20000), redirect: 'error' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const mime = response.headers.get('content-type')?.split(';')[0];
      const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[mime];
      if (!extension) throw new Error('Unsupported MIME');
      const reader = response.body.getReader();
      const chunks = []; let size = 0;
      while (true) { const { done, value } = await reader.read(); if (done) break; size += value.length; if (size > 8 * 1024 * 1024) { await reader.cancel(); throw new Error('Image exceeds 8MB'); } chunks.push(value); }
      const bytes = Buffer.concat(chunks);
      const isImage = bytes.subarray(0, 3).equals(Buffer.from([255,216,255])) || bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) || (bytes.toString('ascii',0,4)==='RIFF' && bytes.toString('ascii',8,12)==='WEBP');
      if (!isImage) throw new Error('Invalid image signature');
      const filename = `${createHash('sha256').update(bytes).digest('hex').slice(0,24)}.${extension}`;
      await writeFile(new URL(filename, output), bytes);
      manifest[url] = `/images/products/${filename}`; copied++;
    } catch (error) { errors.push({ url, error: error.message }); }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
await mkdir(new URL('../docs/research/', import.meta.url), { recursive: true });
await writeFile(new URL('../docs/research/media-transfer.json', import.meta.url), JSON.stringify({ attempted: urls.length, copied, available: Object.keys(manifest).length, errors }, null, 2) + '\n');
console.log(JSON.stringify({ attempted: urls.length, copied, available: Object.keys(manifest).length, failed: errors.length }));
