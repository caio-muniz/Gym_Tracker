//CRUD de exercicios individuais

const exercicioModel = require('../models/exercicio.model');
const treinoModel = require('../models/treino.model');

async function criar(req, res) {
  const treino = await treinoModel.buscarPorId(req.params.treinoId);
  if (!treino) return res.status(404).json({ mensagem: 'Treino não encontrado' });
  if (treino.usuarioId !== req.usuario.id) return res.status(403).json({ mensagem: 'Acesso negado' });

  const { nome, series, repeticoes, cargaKg } = req.body;
  const exercicio = await exercicioModel.criar(req.params.treinoId, { nome, series, repeticoes, cargaKg });
  res.status(201).json(exercicio);
}

async function atualizar(req, res) {
  const exercicio = await exercicioModel.buscarComDono(req.params.id);
  if (!exercicio) return res.status(404).json({ mensagem: 'Exercício não encontrado' });
  if (exercicio.dono_id !== req.usuario.id) return res.status(403).json({ mensagem: 'Acesso negado' });

  const atualizado = await exercicioModel.atualizar(req.params.id, req.body);
  res.json(atualizado);
}

async function excluir(req, res) {
  const exercicio = await exercicioModel.buscarComDono(req.params.id);
  if (!exercicio) return res.status(404).json({ mensagem: 'Exercício não encontrado' });
  if (exercicio.dono_id !== req.usuario.id) return res.status(403).json({ mensagem: 'Acesso negado' });

  await exercicioModel.excluir(req.params.id);
  res.status(204).send();
}

module.exports = { criar, atualizar, excluir };