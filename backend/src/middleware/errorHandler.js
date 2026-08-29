/**
 * Middleware de erro do Express (identificado pela assinatura com 4
 * parâmetros). Captura qualquer erro repassado por asyncHandler e devolve
 * uma resposta JSON padronizada, em vez de derrubar o servidor.
 */
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ mensagem: err.message || 'Erro interno do servidor' });
}

module.exports = errorHandler;
