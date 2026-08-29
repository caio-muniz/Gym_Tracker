
const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const autenticar = require('../middleware/auth');
const homeController = require('../controllers/home.controller');

const router = express.Router();
router.use(autenticar);

router.get('/', asyncHandler(homeController.obterHome));

module.exports = router;
