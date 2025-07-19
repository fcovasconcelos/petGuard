const express = require('express');
const router = express.Router();
const { cadastrarPet, listarPets, editarPet, excluirPet, buscarPet, registrarAlimentacao } = require('../controllers/petController');
const authenticateToken = require('../middleware/authMiddleware');

// Rota para cadastrar um pet
router.post('/', authenticateToken, cadastrarPet);

// Rota para buscar um pet específico
router.get('/:pet_id', authenticateToken, buscarPet);

// Rota para listar os pets do tutor
router.get('/', authenticateToken, listarPets);

// Rota para editar um pet
router.put('/:pet_id', authenticateToken, editarPet);

// Rota para excluir um pet
router.delete('/:pet_id', authenticateToken, excluirPet);

// Rota para registrar alimentação
router.post('/alimentacao', authenticateToken, registrarAlimentacao);

module.exports = router;
