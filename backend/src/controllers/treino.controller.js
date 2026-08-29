//CRUD dos treinos
const treinoModel = require('../models/treino.model');

async function listar(req, res) {
  const treinos = await treinoModel.listarPorUsuario(req.usuario.id);
  res.json(treinos);
}

async function buscar(req, res) {
  const treino = await treinoModel.buscarPorId(req.params.id);
  if (!treino) return res.status(404).json({ mensagem: 'Treino não encontrado' });
  if (treino.usuarioId !== req.usuario.id) return res.status(403).json({ mensagem: 'Acesso negado' });

  res.json(treino);
}

async function criar(req, res) {
  const { nome, cor, exercicios } = req.body;
  if (!nome) return res.status(400).json({ mensagem: 'Nome do treino é obrigatório' });

  const treino = await treinoModel.criar(req.usuario.id, { nome, cor, exercicios });
  res.status(201).json(treino);
}

async function atualizar(req, res) {
  const treino = await treinoModel.buscarPorId(req.params.id);
  if (!treino) return res.status(404).json({ mensagem: 'Treino não encontrado' });
  if (treino.usuarioId !== req.usuario.id) return res.status(403).json({ mensagem: 'Acesso negado' });

  const atualizado = await treinoModel.atualizar(req.params.id, req.body);
  res.json(atualizado);
}

async function excluir(req, res) {
  const treino = await treinoModel.buscarPorId(req.params.id);
  if (!treino) return res.status(404).json({ mensagem: 'Treino não encontrado' });
  if (treino.usuarioId !== req.usuario.id) return res.status(403).json({ mensagem: 'Acesso negado' });

  await treinoModel.excluir(req.params.id);
  res.status(204).send();
}

module.exports = { listar, buscar, criar, atualizar, excluir };
