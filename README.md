# 🐾 PetGuard

**PetGuard** é um sistema fullstack para monitoramento e gestão de pets, permitindo que tutores acompanhem alimentação, atividades físicas, localização e alertas em tempo real.

---

## 📦 Tecnologias Utilizadas

### Backend
- Node.js + Express
- Sequelize (PostgreSQL)
- WebSocket (`ws`)
- JWT + bcrypt (Autenticação)
- Nodemailer (Recuperação de senha)

### Frontend
- React 19 + Vite
- TailwindCSS
- Axios
- OpenLayers (ol) — mapa interativo de localização dos pets
- React Router DOM
- Chart.js + Recharts (Gráficos)

---

## 🚀 Como Rodar o Projeto Localmente

### 🔧 Pré-requisitos
- Node.js (v18 ou superior)
- PostgreSQL rodando localmente
- Git

---

## 📁 Estrutura de Pastas

PetGuard/
├── backend/
│ ├── controllers/
│ ├── routes/
│ ├── migrations/
│ ├── websocket.js
│ ├── server.js
│ └── database.js / db.js
├── frontend/
│ ├── pages/
│ ├── components/
│ ├── App.jsx / main.jsx
│ ├── Router.jsx
│ └── vite.config.js
├── .env.example
├── .gitignore
└── README.md


---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na **raiz do backend** com base no `.env.example`:

PORT=5000

JWT_SECRET=sua_chave_jwt

DB_HOST=localhost

DB_PORT=5432

DB_USER=postgres

DB_PASS=sua_senha

DB_NAME=petguard

EMAIL_USER=seuemail@gmail.com

EMAIL_PASS=sua_senha_de_aplicativo

### 🔑 Gerar JWT_SECRET (opcional, recomendado)

Você pode gerar uma chave segura para o `JWT_SECRET` usando o comando abaixo:

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
Copie o valor gerado e cole no campo JWT_SECRET do seu .env:

JWT_SECRET=valor_gerado_aqui


## 🛠️ Setup do Backend

# 1. Vá para a pasta backend
cd backend

# 2. Instale as dependências
npm install

# 3. Crie o banco no PostgreSQL (com nome igual ao DB_NAME)
# Exemplo com psql:
psql -U postgres -c "CREATE DATABASE petguard;"

# 4. Execute as migrations com Sequelize
npx sequelize-cli db:migrate

# 5. Inicie o servidor
node server.js
O backend será iniciado em: http://localhost:5000

💻 Setup do Frontend

# 1. Vá para a pasta frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
O frontend será iniciado em: http://localhost:5173

⚙️ Principais Funcionalidades
✅ Cadastro/Login/Recuperação de senha

🐶 CRUD de Pets

🍽️ Registro de alimentação

🏃 Atividade física

📍 Localização em tempo real no mapa (OpenLayers)

🚨 Alertas em tempo real via WebSocket

📊 Dashboard com informações resumidas

🔐 Segurança
Middleware de autenticação via JWT

Hash de senhas com bcrypt

Validação de dados no frontend e backend

Tokens armazenados com segurança no frontend

.env com variáveis sensíveis (não versionado)

🧪 Testes e Deploy
Projeto pronto para deploy no Railway, Render ou Heroku

Frontend pode ser publicado no Vercel ou Netlify

Banco em PostgreSQL local ou hospedado (ex: Supabase)

🧼 Boas Práticas
.gitignore configurado corretamente para proteger:

.env

node_modules

dist, build, etc.

Separação de responsabilidades entre controllers, rotas e modelos

Código limpo, com ESLint configurado para React

🤝 Contribuição
Sinta-se livre para contribuir com melhorias ou sugestões. Basta:

git clone https://github.com/seu-usuario/petguard.git
git checkout -b feature/nova-feature
