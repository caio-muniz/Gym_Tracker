//Rotas públicas de cadastro e login (não passam pelo middleware de autenticação)

const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', asyncHandler(authController.registrar));
router.post('/login', asyncHandler(authController.login));

module.exports = router;
