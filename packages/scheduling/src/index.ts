import { z } from "zod";

export type Service = { id: string; name: string; description: string; durationMinutes: number; priceCents: number; active: boolean };
export type Provider = { id: string; name: string; bio: string; serviceIds: string[]; active: boolean };
export type AppointmentStatus = "PENDING_CONFIRMATION" | "CONFIRMED" | "IN_SERVICE" | "COMPLETED" | "NO_SHOW" | "CANCELED";
export type Appointment = {
  token: string; reference: string; serviceId: string; providerId: string; providerName: string;
  start: string; customerName: string; phoneMasked: string; status: AppointmentStatus;
};
export const bookingSchema = z.object({
  serviceId: z.string().min(1), providerId: z.string().min(1), date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/), name: z.string().trim().min(2).max(80),
  phone: z.string().transform(v => v.replace(/\D/g, "")).pipe(z.string().min(10).max(13)),
  email: z.string().email().optional().or(z.literal("")), notes: z.string().trim().max(300).optional(),
  whatsappConsent: z.boolean(), privacyAccepted: z.literal(true), website: z.string().max(0).optional()
});
export type BookingInput = z.infer<typeof bookingSchema>;
export interface SchedulingProvider {
  listServices(): Promise<Service[]>;
  listProviders(serviceId?: string): Promise<Provider[]>;
  getAvailability(input: { serviceId: string; providerId: string; date: string }): Promise<string[]>;
  createAppointment(input: BookingInput): Promise<Appointment>;
  getPublicAppointment(token: string): Promise<Appointment | null>;
  reschedule(token: string, date: string, time: string): Promise<Appointment>;
  cancel(token: string, reason?: string): Promise<Appointment>;
}

const services: Service[] = [
  { id: "demo-service-30", name: "Serviço demonstrativo", description: "Conteúdo de desenvolvimento removível.", durationMinutes: 30, priceCents: 0, active: true },
  { id: "demo-service-60", name: "Serviço combinado demonstrativo", description: "Exemplo sem valor comercial real.", durationMinutes: 60, priceCents: 0, active: true }
];
const providers: Provider[] = [
  { id: "demo-professional-a", name: "Profissional demonstrativo A", bio: "Perfil exclusivo para desenvolvimento.", serviceIds: services.map(s => s.id), active: true },
  { id: "demo-professional-b", name: "Profissional demonstrativo B", bio: "Perfil exclusivo para desenvolvimento.", serviceIds: [services[0].id], active: true }
];
const appointments = new Map<string, Appointment>();
const occupied = new Set<string>();
const maskPhone = (value: string) => `••••••${value.slice(-4)}`;
const token = () => crypto.randomUUID().replaceAll("-", "");

export class MockSchedulingProvider implements SchedulingProvider {
  async listServices() { return services.filter(s => s.active); }
  async listProviders(serviceId?: string) { return providers.filter(p => p.active && (!serviceId || p.serviceIds.includes(serviceId))); }
  async getAvailability({ serviceId, providerId, date }: { serviceId: string; providerId: string; date: string }) {
    const candidates = providerId === "any" ? await this.listProviders(serviceId) : providers.filter(p => p.id === providerId && p.serviceIds.includes(serviceId));
    if (!candidates.length) return [];
    return ["09:00", "09:30", "10:00", "10:30", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00"]
      .filter(time => candidates.some(p => !occupied.has(`${p.id}:${date}:${time}`)));
  }
  async createAppointment(input: BookingInput) {
    const parsed = bookingSchema.parse(input);
    const candidates = parsed.providerId === "any" ? await this.listProviders(parsed.serviceId) : providers.filter(p => p.id === parsed.providerId);
    const provider = candidates.sort((a,b) => a.id.localeCompare(b.id)).find(p => !occupied.has(`${p.id}:${parsed.date}:${parsed.time}`));
    if (!provider) throw new Error("SLOT_CONFLICT");
    const key = `${provider.id}:${parsed.date}:${parsed.time}`;
    occupied.add(key);
    const publicToken = token();
    const appointment: Appointment = {
      token: publicToken, reference: publicToken.slice(0, 8).toUpperCase(), serviceId: parsed.serviceId,
      providerId: provider.id, providerName: provider.name, start: `${parsed.date}T${parsed.time}:00-03:00`,
      customerName: parsed.name, phoneMasked: maskPhone(parsed.phone),
      status: "CONFIRMED"
    };
    appointments.set(publicToken, appointment);
    return appointment;
  }
  async getPublicAppointment(publicToken: string) { return appointments.get(publicToken) ?? null; }
  async reschedule(publicToken: string, date: string, time: string) {
    const current = appointments.get(publicToken); if (!current) throw new Error("NOT_FOUND");
    const nextKey = `${current.providerId}:${date}:${time}`; if (occupied.has(nextKey)) throw new Error("SLOT_CONFLICT");
    occupied.delete(`${current.providerId}:${current.start.slice(0,10)}:${current.start.slice(11,16)}`);
    occupied.add(nextKey); const next = { ...current, start: `${date}T${time}:00-03:00` }; appointments.set(publicToken, next); return next;
  }
  async cancel(publicToken: string) {
    const current = appointments.get(publicToken); if (!current) throw new Error("NOT_FOUND");
    occupied.delete(`${current.providerId}:${current.start.slice(0,10)}:${current.start.slice(11,16)}`);
    const next = { ...current, status: "CANCELED" as const }; appointments.set(publicToken, next); return next;
  }
}

export class EasyAppointmentsProvider implements SchedulingProvider {
  constructor(private baseUrl: string, private authorization: string) {}
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}/index.php/api/v1${path}`, {
      ...init, headers: { "Content-Type": "application/json", Authorization: this.authorization, ...init?.headers }, cache: "no-store"
    });
    if (!response.ok) throw new Error(response.status === 409 ? "SLOT_CONFLICT" : `EASYAPPOINTMENTS_${response.status}`);
    return response.json() as Promise<T>;
  }
  async listServices() { return this.request<Service[]>("/services"); }
  async listProviders(serviceId?: string) { return this.request<Provider[]>(`/providers${serviceId ? `?serviceId=${encodeURIComponent(serviceId)}` : ""}`); }
  async getAvailability(i: {serviceId:string;providerId:string;date:string}) {
    return this.request<string[]>(`/availabilities?serviceId=${encodeURIComponent(i.serviceId)}&providerId=${encodeURIComponent(i.providerId)}&date=${i.date}`);
  }
  async createAppointment(_input: BookingInput): Promise<Appointment> { throw new Error("A criação real exige o mapeamento validado da instalação; consulte docs/EASYAPPOINTMENTS.md."); }
  async getPublicAppointment(_token: string): Promise<Appointment | null> { throw new Error("NOT_IMPLEMENTED"); }
  async reschedule(_token: string, _date: string, _time: string): Promise<Appointment> { throw new Error("NOT_IMPLEMENTED"); }
  async cancel(_token: string, _reason?: string): Promise<Appointment> { throw new Error("NOT_IMPLEMENTED"); }
}
