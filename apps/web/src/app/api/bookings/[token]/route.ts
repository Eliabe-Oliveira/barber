import { NextRequest, NextResponse } from "next/server";
import { getSchedulingProvider } from "@/lib/provider";
type Context = { params: Promise<{ token: string }> };
export async function GET(_: NextRequest, { params }: Context) {
  const item = await getSchedulingProvider().getPublicAppointment((await params).token);
  return item ? NextResponse.json({ appointment: item }) : NextResponse.json({ error: "Agendamento não encontrado." }, { status: 404 });
}
export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const body = await request.json() as { action?: string; date?: string; time?: string; reason?: string };
    const token = (await params).token;
    const appointment = body.action === "cancel"
      ? await getSchedulingProvider().cancel(token, body.reason)
      : await getSchedulingProvider().reschedule(token, String(body.date), String(body.time));
    return NextResponse.json({ appointment });
  } catch { return NextResponse.json({ error: "Não foi possível alterar o agendamento." }, { status: 409 }); }
}
