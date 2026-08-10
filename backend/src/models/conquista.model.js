// Consulta SQL do catalogo de conquistas

const pool = require('../config/database.js');

async function listarCatalogo() {
    const {rows} = await pool.quary('SELECT * FROM  conquistas ORDER BY id');
    return rows;
    
}

async function listarDesbloqueadasPorUsuario(usuarioID) {
    const {rows} = await pool.query(
        `SELECT c.codigo, uc.data_conquista
        FROM usuario_conquistas uc
        JOIN conquistas c ON c.id = uc.conquista_id
        WHERE uc.usuario_id = $1`,
        [usuarioId]
    );
    return rows;
}

// Essa funcao desbloqueia uma conquista para o usuário. Se ele já tiver nao faz nada
async function desbloquear(usuarioId, codigo) {
  await pool.query(
    `INSERT INTO usuario_conquistas (usuario_id, conquista_id)
     SELECT $1, id FROM conquistas WHERE codigo = $2
     ON CONFLICT (usuario_id, conquista_id) DO NOTHING`,
    [usuarioId, codigo]
  );
}

module.exports = {listarCatalogo, listarDesbloqueadasPorUsuario, desbloquear};