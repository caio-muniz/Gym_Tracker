const jwt = require('jsonwebtoken');

const SEGREDO = process.env.JWT_SECRET || 'troque-este-segredo-em-producao';
const EXPIRACAO = process.env.JWT_EXPIRATION || '7d';

function gerarToken(usuario) {
  return jwt.sign({ id: usuario.id, nome: usuario.nome, email: usuario.email }, SEGREDO, {
    expiresIn: EXPIRACAO,
  });
}

// Lança erro se o token for inválido ou estiver expirado
function verificarToken(token) {
  return jwt.verify(token, SEGREDO);
}

module.exports = { gerarToken, verificarToken };