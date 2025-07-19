const express = require('express');
const router = express.Router();
const { registrarAlimentacao, listarAlimentacoes } = require('../controllers/alimentacaoController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, registrarAlimentacao);
router.get('/:pet_id', authenticateToken, listarAlimentacoes);

module.exports = router;
