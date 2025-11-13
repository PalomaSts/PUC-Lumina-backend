# Lumina Backend

## 📌 Visão Geral
O **Lumina Backend** é a API responsável por gerenciar autenticação (OAuth Google + login próprio), projetos, tarefas, logs estruturados, CI/CD e persistência de dados.  
Ele foi desenvolvido em **NestJS**, utiliza **Prisma + PostgreSQL**, suporta **OAuth**, e foi implantado na **Azure Cloud** com pipeline de CI/CD via GitHub Actions.

---

## 🎯 Objetivos do Projeto
- Disponibilizar uma API segura e escalável.
- Atender aos requisitos de backend do trabalho final.
- Fornecer autenticação OAuth e credenciais personalizadas.
- Servir dados para o frontend React.
- Registrar logs como fluxos de eventos (Winston + Application Insights).
- Permitir CRUD completo de Projetos e Tarefas.

---

## 📁 Estrutura do Projeto
```
src/
 ├── auth/                 (OAuth, login próprio, guards, sessões)
 ├── logger/               (configurações do Winston)
 ├── logs/                 (arquivos gerados localmente)
 ├── prisma/
 │    ├── schema.prisma    (modelagem do banco)
 │    └── migrations/      (migrates geradas pelo Prisma)
 ├── projects/             (CRUD de Projetos)
 ├── tasks/                (CRUD de Tarefas)
 └── test-utils/           (mocks de testes)
```

---

## 🚀 Como Executar

### ✔️ Pré‑requisitos
- Node.js 18+
- PostgreSQL
- Yarn ou NPM
- Variáveis de ambiente configuradas

### ✔️ Instalação
```bash
npm install
```

### ✔️ Configurar variáveis de ambiente
Crie um arquivo `.env`:
```env
DATABASE_URL="postgresql://USER:SENHA@HOST:5432/DB"
SESSION_SECRET="algo-seguro"
JWT_KEY="sua_chave"
GOOGLE_CLIENT_ID="xxxx"
GOOGLE_CLIENT_SECRET="xxxx"
GOOGLE_CALLBACK_URL="http://localhost:4000/auth/google/callback"
CLIENT_URL="http://localhost:3000"
```

---

## ▶️ Executar localmente
```bash
npm run start:dev
```

---

## 🧪 Executar Testes

O backend possui testes **unitários** e **de integração** usando Jest.

```bash
npm run test
npm run test:e2e
```

---

## 🌐 Deploy e CI/CD

### ✔️ Estrutura do pipeline
O pipeline faz:
1. **Instalação das dependências**
2. **Build**
3. **Testes**
4. **Upload dos artefatos**
5. **Deploy automático no Azure Web App**

O arquivo do workflow está em:
```
.github/workflows/main_lumina.yml
.github/workflows/ci_lumina.yml
```

### ✔️ Variáveis necessárias no GitHub
- `AZURE_WEBAPP_PUBLISH_PROFILE`
- `DATABASE_URL`
- `SESSION_SECRET`
- `JWT_KEY`
- Google OAuth secrets

---

## 🔐 Credenciais e Autenticação
O backend oferece duas formas:

### 1. OAuth Google
Fluxo completo com callback, sessão e cookie.

### 2. Login próprio
- Cadastro de usuário
- Login com e‑mail e senha
- Alteração de credenciais pelo /profile

---

## 🤝 Contribuição
Para contribuir:

1. Crie uma branch:
```bash
git checkout -b feature/minha-feature
```
2. Faça commit seguindo boas práticas.
3. Abra um Pull Request.

---

## 📜 Licença
MIT License.

---

## 📞 Suporte
Dúvidas? Entre em contato com o autor via e‑mail ou GitHub.
