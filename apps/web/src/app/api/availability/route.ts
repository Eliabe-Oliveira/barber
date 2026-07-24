import { NextRequest, NextResponse } from "next/server";
import { getSchedulingProvider } from "@/lib/provider";
export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const serviceId = p.get("serviceId"), providerId = p.get("providerId"), date = p.get("date");
  if (!serviceId || !providerId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return NextResponse.json({ error: "Parâmetros inválidos." }, { status: 400 });
  const slots = await getSchedulingProvider().getAvailability({ serviceId, providerId, date });
  return NextResponse.json({ slots }, { headers: { "Cache-Control": "no-store" } });
}
