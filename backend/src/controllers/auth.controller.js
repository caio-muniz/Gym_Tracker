//Cadastro de usuário e login
const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuario.model');
const { gerarToken } = require('../utils/jwt');

async function registrar(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ mensagem: 'Nome, email e senha são obrigatórios' });
  }
  if (senha.length < 6) {
    return res.status(400).json({ mensagem: 'A senha deve ter no mínimo 6 caracteres' });
  }

  const existente = await usuarioModel.buscarPorEmailComSenha(email);
  if (existente) {
    return res.status(409).json({ mensagem: 'Já existe um usuário cadastrado com esse email' });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await usuarioModel.criar({ nome, email, senhaHash });
  res.status(201).json(usuario);
}

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
  }

  const usuario = await usuarioModel.buscarPorEmailComSenha(email);
  if (!usuario) {
    return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaCorreta) {
    return res.status(401).json({ mensagem: 'Email ou senha inválidos' });
  }

  const token = gerarToken(usuario);
  res.json({ token, nome: usuario.nome, email: usuario.email });
}

module.exports = { registrar, login };
