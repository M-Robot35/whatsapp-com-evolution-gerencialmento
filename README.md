# CHIP - Integração com WhatsApp API

![Next.js](https://img.shields.io/badge/built%20with-Next.js-blue)  
![Prisma](https://img.shields.io/badge/ORM-Prisma-3982CE)  
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue)  
![MIT License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Visão Geral

**CHIP** é uma plataforma de integração com WhatsApp que permite gerenciar instâncias, enviar mensagens e manipular webhooks com uma interface moderna e poderosa.

---

## 🚀 Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)
- [Redis](https://redis.io/)

---

## 🧠 Funcionalidades Principais

- Criar e conectar instâncias do WhatsApp
- Webhooks configuráveis
- API RESTful com autenticação por API Key
- Integração com banco de dados PostgreSQL
- Suporte a eventos via WebSocket

---

## 📦 Requisitos

Antes de iniciar, certifique-se de ter instalado:

- Node.js (v16+)
- npm ou yarn
- PostgreSQL
- Redis
- Docker (opcional, mas recomendado)

---

## ⚙️ Instalação Local

### 1. Clone o Repositório

```bash
git clone https://github.com/seuusuario/chip.git
cd chip
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as Variáveis de Ambiente

Crie um arquivo `.env` e adicione:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/chip"
NEXTAUTH_SECRET="algumasecretsegura"
apikey="sua-chave"
```

### 4. Execute as Migrações do Prisma

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Rodar com Docker

```bash
docker-compose up -d
```

---

## 📟 Comandos Úteis

### Desenvolvimento

```bash
npm run dev
```

### Build para Produção

```bash
npm run build
```

### Rodar Produção

```bash
npm start
```

### Migrações do Prisma

```bash
npx prisma migrate dev      # para desenvolvimento
npx prisma migrate deploy   # para produção
```