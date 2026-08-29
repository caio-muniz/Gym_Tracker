
const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middleware/auth');
const perfilController = require('../controllers/perfil.controller');

const router = express.Router();
router.use(autenticar);

router.get('/', asyncHandler(perfilController.obterPerfil));
router.put('/', asyncHandler(perfilController.atualizarPerfil));

module.exports = router;
