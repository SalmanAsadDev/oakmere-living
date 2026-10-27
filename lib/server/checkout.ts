import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createAdminClient } from "./supabase";

export const guestCookie = "oakmere_guest";
export const sessionHash = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export function checkoutResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}
export async function readCheckoutRequest(request: Request): Promise<unknown> {
  if (request.headers.get("origin") !== new URL(request.url).origin)
    throw new Error("origin");
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json")
    throw new Error("content");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32768) {
        await reader.cancel();
        throw new Error("size");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export async function checkoutSession(request: Request, create: boolean) {
  const store = await cookies();
  let token = store.get(guestCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    if (!create) return null;
    token = randomBytes(32).toString("hex");
    store.set(guestCookie, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return sessionHash(token);
}
export async function serviceRateLimit(
  request: Request,
  action: "contact" | "swatch",
): Promise<boolean> {
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    : null;
  if (!ip) return true; // dev: no trusted IP header, skip
  const client = createAdminClient();
  const identity = sessionHash(`${process.env.SUPABASE_SERVICE_ROLE_KEY}:${ip}`);
  const { data, error } = await client.rpc("consume_checkout_limit", {
    limit_key: `${action}:${identity}`,
    maximum: 5,
    seconds: 600,
  });
  if (error) return true; // fail open if rate-limit table unavailable
  return data === true;
}
export async function checkoutRateLimit(
  request: Request,
  session: string,
  action: "quote" | "order",
) {
  const client = createAdminClient();
  // Only Vercel's trusted ingress header is used; raw IPs never enter the database.
  const ip = process.env.VERCEL
    ? request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    : null;
  const identity = ip
    ? sessionHash(`${process.env.SUPABASE_SERVICE_ROLE_KEY}:${ip}`)
    : session;
  const { data, error } = await client.rpc("consume_checkout_limit", {
    limit_key: `${action}:${identity}`,
    maximum: action === "quote" ? 30 : 10,
    seconds: 600,
  });
  if (error) throw new Error("limit_unavailable");
  return data === true;
}
