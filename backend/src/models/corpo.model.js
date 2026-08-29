//Consultas SQL da tabela "registros_corpo" (aba "Corpo" da tela Progresso)
const pool = require('../config/db');

async function listarPorUsuario(usuarioId) {
  const { rows } = await pool.query(
    'SELECT * FROM registros_corpo WHERE usuario_id = $1 ORDER BY data ASC',
    [usuarioId]
  );
  return rows.map(formatar);
}

async function criar(usuarioId, { data, pesoKg }) {
  const { rows } = await pool.query(
    'INSERT INTO registros_corpo (usuario_id, data, peso_kg) VALUES ($1, $2, $3) RETURNING *',
    [usuarioId, data, pesoKg]
  );
  return formatar(rows[0]);
}

function formatar(registro) {
  return { id: registro.id, data: registro.data, pesoKg: Number(registro.peso_kg) };
}

module.exports = { listarPorUsuario, criar };
