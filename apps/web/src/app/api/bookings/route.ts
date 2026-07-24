import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@agenda/scheduling";
import { getSchedulingProvider } from "@/lib/provider";
export async function POST(request: NextRequest) {
  try {
    const parsed = bookingSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Confira os dados informados.", fields: parsed.error.flatten().fieldErrors }, { status: 400 });
    const available = await getSchedulingProvider().getAvailability(parsed.data);
    if (!available.includes(parsed.data.time)) return NextResponse.json({ error: "Esse horário acabou de ser reservado. Escolha uma das novas opções disponíveis." }, { status: 409 });
    const appointment = await getSchedulingProvider().createAppointment(parsed.data);
    return NextResponse.json({ appointment }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const conflict = error instanceof Error && error.message === "SLOT_CONFLICT";
    return NextResponse.json({ error: conflict ? "Esse horário acabou de ser reservado. Escolha uma das novas opções disponíveis." : "Não foi possível concluir agora." }, { status: conflict ? 409 : 500 });
  }
}
