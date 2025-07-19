const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido. Faça login novamente.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => { 
    if (err) {
      const isExpired = err.name === 'TokenExpiredError';
      return res.status(401).json({
        erro: isExpired ? 'Sessão expirada. Faça login novamente.' : 'Token inválido.'
      });
    }
    
    req.user = {
      tutor_id: user.tutorId,
      email: user.email
    };
    next();
  });
}

module.exports = authenticateToken;
