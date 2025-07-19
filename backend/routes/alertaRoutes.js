const express = require('express');
const router = express.Router();
const {
  criarAlerta,
  listarAlertas,
  resolverAlerta
} = require('../controllers/alertaController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, criarAlerta);
router.get('/:pet_id', authenticateToken, listarAlertas);
router.patch('/:id/resolver', authenticateToken, resolverAlerta);

module.exports = router;
