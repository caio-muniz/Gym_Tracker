//Historico de treinos concluidos

const historicoModel = require('../models/historico.model');
const conquistaService = require('../services/conquista.service');

async function listar(req, res) {
  const historico = await historicoModel.listarPorUsuario(req.usuario.id);
  res.json(historico);
}

async function registrar(req, res) {
  const { treinoId, nomeTreino, corTreino, duracaoSegundos, series } = req.body;

  if (!nomeTreino || !series || series.length === 0) {
    return res.status(400).json({ mensagem: 'Nome do treino e ao menos uma série são obrigatórios' });
  }

  await historicoModel.criar(req.usuario.id, { treinoId, nomeTreino, corTreino, duracaoSegundos, series });

  const historicoAtualizado = await historicoModel.listarPorUsuario(req.usuario.id);
  await conquistaService.verificarEDesbloquear(req.usuario.id, historicoAtualizado);

  res.status(201).json(historicoAtualizado[0]);
}

module.exports = { listar, registrar };
