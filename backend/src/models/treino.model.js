//Consultas SQL de treinos, sempre trazendo junto a lista de exercícios

const pool = require('../config/db');

// Lista os treinos de um usuário, cada um já com sua lista de exercícios
async function listarPorUsuario(usuarioId) {
  const { rows: treinos } = await pool.query(
    'SELECT * FROM treinos WHERE usuario_id = $1 ORDER BY id',
    [usuarioId]
  );

  const treinosComExercicios = [];
  for (const treino of treinos) {
    const exercicios = await listarExerciciosDoTreino(treino.id);
    treinosComExercicios.push(formatarTreino(treino, exercicios));
  }
  return treinosComExercicios;
}

async function buscarPorId(id) {
  const { rows } = await pool.query('SELECT * FROM treinos WHERE id = $1', [id]);
  const treino = rows[0];
  if (!treino) return null;

  const exercicios = await listarExerciciosDoTreino(id);
  return formatarTreino(treino, exercicios);
}

// Cria o treino e, se enviados, já cria os exercícios junto (mesma requisição)
async function criar(usuarioId, { nome, cor, exercicios = [] }) {
  const { rows } = await pool.query(
    'INSERT INTO treinos (usuario_id, nome, cor) VALUES ($1, $2, $3) RETURNING *',
    [usuarioId, nome, cor]
  );
  const treino = rows[0];

  for (const exercicio of exercicios) {
    await pool.query(
      `INSERT INTO exercicios (treino_id, nome, series, repeticoes, carga_kg)
       VALUES ($1, $2, $3, $4, $5)`,
      [treino.id, exercicio.nome, exercicio.series, exercicio.repeticoes, exercicio.cargaKg]
    );
  }

  return buscarPorId(treino.id);
}

async function atualizar(id, { nome, cor }) {
  await pool.query('UPDATE treinos SET nome = $1, cor = $2 WHERE id = $3', [nome, cor, id]);
  return buscarPorId(id);
}

// Exercícios do treino saem junto pelo ON DELETE CASCADE do schema
async function excluir(id) {
  await pool.query('DELETE FROM treinos WHERE id = $1', [id]);
}

async function listarExerciciosDoTreino(treinoId) {
  const { rows } = await pool.query(
    'SELECT * FROM exercicios WHERE treino_id = $1 ORDER BY id',
    [treinoId]
  );
  return rows.map(formatarExercicio);
}

function formatarTreino(treino, exercicios) {
  return {
    id: treino.id,
    nome: treino.nome,
    cor: treino.cor,
    usuarioId: treino.usuario_id,
    exercicios,
  };
}

function formatarExercicio(exercicio) {
  return {
    id: exercicio.id,
    nome: exercicio.nome,
    series: exercicio.series,
    repeticoes: exercicio.repeticoes,
    cargaKg: Number(exercicio.carga_kg),
    treinoId: exercicio.treino_id,
  };
}

module.exports = {
  listarPorUsuario,
  buscarPorId,
  criar,
  atualizar,
  excluir,
  listarExerciciosDoTreino,
  formatarExercicio,
};
