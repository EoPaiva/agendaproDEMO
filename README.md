# AgendaPro Beta/Demo

Ambiente beta separado do AgendaPro principal, feito para demonstrar o produto sem misturar dados fictícios com produção.

## O que este beta faz

- Landing do AgendaPro em modo demonstração.
- Agenda pública beta em `#/agendar/clinica-aurora-beta`.
- Página de apresentação em `#/agenda/clinica-aurora-beta`.
- Cadastro e login simulados do cliente.
- Checkout simulado, sem Mercado Pago real.
- Criação e publicação de agenda em modo local.
- Painel privado da agenda com solicitações beta.
- Central Dev funcionando em modo mock/local.
- Keys, pagamentos, logs e ações administrativas simuladas.

## O que este beta NÃO faz

- Não usa Supabase de produção.
- Não usa `SUPABASE_SERVICE_ROLE_KEY`.
- Não usa Mercado Pago real.
- Não exige rodar SQL.
- Não altera dados do projeto principal.

## Como rodar localmente

```bash
npm install
npm run dev
```

Depois abra:

```txt
http://localhost:5173/#/
```

Rotas úteis:

```txt
#/agendar/clinica-aurora-beta
#/agenda/clinica-aurora-beta
#/conta
#/conta/cadastro
#/conta/login
#/dev
```

## Login de teste

Você pode cadastrar qualquer conta. Também existe uma conta beta padrão:

```txt
E-mail: cliente@beta.com
Senha: qualquer senha
```

Central Dev beta:

```txt
E-mail: qualquer e-mail
Senha: qualquer senha
```

## Deploy na Vercel

Este projeto pode ser publicado como um projeto separado, por exemplo:

```txt
AgendaPro-Beta
```

Variáveis recomendadas:

```env
VITE_AGENDAPRO_BETA_MODE=true
VITE_AGENDAPRO_ENABLE_REMOTE_BOOTSTRAP=false
```

Nenhuma variável sensitive é obrigatória para este beta.

## Segurança

Este pacote foi preparado para demonstração. Todas as chamadas `/api/...` feitas pelo frontend são interceptadas por `src/beta/mockApi.ts` e respondidas com dados simulados em `localStorage`.

Se quiser transformar o beta em produção real, use o projeto principal do AgendaPro, não este pacote.
