# CHIP - Integração com WhatsApp API

## Visão Geral
CHIP é uma plataforma de integração com WhatsApp que permite gerenciar instâncias do WhatsApp, enviar mensagens e manipular webhooks através de uma interface web moderna.

## Começando

### Pré-requisitos
- Node.js (v16 ou superior)
- npm ou yarn
- Banco de dados PostgreSQL

### Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
```bash
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/chip"
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm run dev
# ou
yarn dev
```

O servidor iniciará na porta 3000 por padrão: `http://localhost:3000`

## Rotas da API

### Webhooks

#### Atualização de Conexão
```typescript
POST /webhook/connection
```
Recebe atualizações de status de conexão do WhatsApp.

**Payload:**
```json
{
    "event": "connection.update",
    "instance": "nome-instancia",
    "data": {
        "instance": "nome-instancia",
        "state": "connecting|open|close|reconnecting",
        "statusReason": 0
    },
    "destination": "string",
    "date_time": "string",
    "server_url": "string",
    "apikey": "string"
}
```

### Gerenciamento de Instâncias

#### Listar Todas as Instâncias
```typescript
GET /instance/fetchInstances
```
Retorna todas as instâncias do usuário autenticado.

#### Conectar Instância
```typescript
GET /instance/connect/{instanceName}?number={numeroTelefone}
```
Inicia a conexão de uma instância do WhatsApp.

#### Verificar Status da Conexão
```typescript
GET /instance/connectionState/{instance}
```
Verifica o status atual de uma instância.

#### Deletar Instância
```typescript
DELETE /instance/delete/{instance}
```
Remove uma instância do WhatsApp.

#### Reiniciar Instância
```typescript
POST /instance/restart/{instance}
```
Reinicia uma instância do WhatsApp.

## Eventos do Sistema

O sistema emite os seguintes eventos:

- `INSTANCIA_CRIAR`: Quando uma nova instância é criada
- `INSTANCIA_CONNECT`: Quando uma instância se conecta
- `INSTANCIA_STATUS_CONNECTION`: Quando o status da conexão muda
- `INSTANCIA_DELETE`: Quando uma instância é deletada
- `WEBHOOK_UPDATE`: Quando a configuração do webhook é atualizada
- `SETTINGS_UPDATE`: Quando as configurações são atualizadas

## Tratamento de Erros

Todas as rotas retornam respostas padronizadas:
```typescript
{
    success: boolean;
    message: string;
    data?: any;
}
```

## Autenticação

Todas as requisições à API requerem um header `apikey` para autenticação.

## Estrutura do Projeto

```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start

# Migrações do Prisma
npx prisma migrate dev    # Desenvolvimento
npx prisma migrate deploy # Produção
```

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.