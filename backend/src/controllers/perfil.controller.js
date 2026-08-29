//Tela de perfil do usuario
const usuarioModel = require('../models/usuario.model');
const historicoModel = require('../models/historico.model');
const conquistaModel = require('../models/conquista.model');

async function obterPerfil(req, res) {
  const usuario = await usuarioModel.buscarPorId(req.usuario.id);
  const historico = await historicoModel.listarPorUsuario(req.usuario.id);
  const volumeTotalKg = historico.reduce((soma, sessao) => soma + sessao.volumeTotalKg, 0);

  const catalogo = await conquistaModel.listarCatalogo();
  const desbloqueadas = await conquistaModel.listarDesbloqueadasPorUsuario(req.usuario.id);
  const dataPorCodigo = Object.fromEntries(desbloqueadas.map((d) => [d.codigo, d.data_conquista]));

  const conquistas = catalogo.map((c) => ({
    codigo: c.codigo,
    nome: c.nome,
    descricao: c.descricao,
    icone: c.icone,
    desbloqueada: !!dataPorCodigo[c.codigo],
    dataConquista: dataPorCodigo[c.codigo] || null,
  }));

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    treinosTotais: historico.length,
    volumeTotalKg,
    conquistas,
  });
}

async function atualizarPerfil(req, res) {
  const { nome } = req.body;
  if (!nome) return res.status(400).json({ mensagem: 'Nome é obrigatório' });

  const usuario = await usuarioModel.atualizarNome(req.usuario.id, nome);
  res.json(usuario);
}

module.exports = { obterPerfil, atualizarPerfil };
