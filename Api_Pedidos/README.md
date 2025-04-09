# 📦 API de Integração Pipedrive → MongoDB → Bling

Esta API busca oportunidades ganhas no Pipedrive, salva os dados no MongoDB e envia os pedidos ao Bling via API V3 (OAuth2). O projeto está estruturado em módulos organizados por responsabilidade.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** – Ambiente de execução JavaScript
- **Express** – Framework web para rotas e estrutura da API
- **MongoDB Atlas** – Banco de dados NoSQL
- **Mongoose** – ODM para comunicação com o MongoDB
- **Axios** – Cliente HTTP para integração com APIs externas
- **dotenv** – Gerencia variáveis de ambiente sensíveis
- **Bling API v3** – Para envio de pedidos e criação de contatos
- **Pipedrive API** – Para obter negócios ganhados
- **Nodemon** (opcional) – Para desenvolvimento com hot reload

---

## 📁 Estrutura de Pastas

```
API_PEDIDOS/
│
├── node_modules/
├── .env
├── package.json
├── package-lock.json
├── runAll.js         // Script principal para rodar todo o fluxo
├── server.js         // Inicializa o servidor Express
├── test.js           // Para testes manuais/localizados
│
├── src/
│   ├── config/
│   │   └── db.js                      // Conexão com MongoDB
│
│   ├── controllers/
│   │   ├── opportunityControllers.js // Controla lógica de oportunidades
│   │   ├── pedidosController.js      // Lógica para exibir pedidos consolidados
│   │   └── sendToBlingController.js  // Envio dos pedidos ao Bling
│
│   ├── models/
│   │   ├── opportunity.js            // Schema das oportunidades
│   │   └── order.js                  // Schema dos pedidos salvos
│
│   ├── routes/
│   │   └── opportunityRoutes.js      // Rotas da API
│
│   └── services/
│       ├── blingAuthService.js      // Autenticação OAuth2 com Bling
│       ├── blingService.js          // Envio de pedidos e criação de contatos
│       ├── pipedriveService.js      // Busca dados do Pipedrive
│       └── saveOrder.js             // Salva dados no MongoDB
```

---

## ⚙️ Instalações Necessárias

1. Navegue até a raiz do projeto.
2. Execute os comandos abaixo para iniciar o projeto e instalar as dependências:

```bash
npm init -y
npm install express axios mongoose dotenv
```

Opcional para desenvolvimento com reload:

```bash
npm install --save-dev nodemon
```

---

## 🔐 Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
PORT=3000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<senha>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority

# Bling OAuth2
BLING_ACCESS_TOKEN=SEU_ACCESS_TOKEN

# Pipedrive
PIPEDRIVE_API_KEY=SUA_API_KEY_DO_PIPEDRIVE
```

---

## 🚀 Como Rodar o Projeto

### Opção 1 – Rodar o fluxo completo (buscar → salvar → enviar ao Bling):

```bash
node runAll.js
```

### Opção 2 – Subir servidor com rotas REST:

```bash
node server.js
# ou
npx nodemon server.js
```

---

## 📡 Rotas Disponíveis

### `GET /api/oportunidades/consolidado`

Retorna os pedidos salvos, agrupados por data:

```json
[
  {
    "date": "2025-04-09",
    "totalValue": 1500,
    "opportunities": ["Pedido 1", "Pedido 2"]
  }
]
```

---

## 🧠 Fluxo de Funcionamento

1. `pipedriveService.js`: Puxa oportunidades ganhas.
2. `blingService.js`: Cria o contato e envia o pedido.
3. `saveOrder.js`: Salva os pedidos no MongoDB, evitando duplicações.
4. `sendToBlingController.js`: Controla o envio de dados para o Bling.
5. `opportunityRoutes.js`: Define a rota da API.
6. `pedidosController.js`: Consolida e retorna os dados por data.

---

## ✅ Verificando os Dados no MongoDB Atlas

1. Acesse: [MongoDB Atlas](https://cloud.mongodb.com)
2. Vá até o seu cluster e clique em **"Browse Collections"**.
3. Selecione a base e veja a collection `orders`.

---

## 🧪 Teste Manual

Você pode testar isoladamente o envio para o Bling com:

```bash
node test.js
```