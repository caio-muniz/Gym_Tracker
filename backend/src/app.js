/*
 * Configura a aplicação Express: middlewares globais (CORS, parser de JSON)
 * e o registro de todas as rotas da API
 */

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const homeRoutes = require('./routes/home.routes');
const treinoRoutes = require('./routes/treino.routes');
const exercicioRoutes = require('./routes/exercicio.routes');
const historicoRoutes = require('./routes/historico.routes');
const progressoRoutes = require('./routes/progresso.routes');
const perfilRoutes = require('./routes/perfil.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const origensPermitidas = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

function verificarOrigem(origin, callback) {
  if (!origin || origensPermitidas.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error('Origem não permitida pelo CORS'));
  }
}

app.use(cors({ origin: verificarOrigem }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/treinos', treinoRoutes);
app.use('/api/exercicios', exercicioRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/progresso', progressoRoutes);
app.use('/api/perfil', perfilRoutes);

app.use(errorHandler);

module.exports = app;