const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../models/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.register = async (req, res) => {
  const { nome, email, senha, telefone } = req.body;

  // Verificar se os campos obrigatórios estão presentes
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
  }

  if (!senha || senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Verificar se o email já existe na tabela de tutores
    const emailCheck = await pool.query('SELECT * FROM tutores WHERE email = $1', [email]);

    if (emailCheck.rowCount > 0) {
      return res.status(400).json({ erro: 'Este email já está cadastrado.' });
    }

    // Criptografar a senha
    const hash = await bcrypt.hash(senha, 10);

    // Inserir novo usuário na tabela tutores
    const result = await pool.query(
      `INSERT INTO tutores (nome, email, senha_hash, telefone) 
       VALUES ($1, $2, $3, $4) RETURNING tutor_id`,
      [nome, email, hash, telefone || null]
    );

    // Enviar resposta de sucesso
    return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!', usuario: result.rows[0] });

  } catch (err) {
    // Erro de banco de dados
    if (err.code === '23505') {
      return res.status(400).json({ erro: 'Este email já está registrado.' });
    }

    // Erro inesperado no servidor
    return res.status(500).json({ erro: 'Erro interno no servidor.' });
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;

  try {
    const result = await pool.query('SELECT * FROM tutores WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Tutor não encontrado.' });
    }

    const tutor = result.rows[0];
    const nome = tutor.nome;
    const isValid = await bcrypt.compare(senha, tutor.senha_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { tutorId: tutor.tutor_id, email: tutor.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, nome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro no login.' });
  }
};

// Função para enviar o e-mail de recuperação de senha
const enviarEmailRecuperacao = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'petguard.system@gmail.com',
      pass: 'yvou dbix mpfv yzpe',
    },
  });

  const mailOptions = {
    from: 'petguard.system@gmail.com',
    to: email,
    subject: 'Recuperação de Senha - PetGuard',
    text: `Clique no link abaixo para redefinir sua senha:\n\nhttp://localhost:5173/redefinir-senha/${token}`,
    html: `<p>Clique no link abaixo para redefinir sua senha:</p><p><a href="http://localhost:5173/redefinir-senha/${token}">Redefinir Senha</a></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('E-mail enviado com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
    throw new Error('Erro ao enviar o e-mail de recuperação.');
  }
};

// Rota de recuperação de senha (envia o link com o token)
exports.recuperarSenha = async (req, res) => {
  const { email } = req.body;

  try {
    // Verificar se o email existe
    const result = await pool.query('SELECT * FROM tutores WHERE email = $1', [email]);

    if (result.rowCount === 0) {
      return res.status(400).json({ erro: 'Email não encontrado.' });
    }

    // Gerar o token de recuperação
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar o e-mail de recuperação
    await enviarEmailRecuperacao(email, token);

    return res.status(200).json({ mensagem: 'Link de recuperação de senha enviado para o seu e-mail.' });

  } catch (err) {
    console.error('Erro ao recuperar senha:', err);
    res.status(500).json({ erro: 'Erro interno ao processar a recuperação de senha.' });
  }
};

// Função para redefinir a senha usando o token de recuperação
exports.redefinirSenha = async (req, res) => {
  const { novaSenha, token } = req.body;

  try {
    // Verificar se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validar a nova senha
    if (!novaSenha || novaSenha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    // Criptografar a nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualizar a senha no banco de dados
    const result = await pool.query(
      'UPDATE tutores SET senha_hash = $1 WHERE email = $2 RETURNING tutor_id',
      [senhaHash, decoded.email]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ erro: 'Usuário não encontrado para redefinir a senha.' });
    }

    return res.status(200).json({ mensagem: 'Senha redefinida com sucesso!' });

  } catch (err) {
    console.error('Erro ao redefinir a senha:', err);
    res.status(500).json({ erro: 'Erro interno ao redefinir a senha.' });
  }
};
