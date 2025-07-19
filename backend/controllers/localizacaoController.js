const pool = require('../models/db');

exports.registrarLocalizacao = async (req, res) => {
  const { pet_id, data_hora, latitude, longitude, precisao } = req.body;
  const tutorId = req.user.tutor_id;

  try {
    // Verificar se o pet pertence ao tutor autenticado
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

    // Inserir localização
    const result = await pool.query(
      `INSERT INTO localizacoes (
        localizacao_id, pet_id, data_hora, latitude, longitude, precisao
      ) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5) RETURNING *`,
      [pet_id, data_hora, latitude, longitude, precisao]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao registrar localização:', err);
    res.status(500).json({ erro: 'Erro ao registrar localização.' });
  }
};

exports.listarLocalizacoes = async (req, res) => {
  const { pet_id } = req.params;
  const tutorId = req.user.tutor_id;

  try {
    // Verificar se o pet pertence ao tutor autenticado
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
      `SELECT * FROM localizacoes 
       WHERE pet_id = $1 
       ORDER BY data_hora DESC`,
      [pet_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar localizações:', err);
    res.status(500).json({ erro: 'Erro ao listar localizações.' });
  }
};
