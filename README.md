# 💪 Gym Tracker

> Aplicação full-stack para gerenciamento de treinos, acompanhamento de desempenho e evolução física.

O **Gym Tracker** é uma aplicação web desenvolvida para centralizar o controle de treinos e acompanhar a evolução do usuário ao longo do tempo.

A aplicação possui **autenticação com JWT**, gerenciamento completo de treinos e exercícios, histórico de sessões, acompanhamento de cargas, peso corporal e um sistema de **conquistas baseado na consistência dos treinos**.

O projeto foi desenvolvido com uma arquitetura simples e organizada, utilizando **PostgreSQL com SQL puro**, sem ORM ou abstrações desnecessárias.

---

## ✨ Funcionalidades

### 🔐 Autenticação

* Cadastro de usuários
* Login com email e senha
* Senhas armazenadas com `bcryptjs`
* Autenticação utilizando JWT
* Rotas protegidas por middleware
* Controle de acesso por usuário

### 🏋️ Treinos

* Criar treinos
* Editar treinos
* Excluir treinos
* Definir nome e cor do treino
* Adicionar exercícios diretamente durante a criação
* Editar exercícios
* Excluir exercícios
* Isolamento dos dados entre usuários

### 📋 Execução e histórico

* Registro de sessões concluídas
* Cálculo do volume de treino
* Histórico das sessões realizadas
* Sistema de rodízio para sugerir o próximo treino

### 📈 Progresso

* Evolução de carga por exercício
* Histórico de peso corporal
* Gráficos de progresso
* Visualização de exercícios já registrados

### 🏆 Conquistas

* Sistema de conquistas desbloqueáveis
* Cálculo de sequência de treinos (*streak*)
* Desbloqueio automático após concluir sessões
* Catálogo de conquistas inicializado automaticamente pelo backend

### 👤 Perfil

* Visualização dos dados do usuário
* Estatísticas de treino
* Visualização das conquistas
* Edição do nome

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia       | Utilização              |
| ---------------- | ----------------------- |
| **React 18**     | Interface               |
| **Vite**         | Build e desenvolvimento |
| **React Router** | Navegação               |
| **Recharts**     | Gráficos                |
| **Lucide**       | Ícones                  |

### Backend

| Tecnologia       | Utilização                 |
| ---------------- | -------------------------- |
| **Node.js**      | Runtime                    |
| **Express**      | API REST                   |
| **PostgreSQL**   | Banco de dados             |
| **pg**           | Comunicação com PostgreSQL |
| **jsonwebtoken** | Autenticação JWT           |
| **bcryptjs**     | Hash de senhas             |

> O backend utiliza **SQL puro através do `pg`**, sem Prisma, Sequelize ou outro ORM.

---

## 🏗️ Arquitetura

O backend segue uma arquitetura em camadas simples:

```text
Routes
   ↓
Controllers
   ↓
Models
   ↓
PostgreSQL
```

A responsabilidade de cada camada é bem definida:

* **Routes** → define endpoints e aplica autenticação
* **Controllers** → recebe requisições, realiza validações básicas e coordena a operação
* **Models** → executa as queries SQL
* **Services** → concentra regras de negócio específicas
* **Middleware** → autenticação e tratamento de erros
* **Utils** → funções auxiliares relacionadas ao JWT e tratamento assíncrono
* **DB** → schema e inicialização do banco

A única regra de negócio mais complexa foi isolada em:

```text
services/
└── conquista.service.js
```

Esse serviço é responsável pelo cálculo de **streaks** e pela verificação/desbloqueio das conquistas.

A arquitetura evita padrões e abstrações que não trazem benefício real para o tamanho da aplicação.

---

## 📁 Estrutura do projeto

