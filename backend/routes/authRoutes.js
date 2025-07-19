const express = require('express');
const { register, login } = require('../controllers/authController');
const { recuperarSenha, redefinirSenha } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// Rota para solicitar o link de recuperação
router.post('/recuperar-senha', recuperarSenha);
// Rota para redefinir a senha
router.post('/redefinir-senha', redefinirSenha);

module.exports = router;

