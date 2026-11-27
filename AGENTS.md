# AGENTS.md — Nexo

## Produto e escopo

- O Nexo é o CRM que estamos adaptando às nossas necessidades a partir do Twenty. Trabalhe na aplicação real e preserve os fluxos já em uso.
- A base atual inclui formulários condicionais de criação de registros e a identidade Nexo, com nome, logo e favicon próprios. Implemente as próximas funcionalidades conforme os requisitos que o usuário definir.
- O Playground de REST/GraphQL serve para experimentar chamadas à API. Para implementar e validar mudanças no CRM, use os módulos da aplicação e abra a rota correspondente na instância local do Nexo.
- Mantenha tanto o Playground do produto quanto qualquer ambiente Docker anterior chamado Playground fora do escopo. Só mexa neles quando o usuário pedir especificamente.

## Onde trabalhar

- O monorepo usa Yarn 4 e Nx. A interface React fica em `packages/twenty-front`, a biblioteca visual em `packages/twenty-ui`, o servidor NestJS em `packages/twenty-server` e o código compartilhado em `packages/twenty-shared`.
- Os formulários de criação ficam em `packages/twenty-front/src/modules/object-record/record-form` e nas páginas de criação e configuração do painel lateral. Os arquivos da marca ficam em `packages/twenty-front/public/images/branding`.
- Siga as convenções e os comandos de [CLAUDE.md](CLAUDE.md). Para mudanças na interface, consulte também [DESIGN.md](DESIGN.md) e reaproveite os componentes existentes.

## Ambiente local e validação

- A prévia do Nexo usa `http://localhost:3001`. No Docker, trabalhe no projeto Compose `nexo-local`, com PostgreSQL, Redis e volumes próprios. Confira se a imagem da interface foi compilada a partir da branch de trabalho antes de validar.
- Para desenvolvimento a partir do código, siga o preparo local em [CLAUDE.md](CLAUDE.md) e use `yarn start`. Confira o banco de destino antes de rodar testes ou comandos de banco.
- Antes de verificar pacotes dependentes, rode `npx nx build twenty-shared --skip-nx-cache`. Para a interface, use `npx nx build twenty-front`, `npx nx lint twenty-front` e, em `packages/twenty-front`, `npx tsgo -p tsconfig.json --noEmit`.
- Rode os testes focados com Jest conforme o pacote. Para mudanças visíveis, confira a rota real no navegador em largura estreita e larga e exercite o fluxo afetado.
- Mudanças efetivas em autenticação, permissões, cobrança, migrações, segredos ou webhooks públicos seguem os gatilhos de revisão independente das instruções globais. Confira os módulos correspondentes em `packages/twenty-server/src/engine` e as migrações em `packages/twenty-server/src/database`.

## Git e automações

- `origin` é `danilo-humberto/nexo`. A branch desta etapa é `codex/nexo-development`. Preserve a `main` e faça commit, push, PR ou merge só com autorização explícita.
- As seis automações do Crowdin e os workflows `CD deploy main`, `CD deploy tag`, `CD Storybook UI` e `Publish npm packages` foram desativados nas configurações do Nexo. O `CI Main` segue ativo. Qualquer alteração nesse estado depende de pedido explícito.
