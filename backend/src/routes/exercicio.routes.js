//atualizar ou excluir um exercicio

const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middleware/auth');
const exercicioController = require('../controllers/exercicio.controller');

const router = express.Router();
router.use(autenticar);

router.put('/:id', asyncHandler(exercicioController.atualizar));
router.delete('/:id', asyncHandler(exercicioController.excluir));

module.exports = router;