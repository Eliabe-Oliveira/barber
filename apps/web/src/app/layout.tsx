import type { Metadata } from "next";
import { businessConfig } from "@agenda/config";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.PUBLIC_BASE_URL || "http://localhost:3000"),
  title: { default: `${businessConfig.name} — Agendamento`, template: `%s | ${businessConfig.name}` },
  description: "Escolha o serviço, o profissional e o melhor horário.",
  manifest: "/manifest.webmanifest", robots: { index: true, follow: true },
  openGraph: { title: `${businessConfig.name} — Agendamento`, description: "Agende seu horário em poucos passos.", locale: "pt_BR", type: "website" }
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="pt-BR"><body><a className="skip" href="#conteudo">Pular para o conteúdo</a>{children}<PwaRegister /></body></html>;
}
