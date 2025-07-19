const pool = require('../models/db');
const { v4: uuidv4 } = require('uuid');

// Cadastrar pet
exports.cadastrarPet = async (req, res) => {
  const { nome, especie, raca, data_nascimento, peso_kg } = req.body;
  const tutor_id = req.user.tutor_id; // vem do token

  try {
    const pet_id = uuidv4();
    await pool.query(
      `INSERT INTO pets (pet_id, nome, especie, raca, data_nascimento, peso_kg, tutor_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [pet_id, nome, especie, raca, data_nascimento, peso_kg, tutor_id]
    );
    res.status(201).json({ pet_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao cadastrar o pet.' });
  }
};

// Listar pets do tutor
exports.listarPets = async (req, res) => {
  const tutor_id = req.user.tutor_id;

  try {
    const result = await pool.query(
      `SELECT pet_id, nome, especie, raca, TO_CHAR(data_nascimento, 'YYYY-MM-DD') AS data_nascimento, peso_kg FROM pets WHERE tutor_id = $1`,
      [tutor_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar pets.' });
  }
};

// Busca pet
exports.buscarPet = async (req, res) => {
  const { pet_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT pet_id, nome, especie, raca, TO_CHAR(data_nascimento, 'YYYY-MM-DD') AS data_nascimento, peso_kg FROM pets WHERE pet_id = $1 AND tutor_id = $2`,
      [pet_id, req.user.tutor_id]  // Verifica se o tutor é o dono do pet
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Pet não encontrado.' });
    }

    res.status(200).json(result.rows[0]); // Retorna o pet
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar o pet.' });
  }
}

// Editar pet
exports.editarPet = async (req, res) => {
  const { pet_id, nome, especie, raca, data_nascimento, peso_kg } = req.body;
  const tutor_id = req.user.tutor_id; // tutor_id do token

  try {
    const result = await pool.query(
      `UPDATE pets SET nome = $1, especie = $2, raca = $3, data_nascimento = $4, peso_kg = $5
       WHERE pet_id = $6 AND tutor_id = $7 RETURNING pet_id`,
      [nome, especie, raca, data_nascimento, peso_kg, pet_id, tutor_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Pet não encontrado ou não autorizado.' });
    }

    res.status(200).json({ mensagem: 'Pet atualizado com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao editar pet.' });
  }
};

// Excluir pet
exports.excluirPet = async (req, res) => {
  const { pet_id } = req.params;
  const tutor_id = req.user.tutor_id; // tutor_id do token

  try {
    const result = await pool.query(
      `DELETE FROM pets WHERE pet_id = $1 AND tutor_id = $2 RETURNING pet_id`,
      [pet_id, tutor_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ erro: 'Pet não encontrado ou não autorizado.' });
    }

    res.status(200).json({ mensagem: 'Pet excluído com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao excluir pet.' });
  }
};

// Liberar alimentação
exports.registrarAlimentacao = async (req, res) => {
  const { pet_id, quantidade_g, tipo_refeicao } = req.body;
  const tutor_id = req.user.tutor_id; // tutor_id do token

  // Validar os campos obrigatórios
  if (!quantidade_g || !tipo_refeicao) {
    return res.status(400).json({ erro: "Quantidade e tipo de refeição são obrigatórios." });
  }
  //
  // Lógica de liberação de alimentação
  // Inserir no banco apenas de recebesse sucesso do sistema embarcado
  //
  try {
    // Inserir alimentação no banco de dados
    await pool.query(
      `INSERT INTO alimentacoes (pet_id, quantidade_g, tipo_refeicao) 
       VALUES ($1, $2, $3)`,
      [pet_id, quantidade_g, tipo_refeicao]
    );

    res.status(201).json({ mensagem: "Alimentação registrada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro ao registrar alimentação." });
  }
};