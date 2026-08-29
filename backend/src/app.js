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

// Libera o frontend React (rodando em outra porta) a chamar esta API
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/treinos', treinoRoutes);
app.use('/api/exercicios', exercicioRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/progresso', progressoRoutes);
app.use('/api/perfil', perfilRoutes);

// Precisa ser o último "app.use": é o que captura os erros repassados por asyncHandler
app.use(errorHandler);

module.exports = app;
