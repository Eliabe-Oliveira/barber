import { NextResponse } from "next/server";
import { getSchedulingProvider } from "@/lib/provider";
export async function GET() {
  const provider = getSchedulingProvider();
  const services = await provider.listServices();
  const professionals = await provider.listProviders();
  return NextResponse.json({ services, professionals }, { headers: { "Cache-Control": "private, no-store" } });
}
