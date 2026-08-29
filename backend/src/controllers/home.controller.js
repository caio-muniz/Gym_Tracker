//tela de home inicial
const treinoModel = require('../models/treino.model');
const historicoModel = require('../models/historico.model');
const conquistaModel = require('../models/conquista.model');
const conquistaService = require('../services/conquista.service');

async function obterHome(req, res) {
  const usuarioId = req.usuario.id;

  const treinos = await treinoModel.listarPorUsuario(usuarioId);
  const historico = await historicoModel.listarPorUsuario(usuarioId);
  const desbloqueadas = await conquistaModel.listarDesbloqueadasPorUsuario(usuarioId);

  const streak = conquistaService.calcularStreak(historico);
  const treinosSemana = conquistaService.contarTreinosDaSemana(historico);

  // Sugere o próximo treino em rodízio: o que vem depois, na lista, do último executado
  let treinoDeHoje = null;
  if (treinos.length > 0) {
    const ultimoTreinoId = historico[0]?.treinoId;
    const indiceUltimo = treinos.findIndex((t) => t.id === ultimoTreinoId);
    treinoDeHoje = treinos[(indiceUltimo + 1) % treinos.length];
  }

  res.json({
    saudacao: saudacaoPorHorario(),
    nomeUsuario: req.usuario.nome,
    streakDias: streak,
    treinosSemana,
    conquistasDesbloqueadas: desbloqueadas.length,
    treinoDeHoje,
  });
}

function saudacaoPorHorario() {
  const hora = new Date().getHours();
  if (hora < 12) return 'Bom dia';
  if (hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

module.exports = { obterHome };
