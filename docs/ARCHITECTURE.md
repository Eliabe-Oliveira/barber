# Arquitetura
O navegador acessa apenas rotas públicas do BFF Next.js. `SchedulingProvider` isola o motor; `MockSchedulingProvider` viabiliza desenvolvimento e `EasyAppointmentsProvider` mantém autenticação no servidor. Easy!Appointments 1.6.0 + MariaDB são a fonte de verdade. Não há banco paralelo. O token público evita IDs sequenciais. O mock em memória é apenas desenvolvimento e reinicia com o processo.

Fluxo: PWA → BFF validado com Zod → adapter → API REST do Easy!Appointments. Disponibilidade é revalidada antes da criação.
