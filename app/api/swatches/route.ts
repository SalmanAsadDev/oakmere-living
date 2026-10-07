import { NextResponse } from "next/server";
import { swatchSchema } from "@/lib/validation/services";
import { createAdminClient } from "@/lib/server/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = swatchSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { code: "VALIDATION_ERROR", message: "Invalid swatch request data", fieldErrors: result.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from("swatch_requests")
      .insert({
        name: result.data.name,
        email: result.data.email,
        address: result.data.address,
        notes: result.data.notes || null,
      })
      .select("id")
      .single();
      
    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json(
        { code: "INTERNAL_ERROR", message: "Failed to save swatch request." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { code: "SUCCESS", message: "Swatch request submitted successfully.", requestId: data.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Swatches API error:", err);
    return NextResponse.json(
      { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
