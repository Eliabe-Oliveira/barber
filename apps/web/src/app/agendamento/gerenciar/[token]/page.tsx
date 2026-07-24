import Link from "next/link"; import { businessConfig } from "@agenda/config"; import { ManageBooking } from "@/components/manage-booking";
export const metadata={title:"Gerenciar agendamento",robots:{index:false,follow:false}};
export default async function Page({params}:{params:Promise<{token:string}>}){return <main id="conteudo"><header className="nav"><Link className="brand" href="/">{businessConfig.name}</Link></header><ManageBooking token={(await params).token}/></main>}