```text
gym-tracker/
│
├── backend/
│   └── src/
│       ├── config/
│       │   └── # conexão com PostgreSQL
│       │
│       ├── db/
│       │   ├── schema.sql
│       │   └── initDb.js
│       │
│       ├── middleware/
│       │   ├── auth.js
│       │   └── errorHandler.js
│       │
│       ├── models/
│       │   ├── usuario.model.js
│       │   ├── treino.model.js
│       │   ├── exercicio.model.js
│       │   ├── historico.model.js
│       │   ├── corpo.model.js
│       │   └── conquista.model.js
│       │
│       ├── services/
│       │   └── conquista.service.js
│       │
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── home.controller.js
│       │   ├── treino.controller.js
│       │   ├── exercicio.controller.js
│       │   ├── historico.controller.js
│       │   ├── progresso.controller.js
│       │   └── perfil.controller.js
│       │
│       ├── routes/
│       │   └── # endpoints da API
│       │
│       ├── utils/
│       │   ├── jwt.js
│       │   └── asyncHandler.js
│       │
│       ├── app.js
│       └── server.js
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login
        │   ├── Home
        │   ├── Treinos
        │   ├── TreinoExecucao
        │   ├── Historico
        │   ├── Progresso
        │   └── Perfil
        │
        ├── components/
        │   ├── BottomNav
        │   └── StatCard
        │
        ├── api/
        │   └── api.js
        │
        └── styles/
```

---

# 🔒 Segurança e isolamento de dados

Um dos requisitos importantes do projeto é garantir que **cada usuário tenha acesso somente aos próprios dados**.

As rotas protegidas utilizam:

```http
Authorization: Bearer <token>
```

O middleware de autenticação:

1. Extrai o JWT do header;
2. Valida o token;
3. Identifica o usuário;
4. Disponibiliza o usuário autenticado para as próximas camadas.

Além disso, as operações envolvendo treinos e exercícios verificam a propriedade dos recursos.

Por exemplo:

```text
Usuário A
   │
   ├── Treino A
   └── Exercício A

Usuário B
   │
   ├── Treino B
   └── Exercício B
```

Se o Usuário A tentar acessar ou modificar um recurso pertencente ao Usuário B:

```text
→ 403 Forbidden
```

Isso foi validado através de testes reais contra o PostgreSQL.

---

# 🌐 API

## Autenticação

| Método | Endpoint             | Auth | Descrição              |
| ------ | -------------------- | :--: | ---------------------- |
| `POST` | `/api/auth/register` |   ❌  | Cadastro               |
| `POST` | `/api/auth/login`    |   ❌  | Login e geração do JWT |

## Home

| Método | Endpoint    | Auth | Descrição                   |
| ------ | ----------- | :--: | --------------------------- |
| `GET`  | `/api/home` |   ✅  | Dashboard e treino sugerido |

## Treinos

| Método   | Endpoint           | Auth | Descrição          |
| -------- | ------------------ | :--: | ------------------ |
| `GET`    | `/api/treinos`     |   ✅  | Lista os treinos   |
| `GET`    | `/api/treinos/:id` |   ✅  | Busca um treino    |
| `POST`   | `/api/treinos`     |   ✅  | Cria um treino     |
| `PUT`    | `/api/treinos/:id` |   ✅  | Atualiza um treino |
| `DELETE` | `/api/treinos/:id` |   ✅  | Exclui um treino   |

## Exercícios

| Método   | Endpoint                            | Auth | Descrição          |
| -------- | ----------------------------------- | :--: | ------------------ |
| `POST`   | `/api/treinos/:treinoId/exercicios` |   ✅  | Adiciona exercício |
| `PUT`    | `/api/exercicios/:id`               |   ✅  | Atualiza exercício |
| `DELETE` | `/api/exercicios/:id`               |   ✅  | Exclui exercício   |

## Histórico

| Método | Endpoint         | Auth | Descrição                 |
| ------ | ---------------- | :--: | ------------------------- |
| `GET`  | `/api/historico` |   ✅  | Lista sessões             |
| `POST` | `/api/historico` |   ✅  | Registra sessão concluída |

## Progresso

