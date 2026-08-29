//CRUD de treinos

const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middleware/auth');
const treinoController = require('../controllers/treino.controller');
const exercicioController = require('../controllers/exercicio.controller');

const router = express.Router();
router.use(autenticar); // toda rota de treino exige login

router.get('/', asyncHandler(treinoController.listar));
router.get('/:id', asyncHandler(treinoController.buscar));
router.post('/', asyncHandler(treinoController.criar));
router.put('/:id', asyncHandler(treinoController.atualizar));
router.delete('/:id', asyncHandler(treinoController.excluir));

router.post('/:treinoId/exercicios', asyncHandler(exercicioController.criar));

module.exports = router;
