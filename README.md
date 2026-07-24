# Agenda local — PWA de agendamentos

Primeira versão de uma PWA mobile-first reutilizável, com preset `BARBERSHOP`. O Easy!Appointments é a fonte de verdade; o Next.js funciona como apresentação e BFF. Dados comerciais ausentes não são inventados.

## Site para validação

**[Abrir a versão pública da Barber](https://barber-validacao.elufurtado.chatgpt.site)**

Esta publicação usa dados demonstrativos e não cria agendamentos reais. Ela serve para o cliente validar identidade, textos, informações comerciais e fluxo.

## Executar

Requisitos: Node.js 20.9+ (recomendado 22), npm 10 e Docker Compose.

```bash
cp .env.example .env
# troque as senhas do banco
npm install
npm run dev
```

Modo local padrão: `SCHEDULING_PROVIDER=mock`. Acesse `http://localhost:3000`. Para a pilha completa:

```bash
docker compose up --build
```

Abra `http://localhost:8080`, conclua o instalador e crie o primeiro administrador. Cadastre serviços, profissionais, relações, jornadas, pausas e indisponibilidades no painel nativo. Crie uma API key e configure `.env`; então selecione `SCHEDULING_PROVIDER=easyappointments`.

> O adapter real já contém catálogo e disponibilidade server-side. A criação/alteração real permanece bloqueada intencionalmente até validar o payload OpenAPI contra a instalação configurada; o mock entrega o fluxo completo sem credenciais.

## Qualidade

```bash
npm run lint
npm run typecheck
npm test
npm run test:e2e
npm run build
docker compose config
```

Seeds demonstrativos: `npm run seed`; limpeza: `npm run seed:clear`. Consulte `docs/` para arquitetura, produção, privacidade, WhatsApp e limitações.
