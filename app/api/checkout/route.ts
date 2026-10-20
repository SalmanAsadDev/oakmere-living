import { createAdminClient } from "@/lib/server/supabase";
import {
  checkoutRateLimit,
  checkoutResponse,
  checkoutSession,
  readCheckoutRequest,
} from "@/lib/server/checkout";
import { checkoutPayloadSchema } from "@/lib/validation/checkout";
import { revalidateTag } from "next/cache";
import {
  liveOrderingEnabled,
  checkoutImplementationReady,
} from "@/lib/config/site";

export async function POST(request: Request) {
  if (!liveOrderingEnabled || !checkoutImplementationReady)
    return checkoutResponse(
      {
        error: "Online ordering is not available yet. Please contact the team.",
      },
      503,
    );
  try {
    const input = checkoutPayloadSchema.safeParse(
      await readCheckoutRequest(request),
    );
    if (!input.success)
      return checkoutResponse(
        {
          error: "Check your contact details and accept the order terms.",
          code: "INVALID_INPUT",
        },
        422,
      );
    const session = await checkoutSession(request, false);
    if (!session)
      return checkoutResponse(
        {
          error: "Your session has expired. Request a fresh delivery quote.",
          code: "SESSION_EXPIRED",
        },
        409,
      );
    if (!(await checkoutRateLimit(request, session, "order")))
      return checkoutResponse(
        { error: "Too many requests. Wait ten minutes before retrying." },
        429,
      );
    const { data, error } = await createAdminClient().rpc(
      "submit_checkout_order",
      {
        session_key: session,
        quote_key: input.data.quoteId,
        idem: input.data.idempotencyKey,
        contact: input.data.contact,
        payment: input.data.paymentMethod,
        terms: input.data.termsVersion,
      },
    );
    if (error) {
      console.warn("Order rejected", error.code);
      return checkoutResponse(
        {
          error:
            "The quote expired or availability changed. Review a fresh quote before ordering.",
          code: "QUOTE_CHANGED",
        },
        error.code === "P0001" ? 409 : 503,
      );
    }
    revalidateTag("catalogue", { expire: 0 });
    return checkoutResponse({ success: true, orderId: data });
  } catch (error) {
    return checkoutResponse(
      {
        error:
          "We could not confirm the order. Retry with the same details; repeated attempts will not create duplicate orders.",
      },
      error instanceof SyntaxError ||
        (error instanceof Error &&
          ["origin", "content", "body", "size"].includes(error.message))
        ? 400
        : 503,
    );
  }
}
