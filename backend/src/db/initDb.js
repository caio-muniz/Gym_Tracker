/*Inicialiação do banco*/

const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const CATALOGO_CONQUISTAS = [
  ['PRIMEIRO_TREINO', 'Primeiro Treino', 'Complete seu primeiro treino', '🎯'],
  ['3_DIAS_SEGUIDOS', '3 Dias Seguidos', 'Treine 3 dias consecutivos', '🔥'],
  ['SEMANA_COMPLETA', 'Semana Completa', 'Treine 7 dias consecutivos', '⚡'],
  ['10_TREINOS', '10 Treinos', 'Complete 10 treinos', '💪'],
  ['EVOLUCAO_CARGA', 'Evolução de Carga', 'Aumente a carga em um exercício', '📈'],
];

async function initDb() {
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schema);

    for (const [codigo, nome, descricao, icone] of CATALOGO_CONQUISTAS) {
        await pool.query(
            `INSERT INTO conquistas (codigo, nome, descricao, icone)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (codigo) DO NOTHING`,
             [codigo, nome, descricao, icone]
        );
    }
}

module.exports = initDb;