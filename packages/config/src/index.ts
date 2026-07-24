export const businessConfig = {
  preset: "BARBERSHOP",
  name: process.env.BUSINESS_NAME?.trim() || "Agenda local",
  configuredName: Boolean(process.env.BUSINESS_NAME?.trim()),
  address: process.env.BUSINESS_ADDRESS?.trim() || null,
  whatsapp: process.env.BUSINESS_WHATSAPP?.trim() || null,
  locale: "pt-BR",
  timezone: "America/Sao_Paulo",
  currency: "BRL",
  theme: { ink: "#242321", paper: "#f7f1e8", accent: "#a45132" },
  rules: {
    minimumNoticeMinutes: 30,
    maximumFutureDays: 60,
    cancellationNoticeHours: 2,
    rescheduleNoticeHours: 2,
    allowAnyProvider: true,
    requireEmail: false,
    automaticConfirmation: true,
    showPrice: true
  },
  paymentMethods: ["Pagamento no estabelecimento"],
  policies: {
    cancellation: "Cancelamentos e alterações estão sujeitos ao prazo configurado.",
    privacy: "Modelo informativo sujeito a revisão jurídica profissional."
  }
} as const;
