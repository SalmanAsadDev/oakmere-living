import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { auditCatalogue, normaliseProduct, toPence } from '../lib/domain/catalogue-core.mjs';
const data = JSON.parse(readFileSync(new URL('../sofa-catalogue-for-codex.json', import.meta.url), 'utf8'));
test('catalogue identities and source counts reconcile', () => {
  const report = auditCatalogue(data);
  assert.equal(report.records, 108);
  assert.equal(report.ready, 73);
  assert.equal(report.draft, 35);
  assert.deepEqual(report.duplicateKeys, []);
  assert.deepEqual(Object.values(report.bySource).sort(), [44, 64]);
});
test('decimal prices become exact pence and invalid precision fails', () => {
  assert.equal(toPence(799.99), 79999);
  assert.equal(toPence(0.1), 10);
  for (const invalid of [-1, NaN, Infinity, 1.999]) assert.throws(() => toPence(invalid));
});
test('gallery colours do not invent purchasable variants', () => {
  const source = data.products.find(p => p.id === 'furnishingshub:2274');
  assert.equal(normaliseProduct(source).variants.length, 0);
  assert.equal(normaliseProduct(source).status, 'draft');
});
test('from prices never become an implicit standard configuration', () => {
  const result = normaliseProduct({ id: 'test', price: 100, price_type: 'from', colours: [], variants: [] });
  assert.equal(result.variants.length, 0);
});
