const pool = require('../models/db');

// POST - Criar alerta
exports.criarAlerta = async (req, res) => {
  const { pet_id, tipo, mensagem } = req.body;
  const tutorId = req.user.tutor_id;
  const data_hora = new Date();
  try {
    const petCheck = await pool.query(
      `SELECT tutor_id FROM pets WHERE pet_id = $1`,
      [pet_id]
    );

    if (petCheck.rowCount === 0) {
      return res.status(404).json({ erro: 'Pet não encontrado.' });
    }

    // if (petCheck.rows[0].tutor_id !== tutorId) {
    //   return res.status(403).json({ erro: 'Acesso não autorizado para este pet.' });
    // }

    const result = await pool.query(
      `INSERT INTO alertas (
        alerta_id, pet_id, tipo, mensagem, data_hora
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *`,
      [pet_id, tipo, mensagem, data_hora]
    );
    // Envia para o frontend via WebSocket
    req.broadcastAlerta(result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar alerta:', err);
    res.status(500).json({ erro: 'Erro ao criar alerta.' });
  }
};

// GET - Listar alertas
exports.listarAlertas = async (req, res) => {
  const { pet_id } = req.params;
  const tutorId = req.user.tutor_id;

  try {
    const petCheck = await pool.query(
      `SELECT tutor_id FROM pets WHERE pet_id = $1`,
      [pet_id]
    );

    if (petCheck.rowCount === 0) {
      return res.status(404).json({ erro: 'Pet não encontrado.' });
    }

    if (petCheck.rows[0].tutor_id !== tutorId) {
      return res.status(403).json({ erro: 'Acesso não autorizado para este pet.' });
    }

    const result = await pool.query(
      `SELECT * FROM alertas 
       WHERE pet_id = $1 
       ORDER BY data_hora DESC`,
      [pet_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar alertas:', err);
    res.status(500).json({ erro: 'Erro ao listar alertas.' });
  }
};

// PATCH - Marcar alerta como resolvido
exports.resolverAlerta = async (req, res) => {
  const { id } = req.params;
  const tutorId = req.user.tutor_id;

  try {
    const alertaCheck = await pool.query(
      `SELECT a.*, p.tutor_id
       FROM alertas a
       JOIN pets p ON a.pet_id = p.pet_id
       WHERE a.alerta_id = $1`,
      [id]
    );

    if (alertaCheck.rowCount === 0) {
      return res.status(404).json({ erro: 'Alerta não encontrado.' });
    }

    if (alertaCheck.rows[0].tutor_id !== tutorId) {
      return res.status(403).json({ erro: 'Acesso não autorizado para este alerta.' });
    }

    await pool.query(
      `UPDATE alertas SET resolvido = TRUE WHERE alerta_id = $1`,
      [id]
    );

    res.status(200).json({ mensagem: 'Alerta marcado como resolvido.' });
  } catch (err) {
    console.error('Erro ao resolver alerta:', err);
    res.status(500).json({ erro: 'Erro ao resolver alerta.' });
  }
};
