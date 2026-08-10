/* Criação do servidor */

require('dotenv').config();
const app = require('./app');
const initDb = require('.db/initDb');

const PORTA = process.env.PORT || 8080;

initDb()
    .then(() => {
        app.listen(PORTA, () => {
            console.log(`Servidor rodando em http://localhost:${PORTA}`);        
        });
    })
    .catch((erro) => {
        console.error('Erro ao inicializar o banco:', erro);
        process.exit(1);
    });