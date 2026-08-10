// Consulta de um exercicio individual

const pool = require('../config/db');
const { formatarExercicio } = require('./treino.model');

// Traz também o dono do treino (dono_id), usado para checar permissão no controller
async function buscarComDono(id) {
  const { rows } = await pool.query(
    `SELECT e.*, t.usuario_id AS dono_id
     FROM exercicios e
     JOIN treinos t ON t.id = e.treino_id
     WHERE e.id = $1`,
    [id]
  );
  return rows[0] || null;
}

async function criar(treinoId, { nome, series, repeticoes, cargaKg }) {
  const { rows } = await pool.query(
    `INSERT INTO exercicios (treino_id, nome, series, repeticoes, carga_kg)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [treinoId, nome, series, repeticoes, cargaKg]
  );
  return formatarExercicio(rows[0]);
}

async function atualizar(id, { nome, series, repeticoes, cargaKg }) {
  const { rows } = await pool.query(
    `UPDATE exercicios SET nome = $1, series = $2, repeticoes = $3, carga_kg = $4
     WHERE id = $5 RETURNING *`,
    [nome, series, repeticoes, cargaKg, id]
  );
  return formatarExercicio(rows[0]);
}

async function excluir(id) {
  await pool.query('DELETE FROM exercicios WHERE id = $1', [id]);
}

module.exports = { buscarComDono, criar, atualizar, excluir };