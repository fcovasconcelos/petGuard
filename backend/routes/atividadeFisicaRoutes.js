const express = require('express');
const router = express.Router();
const { registrarAtividadeFisica, listarAtividadesFisicas } = require('../controllers/atividadeFisicaController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, registrarAtividadeFisica);
router.get('/:pet_id', authenticateToken, listarAtividadesFisicas);

module.exports = router;
