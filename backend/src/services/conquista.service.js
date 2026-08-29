/**
 * Regras de negócio das conquistas: cálculo de streak (dias seguidos
 * treinando), contagem de treinos na semana, e verificação/desbloqueio de
 * conquistas logo após uma sessão de treino ser registrada.
 */

const conquistaModel = require('../models/conquista.model');

// Quantos dias consecutivos (contando até hoje ou ontem) o usuário treinou
function calcularStreak(sessoes) {
  if (sessoes.length === 0) return 0;

  const dias = [...new Set(sessoes.map((s) => new Date(s.dataExecucao).toISOString().slice(0, 10)))]
    .sort((a, b) => b.localeCompare(a)); // mais recente primeiro

  const hoje = new Date().toISOString().slice(0, 10);
  const ontem = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (dias[0] !== hoje && dias[0] !== ontem) return 0; // streak "quebrou"

  let streak = 1;
  let cursor = new Date(dias[0]);
  for (let i = 1; i < dias.length; i++) {
    const esperado = new Date(cursor.getTime() - 86400000).toISOString().slice(0, 10);
    if (dias[i] === esperado) {
      streak++;
      cursor = new Date(dias[i]);
    } else {
      break;
    }
  }
  return streak;
}

// Quantos dias distintos, tiveram treino
function contarTreinosDaSemana(sessoes) {
  const agora = new Date();
  const inicioSemana = new Date(agora);
  inicioSemana.setDate(agora.getDate() - agora.getDay());
  inicioSemana.setHours(0, 0, 0, 0);

  const dias = new Set(
    sessoes
      .filter((s) => new Date(s.dataExecucao) >= inicioSemana)
      .map((s) => new Date(s.dataExecucao).toISOString().slice(0, 10))
  );
  return dias.size;
}

/**
 * Verifica, após uma nova sessão ser registrada, quais conquistas passaram a
 * ser cumpridas e as desbloqueia. Recebe TODAS as sessões do usuário (já
 * incluindo a nova), ordenadas da mais recente para a mais antiga.
 */
async function verificarEDesbloquear(usuarioId, sessoes) {
  const streak = calcularStreak(sessoes);
  const total = sessoes.length;

  if (total >= 1) await conquistaModel.desbloquear(usuarioId, 'PRIMEIRO_TREINO');
  if (streak >= 3) await conquistaModel.desbloquear(usuarioId, '3_DIAS_SEGUIDOS');
  if (streak >= 7) await conquistaModel.desbloquear(usuarioId, 'SEMANA_COMPLETA');
  if (total >= 10) await conquistaModel.desbloquear(usuarioId, '10_TREINOS');

  // "Evolução de Carga": alguma série da sessão mais recente superou a maior
  // carga já registrada anteriormente para o mesmo exercício
  const [ultimaSessao, ...anteriores] = sessoes;
  const seriesAnteriores = anteriores.flatMap((s) => s.series);

  const evoluiuCarga = ultimaSessao.series.some((serieAtual) => {
    const melhorAnterior = seriesAnteriores
      .filter((s) => s.exercicioNome === serieAtual.exercicioNome)
      .reduce((max, s) => Math.max(max, s.cargaKg), 0);
    return serieAtual.cargaKg > melhorAnterior;
  });

  if (evoluiuCarga) await conquistaModel.desbloquear(usuarioId, 'EVOLUCAO_CARGA');
}

module.exports = { calcularStreak, contarTreinosDaSemana, verificarEDesbloquear };
