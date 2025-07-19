const express = require('express');
const router = express.Router();
const { registrarLocalizacao, listarLocalizacoes } = require('../controllers/localizacaoController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, registrarLocalizacao);
router.get('/:pet_id', authenticateToken, listarLocalizacoes);

module.exports = router;
