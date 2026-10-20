import test from "node:test";
import assert from "node:assert/strict";
import {
  normalisePostcode,
  estimateDelivery,
  deliveryPolicy,
} from "../lib/domain/delivery.mjs";
test("postcode formatting accepts common UK formats without claiming an address exists", () => {
  assert.equal(normalisePostcode(" sw1a1aa "), "SW1A 1AA");
  assert.equal(normalisePostcode("M1 1AE"), "M1 1AE");
  assert.equal(estimateDelivery("not a postcode").status, "invalid");
});
test("remote and offshore areas require a quote rather than an invented surcharge", () => {
  for (const code of [
    "BT1 1AA",
    "IV1 1AA",
    "HS1 2AB",
    "IM1 1AA",
    "JE2 3AA",
    "ZE1 0AA",
  ])
    assert.equal(estimateDelivery(code).status, "review", code);
  assert.equal(estimateDelivery("BT1 1AA").costPence, null);
});
test("mainland estimates distinguish dispatch from production and still require confirmation", () => {
  const result = estimateDelivery("M1 1AE");
  assert.equal(result.costPence, 0);
  assert.match(result.message, /after dispatch/);
  assert.match(result.message, /team confirms/i);
  assert.equal(deliveryPolicy.confirmationRequired, true);
});
