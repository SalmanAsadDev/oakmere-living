import { NextResponse } from "next/server";
import { checkoutPayloadSchema } from "@/lib/validation/checkout";
import { createAdminClient } from "@/lib/server/supabase";
import { cookies } from "next/headers";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = checkoutPayloadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid checkout payload", details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Get or create a session ID for guest tracking
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("guest_session")?.value;
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }

    const supabase = createAdminClient();

    // 1. Calculate Delivery Cost (mock implementation for now)
    // Normally, we'd query delivery_policies or an external API based on data.deliveryAddress
    const deliveryCost = 50.00; // Flat rate for now

    // 2. Validate Cart Items against DB
    // In a real app, query products from DB to ensure prices match
    let subtotal = 0;
    const validatedItems = data.cartItems.map(item => {
      // Trusting client price for prototype, but this should be DB driven
      const lineTotal = item.quantity * item.unitPrice;
      subtotal += lineTotal;
      return {
        ...item,
        total_price: lineTotal
      };
    });

    const totalAmount = subtotal + deliveryCost;

    // 3. Persist Order Transaction
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        session_id: sessionId,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone || null,
        customer_name: data.customerName,
        delivery_address: data.deliveryAddress,
        payment_method: data.paymentMethod,
        subtotal: subtotal,
        delivery_cost: deliveryCost,
        total_amount: totalAmount,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      console.error("Order Insert Error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // Insert Order Items
    const orderItemsToInsert = validatedItems.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.variantId || null,
      product_name: item.productName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.total_price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error("Order Items Insert Error:", itemsError);
      return NextResponse.json({ error: "Failed to add items to order" }, { status: 500 });
    }

    // We can't always set cookies in API routes without a proper response structure in some older Next versions,
    // but in newer App router we can just modify cookieStore directly before returning.
    if (!cookieStore.get("guest_session")) {
        cookieStore.set("guest_session", sessionId, { httpOnly: true, path: "/" });
    }

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