| Método | Endpoint                          | Auth | Descrição                    |
| ------ | --------------------------------- | :--: | ---------------------------- |
| `GET`  | `/api/progresso/exercicios`       |   ✅  | Lista exercícios registrados |
| `GET`  | `/api/progresso/exercicios/:nome` |   ✅  | Evolução de carga            |
| `GET`  | `/api/progresso/corpo`            |   ✅  | Histórico de peso            |
| `POST` | `/api/progresso/corpo`            |   ✅  | Registra peso                |

## Perfil

| Método | Endpoint      | Auth | Descrição            |
| ------ | ------------- | :--: | -------------------- |
| `GET`  | `/api/perfil` |   ✅  | Dados e estatísticas |
| `PUT`  | `/api/perfil` |   ✅  | Atualiza perfil      |

---

# 🚀 Como executar

## 1. Pré-requisitos

Certifique-se de possuir:

* Node.js
* npm
* PostgreSQL

---

## 2. Criar o banco

No PostgreSQL:

```sql
CREATE DATABASE gym_tracker;
```

As tabelas são criadas automaticamente quando o backend inicia.

O arquivo:

```text
backend/src/db/initDb.js
```

executa o `schema.sql` utilizando `CREATE TABLE IF NOT EXISTS` e também inicializa o catálogo de conquistas.

---

## 3. Configurar o backend

```bash
cd backend
```

Configure as credenciais do PostgreSQL no `.env`.

Depois instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm start
```

A API estará disponível em:

```text
http://localhost:8080
```

---

## 4. Executar o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:5173
```

Caso não exista uma sessão válida, o usuário é direcionado automaticamente para `/login`.

---

# 🧪 Testes realizados

O fluxo principal da aplicação foi testado **de ponta a ponta**, utilizando o backend conectado a um PostgreSQL real.

Foram validados:

* ✅ Cadastro de usuário
* ✅ Login
* ✅ Login com senha incorreta → `401`
* ✅ Acesso sem autenticação → `401`
* ✅ Criação de treino
* ✅ Criação de exercícios aninhados
* ✅ Sugestão do próximo treino em rodízio
* ✅ Conclusão de sessão
* ✅ Cálculo de volume
* ✅ Cálculo de streak
* ✅ Desbloqueio automático de conquistas
* ✅ Evolução de carga por exercício
* ✅ Registro de peso corporal
* ✅ Edição de perfil
* ✅ Exclusão em cascata de treino → exercícios
* ✅ Proteção contra acesso a recursos de outros usuários
* ✅ Tentativa de leitura/edição/exclusão de recursos de outro usuário → `403 Forbidden`

---

# 📌 Principais decisões técnicas

### PostgreSQL sem ORM

O projeto utiliza diretamente o `pg` para executar SQL.

Isso permite maior controle sobre:

* Queries
* Relacionamentos
* Constraints
* Cascades
* Performance das consultas
* Estrutura do banco

Além disso, mantém a arquitetura mais simples para o escopo da aplicação.

### Separação de responsabilidades

A aplicação evita concentrar toda a lógica nos controllers.

```text
Route
  ↓
Controller
  ↓
Model
  ↓
Database
```

Quando existe uma regra de negócio mais complexa, ela é isolada no service correspondente.

### Autorização baseada no usuário

Não basta estar autenticado.

Além de validar o JWT, o backend verifica se o recurso solicitado realmente pertence ao usuário autenticado.

Isso evita que um usuário consiga manipular dados de outro apenas alterando um `id` na URL.

---

# 🎯 Objetivo do projeto

O Gym Tracker foi desenvolvido como um projeto full-stack para praticar e demonstrar conceitos como:

* Desenvolvimento de APIs REST
* Arquitetura em camadas
* Autenticação e autorização
* JWT
* Hash de senhas
* PostgreSQL
* SQL puro
* Relacionamentos entre tabelas
* CRUD
* Regras de negócio
* Integração entre frontend e backend
* Visualização de dados
* Controle de acesso por usuário

---

## 👨‍💻 Desenvolvido por

**Caio Muniz**

Projeto desenvolvido como parte da evolução prática em desenvolvimento **Full-Stack**, com foco em construir uma aplicação completa desde o banco de dados até a interface.

---