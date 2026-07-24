import Link from "next/link"; import { businessConfig } from "@agenda/config"; import { BookingFlow } from "@/components/booking-flow";
export const metadata={title:"Agendar",robots:{index:false,follow:false}};
export default function Page(){return <main id="conteudo"><header className="nav"><Link className="brand" href="/">{businessConfig.name}</Link><Link href="/">Fechar ×</Link></header><BookingFlow/></main>}
