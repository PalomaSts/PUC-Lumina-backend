✅ README — BACKEND (NestJS + Prisma + OAuth + Logs + CI/CD + Azure)
🌟 Lumina — Backend

API do sistema Lumina, responsável por autenticação, cadastro de projetos, tarefas, associação usuário–projetos–tarefas, IA opcional e logs estruturados.
Construída com NestJS, Prisma ORM, PostgreSQL, OAuth Google, Winston, Application Insights, CI/CD e Deploy no Azure.

📘 Índice

Objetivo

Tecnologias

Estrutura de diretórios

Como executar

Variáveis de ambiente

Testes

Credenciais de uso

CI/CD

Logs estruturados

Contribuição

Licença

🎯 1. Objetivo do Backend

O backend fornece:

API REST segura para o frontend

Autenticação e autorização via OAuth Google e registro manual

CRUD de Projetos

CRUD de Tarefas

Associação projeto ↔ tarefas ↔ usuários

Logs estruturados enviados para Application Insights

Testes unitários e de integração

Pipeline CI/CD com build, testes e deploy para Azure

🧰 2. Tecnologias Principais

Node.js + NestJS

Prisma ORM

PostgreSQL (Azure Database for PostgreSQL)

OAuth Google

Winston Logger

Application Insights

GitHub Actions

Azure App Service

📁 3. Estrutura de diretórios
backend/
├── .github/workflows          # CI/CD
├── dist                       # Build compilado
├── logs                       # Logs locais
├── src
│   ├── auth                   # OAuth, session, user lifecycle
│   ├── logger                 # Configuração Winston
│   ├── logs                   # Transporte AppInsights
│   ├── prisma                 # Schema e migrations
│   ├── projects               # CRUD de projetos
│   ├── tasks                  # CRUD de tarefas
│   └── test-utils             # Helpers dos testes
└── test                       # Testes automatizados

⚙️ 4. Como executar o Backend
1. Instalar dependências
npm install

2. Criar arquivo .env

Crie backend/.env:

DATABASE_URL="postgresql://usuario:senha@host:5432/lumina"
SESSION_SECRET="um-segredo-seguro"
JWT_KEY="jwt_key_segura"
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

APPINSIGHTS_CONNECTION_STRING=SEU_CONNECTION_STRING
CLIENT_URL=http://localhost:3000

3. Rodar migrations
npx prisma migrate dev

4. Rodar a aplicação
npm run start:dev


API estará em:

http://localhost:4000

🧪 5. Execução de Testes (Unitários + Integração)

Rodar todos os testes:

npm test


Executar com watch:

npm run test:watch


Cobertura:

npm run test:cov

🔑 6. Credenciais / Autenticação
🔹 Login Google

É necessário registrar uma aplicação no Google Cloud e configurar:

Authorized redirect URI:

http://localhost:4000/auth/google/callback

🔹 Login via e-mail/senha

O backend também fornece:

Registro (POST /auth/register)

Login (POST /auth/login)

Alteração de nome e senha

Sessão persistida em cookie

🛰️ 7. CI/CD — GitHub Actions → Azure App Service

O pipeline:

Roda em cada push na main

Instala dependências

Roda testes

Realiza build

Publica no Azure App Service automáticamente
usando:

azure/webapps-deploy@v3


Workflow em:

.github/workflows/backend-deploy.yml

📊 8. Logs Estruturados (Winston + Application Insights)

O backend envia logs:

Informações da aplicação

Eventos de auditoria

Erros

Logs com contexto (controller/service)

Adiciona:

Logs locais em /logs

Logs no Azure Application Insights via trackTrace, trackException, etc.

🤝 9. Como contribuir

Faça um fork

Crie uma branch:

git checkout -b feature/minha-feature


Faça commits

Abra um Pull Request

📜 10. Licença

Licença MIT — livre para uso, modificação e distribuição.