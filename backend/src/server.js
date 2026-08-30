/*
 * Ponto de entrada da aplicação: carrega as variáveis de ambiente, garante
 * que o banco de dados esteja pronto (initDb) e só então sobe o servidor HTTP.
 */

require('dotenv').config();
const app = require('./app');
const initDb = require('./db/initDb');

const PORTA = process.env.PORT || 8080;

initDb()
  .then(() => {
    app.listen(PORTA, () => {
      console.log(`Servidor rodando na porta ${PORTA}`);
    });
  })
  .catch((erro) => {
    console.error('Erro ao inicializar o banco de dados:', erro);
    process.exit(1);
  });