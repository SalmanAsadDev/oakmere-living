import test from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion } from '../lib/domain/sofa-guide.mjs';
const catalogue = [
  { name: 'A Corner', slug: 'a', price: 80000, search: 'A corner-sofas grey' },
  { name: 'B Corner', slug: 'b', price: 100000, search: 'B corner-sofas grey' },
  { name: 'C Corner', slug: 'c', price: null, search: 'C corner-sofas grey' },
];
test('guide recommends only real catalogue matches within budget', () => {
  assert.deepEqual(answerQuestion('Corner sofa under £900', catalogue).links, [{ label: 'A Corner', href: '/products/a' }]);
});
test('order and stock questions never return invented status or stock', () => {
  assert.equal(answerQuestion('Track my order', catalogue).links[0].href, '/my-orders');
  assert.match(answerQuestion('Is A Corner in stock?', catalogue).text, /cannot promise/);
});
test('unknown requests have a team path and do not invent products', () => {
  assert.equal(answerQuestion('purple unicorn sofa', catalogue).links.at(-1).href, '/contact');
  assert.equal(answerQuestion('<script>alert(1)</script>', catalogue).links.at(-1).href, '/contact');
});
