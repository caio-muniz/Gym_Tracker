//Consulta de usuarios

const pool = require('../config/database');

async function criar({ nome, email, senhaHash }) {
  const resultado = await pool.query(
    `INSERT INTO usuarios (nome, email, senha_hash)
     VALUES ($1, $2, $3)
     RETURNING id, nome, email, criado_em`,
    [nome, email, senhaHash]
  );
  return resultado.rows[0];
}

// Usado apenas no login: precisa vir com senha_hash para comparar com bcrypt
async function buscarPorEmailComSenha(email) {
  const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  return resultado.rows[0] || null;
}

async function buscarPorId(id) {
  const resultado = await pool.query(
    'SELECT id, nome, email, criado_em FROM usuarios WHERE id = $1',
    [id]
  );
  return resultado.rows[0] || null;
}

async function atualizarNome(id, nome) {
  await pool.query('UPDATE usuarios SET nome = $1 WHERE id = $2', [nome, id]);
  return buscarPorId(id);
}

module.exports = { criar, buscarPorEmailComSenha, buscarPorId, atualizarNome };
