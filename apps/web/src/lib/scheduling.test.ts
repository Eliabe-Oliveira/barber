import { beforeEach,describe,expect,it } from "vitest";
import { MockSchedulingProvider } from "@agenda/scheduling";
const input={serviceId:"demo-service-30",providerId:"demo-professional-a",date:"2030-01-10",time:"09:00",name:"Pessoa de teste",phone:"11999999999",email:"",notes:"",whatsappConsent:true,privacyAccepted:true as const,website:""};
describe("MockSchedulingProvider",()=>{let provider:MockSchedulingProvider;beforeEach(()=>provider=new MockSchedulingProvider());
it("lista serviços e filtra profissionais habilitados",async()=>{expect(await provider.listServices()).toHaveLength(2);expect(await provider.listProviders("demo-service-60")).toHaveLength(1)});
it("cria, consulta por token e cancela",async()=>{const a=await provider.createAppointment(input);expect((await provider.getPublicAppointment(a.token))?.reference).toBe(a.reference);expect((await provider.cancel(a.token)).status).toBe("CANCELED")});
it("impede conflito concorrente",async()=>{await provider.createAppointment(input);await expect(provider.createAppointment(input)).rejects.toThrow("SLOT_CONFLICT")});
it("atribui qualquer profissional habilitado",async()=>{const a=await provider.createAppointment({...input,providerId:"any"});expect(a.providerId).toMatch(/^demo-professional-/)});
});
