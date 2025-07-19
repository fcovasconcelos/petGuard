const pool = require('../models/db');

exports.registrarAlimentacao = async (req, res) => {
  const { pet_id, data_hora, quantidade_g, tipo_refeicao } = req.body;
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
      `INSERT INTO alimentacoes (
        alimentacao_id, pet_id, data_hora, quantidade_g, tipo_refeicao
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4) RETURNING *`,
      [pet_id, data_hora, quantidade_g, tipo_refeicao]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao registrar alimentação:', err);
    res.status(500).json({ erro: 'Erro ao registrar alimentação.' });
  }
};

exports.listarAlimentacoes = async (req, res) => {
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
      `SELECT * FROM alimentacoes 
       WHERE pet_id = $1 
       ORDER BY data_hora DESC LIMIT 5`,
      [pet_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Nenhuma refeição encontrada para este pet.' });
    }

    res.status(200).json(result.rows);  // Retorna as refeições
  } catch (err) {
    console.error('Erro ao listar alimentações:', err);
    res.status(500).json({ erro: 'Erro ao listar alimentações.' });
  }
};
