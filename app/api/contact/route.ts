import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation/services";
import { createAdminClient } from "@/lib/server/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "Invalid contact form data", fieldErrors: result.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    
    // In a real scenario we might rate limit here using a database table or Redis

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
        { status: 500 }
      );
    }

    return NextResponse.json(
      { code: "SUCCESS", message: "Contact request submitted successfully.", requestId: data.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
