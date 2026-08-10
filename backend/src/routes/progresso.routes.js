const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middleware/auth');
const progressoController = require('../controllers/progresso.controller');

const router = express.Router();
router.use(autenticar);

router.get('/exercicios', asyncHandler(progressoController.listarExerciciosDisponiveis));
router.get('/exercicios/:nome', asyncHandler(progressoController.evolucaoExercicio));
router.get('/corpo', asyncHandler(progressoController.listarCorpo));
router.post('/corpo', asyncHandler(progressoController.registrarCorpo));

module.exports = router;