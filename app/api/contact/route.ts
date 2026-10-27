import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/services";
import { createAdminClient } from "@/lib/server/supabase";
import { serviceRateLimit } from "@/lib/server/checkout";

export async function POST(request: Request) {
  // Reject cross-origin requests.
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });

  if (request.headers.get("content-type")?.split(";")[0] !== "application/json")
    return NextResponse.json({ code: "UNSUPPORTED_MEDIA_TYPE" }, { status: 415 });

  try {
    const body = await request.json();

    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        {
          code: "VALIDATION_ERROR",
          message: "Invalid contact form data",
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 422 },
      );
    }

    if (!(await serviceRateLimit(request, "contact")))
      return NextResponse.json(
        { code: "RATE_LIMITED", message: "Too many requests. Please wait a few minutes before trying again." },
        { status: 429 },
      );

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("contact_requests")
      .insert({
        name: result.data.name,
        email: result.data.email,
        phone: result.data.phone || null,
        order_number: result.data.order || null,
        message: result.data.message,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json(
        { code: "INTERNAL_ERROR", message: "Failed to save contact request." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        code: "SUCCESS",
        message: "Contact request submitted successfully.",
        requestId: data.id,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
