const { verificarToken } = require('../utils/jwt');

function autenticar(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ mensagem: 'Token não informado' });
  }

  const token = header.substring(7);

  try {
    const payload = verificarToken(token);
    req.usuario = { id: payload.id, nome: payload.nome, email: payload.email };
    next();
  } catch (erro) {
    return res.status(401).json({ mensagem: 'Token inválido ou expirado' });
  }
}

module.exports = autenticar;