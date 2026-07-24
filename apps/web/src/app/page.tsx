import Link from "next/link";
import { businessConfig } from "@agenda/config";
import { getSchedulingProvider } from "@/lib/provider";
export default async function Home() {
  const provider = getSchedulingProvider();
  const [services, professionals] = await Promise.all([provider.listServices(), provider.listProviders()]);
  const schema = businessConfig.address ? {
    "@context": "https://schema.org", "@type": "LocalBusiness", name: businessConfig.name,
    address: businessConfig.address, url: process.env.PUBLIC_BASE_URL || "http://localhost:3000"
  } : null;
  return <main id="conteudo">
    <header className="nav"><Link className="brand" href="/">{businessConfig.name}</Link><Link className="button small" href="/agendar">Agendar</Link></header>
    <section className="hero"><p className="eyebrow">AGENDA ONLINE</p><h1>Seu horário,<br/><em>sem complicação.</em></h1><p className="lead">Escolha o serviço, o profissional e o melhor horário. Confirme em poucos passos, sem criar uma conta.</p><Link className="button" href="/agendar">Agendar horário <span aria-hidden>→</span></Link><p className="micro">Pagamento no estabelecimento · Confirmação segura</p></section>
    <section className="section"><p className="eyebrow">SERVIÇOS</p><div className="section-title"><h2>Escolha o cuidado que procura.</h2><Link href="/agendar">Consultar horários →</Link></div><div className="cards">{services.map((s,i)=><article className="card" key={s.id}><span className="number">0{i+1}</span><h3>{s.name}</h3><p>{s.description}</p><footer><span>{s.durationMinutes} min</span><Link href={`/agendar?servico=${s.id}`} aria-label={`Agendar ${s.name}`}>Agendar →</Link></footer></article>)}</div></section>
    <section className="section warm"><p className="eyebrow">PROFISSIONAIS</p><div className="section-title"><h2>Escolha com quem se sentir à vontade.</h2></div><div className="people">{professionals.map(p=><article key={p.id}><div className="portrait" aria-hidden>{p.name.slice(-1)}</div><h3>{p.name}</h3><p>{p.bio}</p></article>)}</div></section>
    <section className="section steps"><p className="eyebrow">COMO FUNCIONA</p><h2>Três passos. Um horário reservado.</h2><ol><li><b>01</b><span><strong>Escolha</strong> serviço e profissional.</span></li><li><b>02</b><span><strong>Encontre</strong> uma data e horário disponíveis.</span></li><li><b>03</b><span><strong>Confirme</strong> seus dados e receba a referência.</span></li></ol></section>
    <section className="cta"><h2>Pronto para reservar<br/>seu próximo horário?</h2><Link className="button light" href="/agendar">Consultar disponibilidade →</Link></section>
    <footer className="footer"><strong>{businessConfig.name}</strong><nav><Link href="/privacidade">Privacidade</Link>{businessConfig.whatsapp && <a href={`https://wa.me/${businessConfig.whatsapp.replace(/\D/g,"")}`}>WhatsApp</a>}</nav><small>© {new Date().getFullYear()} · Agendamento online</small></footer>
    {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/>}
  </main>;
}
