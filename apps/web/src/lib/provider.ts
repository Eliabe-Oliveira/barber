import { EasyAppointmentsProvider, MockSchedulingProvider, type SchedulingProvider } from "@agenda/scheduling";

declare global { var schedulingProvider: SchedulingProvider | undefined; }
export function getSchedulingProvider(): SchedulingProvider {
  if (globalThis.schedulingProvider) return globalThis.schedulingProvider;
  if (process.env.SCHEDULING_PROVIDER === "easyappointments") {
    const url = process.env.EASYAPPOINTMENTS_URL;
    const key = process.env.EASYAPPOINTMENTS_API_KEY;
    const user = process.env.EASYAPPOINTMENTS_USERNAME;
    const pass = process.env.EASYAPPOINTMENTS_PASSWORD;
    if (!url || (!key && !(user && pass))) throw new Error("Configuração Easy!Appointments incompleta.");
    globalThis.schedulingProvider = new EasyAppointmentsProvider(url, key ? `Bearer ${key}` : `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`);
  } else globalThis.schedulingProvider = new MockSchedulingProvider();
  return globalThis.schedulingProvider!;
}
