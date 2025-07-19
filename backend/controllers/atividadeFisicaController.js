const pool = require('../models/db');

exports.registrarAtividadeFisica = async (req, res) => {
  const { pet_id, data_hora_inicio, data_hora_fim, nivel_atividade, duracao_segundos, passos_estimados } = req.body;
  const tutorId = req.user.tutor_id; // obtido do middleware JWT

  try {
    // Verifica se o pet pertence ao tutor autenticado
    // const petCheck = await pool.query(
    //   `SELECT * FROM pets WHERE pet_id = $1 AND tutor_id = $2`,
    //   [pet_id, tutorId]
    // );

    // if (petCheck.rowCount === 0) {
    //   return res.status(403).json({ erro: 'Acesso não autorizado para este pet.' });
    // }

    const result = await pool.query(
      `INSERT INTO atividade_fisica (
        pet_id, data_hora_inicio, data_hora_fim, nivel_atividade, duracao_segundos, passos_estimados
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [pet_id, data_hora_inicio, data_hora_fim, nivel_atividade, duracao_segundos, passos_estimados]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao registrar atividade física:', err);
    res.status(500).json({ erro: 'Erro ao registrar atividade física.' });
  }
};

exports.listarAtividadesFisicas = async (req, res) => {
  const { pet_id } = req.params;
  const tutorId = req.user.tutor_id;

  try {
    // Verifica se o pet pertence ao tutor autenticado
    const petCheck = await pool.query(
      `SELECT * FROM pets WHERE pet_id = $1 AND tutor_id = $2`,
      [pet_id, tutorId]
    );

    if (petCheck.rowCount === 0) {
      return res.status(403).json({ erro: 'Acesso não autorizado para este pet.' });
    }

    const result = await pool.query(
      `SELECT * FROM atividade_fisica 
       WHERE pet_id = $1 
       ORDER BY data_hora_inicio DESC LIMIT 5`,
      [pet_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Nenhuma atividade encontrada para este pet.' });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar atividades físicas:', err);
    res.status(500).json({ erro: 'Erro ao listar atividades físicas.' });
  }
};
