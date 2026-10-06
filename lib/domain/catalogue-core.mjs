export function toPence(value) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('Invalid price');
  const [pounds, fraction = ''] = String(value).split('.');
  if (!/^\d+$/.test(pounds) || fraction.length > 2) throw new Error('Price needs at most two decimal places');
  return Number(pounds) * 100 + Number(fraction.padEnd(2, '0'));
}

export function auditCatalogue(catalogue) {
  const seen = new Set();
  const duplicates = [];
  const bySource = {};
  for (const product of catalogue.products) {
    const key = `${product.source_site}:${product.source_product_id}`;
    if (seen.has(key)) duplicates.push(key);
    seen.add(key);
    bySource[product.source_site] = (bySource[product.source_site] || 0) + 1;
    if (product.price !== null && product.price !== undefined) toPence(product.price);
  }
  return {
    records: catalogue.products.length,
    bySource,
    ready: catalogue.products.filter(p => p.import_status === 'ready').length,
    draft: catalogue.products.filter(p => p.import_status === 'draft').length,
    missingDimensions: catalogue.products.filter(p => !p.specifications?.Dimensions).length,
    duplicateKeys: duplicates,
    duplicateCandidateGroups: catalogue.duplicate_candidates.length,
  };
}

export function normaliseProduct(source) {
  const colourOptions = (source.variants || []).filter(v => typeof v.price === 'number').map((v, i) => ({
    id: `${source.id}:${v.source_variant_id ?? i}`,
    label: [v.colour, v.material, v.size, v.orientation].filter(Boolean).join(' · ') || 'Standard configuration',
    colour: v.colour || '', hex: /^#[0-9a-f]{6}$/i.test(v.colour_hex || '') ? v.colour_hex : '#a6a299',
    price: toPence(v.price), image: v.image_url || source.images?.[0]?.url || '',
  }));
  // Only a fixed, single configuration can receive an implicit standard variant.
  if (!colourOptions.length && source.price_type === 'fixed' && source.colours?.length <= 1 && typeof source.price === 'number') {
    colourOptions.push({ id: `${source.id}:standard`, label: source.colours?.[0] || 'Standard configuration', colour: source.colours?.[0] || '', hex: '#a6a299', price: toPence(source.price), image: source.images?.[0]?.url || '' });
  }
  return {
    id: source.id, slug: source.slug, name: source.name,
    category: source.primary_category, categories: source.categories || [],
    price: typeof source.price === 'number' ? toPence(source.price) : null,
    priceType: source.price_type, description: source.description || '',
    dimensions: source.specifications?.Dimensions || null,
    materials: source.materials || [], colours: source.colours || [],
    images: [...new Map((source.images || []).map(image => [image.url, { url: image.url, alt: image.alt || source.name }])).values()],
    variants: colourOptions, features: source.features || [],
    status: source.import_status, reviewFlags: source.review_flags || [],
  };
}
