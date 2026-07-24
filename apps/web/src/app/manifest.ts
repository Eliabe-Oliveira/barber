import type { MetadataRoute } from "next";
import { businessConfig } from "@agenda/config";
export default function manifest(): MetadataRoute.Manifest {
  return { name: businessConfig.name, short_name: businessConfig.name, description: "Agendamento de serviços", start_url: "/", display: "standalone", background_color: "#f7f1e8", theme_color: "#a45132", lang: "pt-BR", icons: [{src:"/icon.svg",sizes:"any",type:"image/svg+xml",purpose:"any"}] };
}
