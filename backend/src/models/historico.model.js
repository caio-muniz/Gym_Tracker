//Consultas SQL do histórico de sessões de treino concluídas (tela Histórico)

const pool = require('../config/db');

// Lista as sessões de um usuário, cada uma já com sua lista de séries,
// da mais recente para a mais antiga
async function listarPorUsuario(usuarioId) {
  const { rows: sessoes } = await pool.query(
    'SELECT * FROM historico_treinos WHERE usuario_id = $1 ORDER BY data_execucao DESC',
    [usuarioId]
  );

  const sessoesComSeries = [];
  for (const sessao of sessoes) {
    const { rows: series } = await pool.query(
      'SELECT * FROM historico_series WHERE historico_treino_id = $1 ORDER BY id',
      [sessao.id]
    );
    sessoesComSeries.push(formatarSessao(sessao, series));
  }
  return sessoesComSeries;
}

// Registra a conclusão de uma sessão: cria a sessão e cada série realizada,
// calculando o volume total levantado (soma de carga x repetições)
async function criar(usuarioId, { treinoId, nomeTreino, corTreino, duracaoSegundos, series }) {
  const volumeTotalKg = series.reduce((soma, s) => soma + s.cargaKg * s.repeticoes, 0);

  const { rows } = await pool.query(
    `INSERT INTO historico_treinos (usuario_id, treino_id, nome_treino, cor_treino, duracao_segundos, volume_total_kg)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [usuarioId, treinoId, nomeTreino, corTreino, duracaoSegundos, volumeTotalKg]
  );
  const sessao = rows[0];

  for (const serie of series) {
    await pool.query(
      `INSERT INTO historico_series (historico_treino_id, exercicio_nome, numero_serie, repeticoes, carga_kg)
       VALUES ($1, $2, $3, $4, $5)`,
      [sessao.id, serie.exercicioNome, serie.numeroSerie, serie.repeticoes, serie.cargaKg]
    );
  }

  return formatarSessao(sessao, series.map((s) => ({
    exercicio_nome: s.exercicioNome,
    numero_serie: s.numeroSerie,
    repeticoes: s.repeticoes,
    carga_kg: s.cargaKg,
  })));
}

function formatarSessao(sessao, series) {
  return {
    id: sessao.id,
    treinoId: sessao.treino_id,
    nomeTreino: sessao.nome_treino,
    corTreino: sessao.cor_treino,
    dataExecucao: sessao.data_execucao,
    duracaoSegundos: sessao.duracao_segundos,
    volumeTotalKg: sessao.volume_total_kg != null ? Number(sessao.volume_total_kg) : 0,
    series: series.map((s) => ({
      exercicioNome: s.exercicio_nome,
      numeroSerie: s.numero_serie,
      repeticoes: s.repeticoes,
      cargaKg: Number(s.carga_kg),
    })),
  };
}

module.exports = { listarPorUsuario, criar };
