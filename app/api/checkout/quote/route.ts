import { createAdminClient } from "@/lib/server/supabase";
import {
  checkoutRateLimit,
  checkoutResponse,
  checkoutSession,
  readCheckoutRequest,
} from "@/lib/server/checkout";
import { quotePayloadSchema } from "@/lib/validation/checkout";
import { deliveryPolicy, estimateDelivery } from "@/lib/domain/delivery.mjs";
import {
  liveOrderingEnabled,
  checkoutImplementationReady,
} from "@/lib/config/site";

export async function POST(request: Request) {
  if (!liveOrderingEnabled || !checkoutImplementationReady)
    return checkoutResponse(
      { error: "Online ordering is not available yet." },
      503,
    );
  try {
    const input = quotePayloadSchema.safeParse(
      await readCheckoutRequest(request),
    );
    if (!input.success)
      return checkoutResponse(
        {
          error: "Check the delivery address and basket quantities.",
          code: "INVALID_INPUT",
        },
        422,
      );
    const session = (await checkoutSession(request, true))!;
    if (!(await checkoutRateLimit(request, session, "quote")))
      return checkoutResponse(
        { error: "Too many requests. Please wait ten minutes and try again." },
        429,
      );
    const estimate = estimateDelivery(input.data.address.postcode);
    if (estimate.status !== "estimate")
      return checkoutResponse(
        { error: estimate.message, code: "DELIVERY_REVIEW" },
        422,
      );
    const { data, error } = await createAdminClient().rpc(
      "create_checkout_quote",
      {
        session_key: session,
        basket: input.data.items,
        delivery_context: { address: input.data.address, service: "standard" },
        policy: deliveryPolicy.version,
        shipping_pence: estimate.costPence,
      },
    );
    if (error) {
      console.warn("Quote rejected", error.code);
      return checkoutResponse(
        {
          error:
            "A configuration is unavailable or its stock has changed. Update your basket or contact the team.",
          code: "BASKET_CHANGED",
        },
        error.code === "P0001" ? 409 : 503,
      );
    }
    return checkoutResponse({ quote: data });
  } catch (error) {
    const code = error instanceof Error ? error.message : "unknown";
    return checkoutResponse(
      {
        error:
          code === "limit_unavailable"
            ? "Delivery quoting is temporarily unavailable. Try again shortly."
            : "The request could not be accepted. Reload the page and try again.",
      },
      error instanceof SyntaxError ||
        ["origin", "content", "body", "size"].includes(code)
        ? 400
        : 503,
    );
  }
}
