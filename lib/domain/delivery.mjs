// Reference-derived defaults authorised by the owner on 20 October 2026.
// A postcode-format check is not address validation or a guaranteed delivery slot.
export const deliveryPolicy = Object.freeze({
  version: "reference-2026-10-20",
  source: "https://www.cornersofa.online/delivery-info/",
  standardPence: 0,
  standardDispatchDays: [5, 7],
  expressPence: 2999,
  expressDispatchDays: [2, 3],
  removalPence: 4999,
  madeToOrderWeeks: [2, 4],
  confirmationRequired: true,
});
export function normalisePostcode(value) {
  const compact = String(value).toUpperCase().replace(/\s/g, "");
  const valid =
    /^(GIR0AA|[A-PR-UWYZ][A-HK-Y]?\d[\dA-HJKPSTUW]?\d[ABD-HJLNP-UW-Z]{2})$/.test(
      compact,
    );
  return valid ? `${compact.slice(0, -3)} ${compact.slice(-3)}` : null;
}
export function estimateDelivery(value) {
  const postcode = normalisePostcode(value);
  if (!postcode)
    return {
      status: "invalid",
      postcode: null,
      costPence: null,
      message:
        "Enter a UK postcode, for example M1 1AE. This checks its format only.",
    };
  const area = postcode.match(/^[A-Z]+/)[0];
  // These broad areas include islands/remote districts; ask the team rather than
  // inventing postcode-level coverage, surcharges or an unavailable express slot.
  if (
    [
      "BT",
      "IM",
      "JE",
      "GY",
      "HS",
      "ZE",
      "IV",
      "KW",
      "PA",
      "PH",
      "GIR",
    ].includes(area)
  )
    return {
      status: "review",
      postcode,
      costPence: null,
      message:
        "The team needs to confirm coverage, charges and timing for this area. Ask for a delivery estimate before ordering.",
    };
  return {
    status: "estimate",
    postcode,
    costPence: deliveryPolicy.standardPence,
    message:
      "Indicative standard mainland delivery: free. Allow 5–7 working days after dispatch; production or supplier lead time is additional. The team confirms coverage and arrangements for your address.",
  };
}
