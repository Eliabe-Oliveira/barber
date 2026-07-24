# Easy!Appointments
Versão fixada: **1.6.0**, estável, GPLv3. API v1 via `/index.php/api/v1`, usando Basic Auth ou Bearer; somente o servidor recebe credenciais. A especificação oficial fica em `https://developers.easyappointments.org/api/openapi.yml`.

Webhooks 1.6 oferecem eventos genéricos `Save` e `Delete`, não nomes específicos por ação. Configure no painel a URL `/api/webhooks/easyappointments` e o segredo. O receptor atual valida segredo, JSON, tamanho e idempotência em processo; produção deve substituir o conjunto em memória por Redis/banco mínimo com TTL e fila.

Antes de ativar escrita real, valide `AppointmentPayload`, campos obrigatórios de cliente, mapeamento de status e comportamento do hash na instância instalada. Essa trava evita fabricar e-mail ou assumir contratos antigos.

Atualização: faça backup de banco/volumes, leia notas da versão, teste clone restaurado, atualize a tag fixa, execute migrações e teste agendamento/cancelamento antes da produção.
