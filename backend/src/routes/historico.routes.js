
const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middleware/auth');
const historicoController = require('../controllers/historico.controller');

const router = express.Router();
router.use(autenticar);

router.get('/', asyncHandler(historicoController.listar));
router.post('/', asyncHandler(historicoController.registrar));

module.exports = router;
