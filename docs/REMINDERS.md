# Lembretes
Desativados até haver provider oficial e persistência de outbox. Desenho de produção: worker a cada minuto, chaves idempotentes `appointment:event:scheduledAt`, janelas configuráveis de 24h/2h, até 5 tentativas com backoff, cancelados ignorados, retenção de metadados por 90 dias e telefone mascarado em logs.
