import { NextRequest, NextResponse } from "next/server";
const seen = new Set<string>();
export async function POST(request: NextRequest) {
  const secret = process.env.EASYAPPOINTMENTS_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-webhook-secret") !== secret) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  const raw = await request.text();
  if (raw.length > 100_000) return NextResponse.json({ error: "Payload excedido." }, { status: 413 });
  let body: unknown; try { body = JSON.parse(raw); } catch { return NextResponse.json({ error: "JSON inválido." }, { status: 400 }); }
  const headerId = request.headers.get("x-webhook-id");
  const id: string = headerId ?? await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw)).then(b => Buffer.from(b).toString("hex"));
  if (seen.has(id)) return NextResponse.json({ accepted: true, duplicate: true });
  seen.add(id);
  return NextResponse.json({ accepted: true, eventReceived: typeof body === "object" });
}
