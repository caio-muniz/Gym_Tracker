/**
 * Envolve um controller assíncrono (async function) e encaminha qualquer
 * erro lançado para o middleware de erro do Express, em vez de
 * deixar a Promise rejeitada travar a requisição sem resposta.
 */

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
