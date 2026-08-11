// Evolucao de cargas dos exercicios
const historicoModel = require('../models/historico.model');
const corpoModel = require('../models/corpo.model');

// Nomes de exercícios já registrados no histórico do usuário
async function listarExerciciosDisponiveis(req, res) {
  const historico = await historicoModel.listarPorUsuario(req.usuario.id);
  const nomes = [...new Set(historico.flatMap((sessao) => sessao.series.map((s) => s.exercicioNome)))].sort();
  res.json(nomes);
}

// Para um exercício, retorna a maior carga levantada por dia, em ordem cronológica
async function evolucaoExercicio(req, res) {
  const nomeExercicio = req.params.nome.toLowerCase();
  const historico = await historicoModel.listarPorUsuario(req.usuario.id);

  const melhorPorDia = {};
  historico
    .slice()
    .reverse()
    .forEach((sessao) => {
      const dataChave = new Date(sessao.dataExecucao).toISOString().slice(0, 10);
      sessao.series
        .filter((s) => s.exercicioNome.toLowerCase() === nomeExercicio)
        .forEach((s) => {
          const atual = melhorPorDia[dataChave];
          if (!atual || s.cargaKg > atual.cargaMaximaKg) {
            melhorPorDia[dataChave] = { data: dataChave, cargaMaximaKg: s.cargaKg, repeticoes: s.repeticoes };
          }
        });
    });

  const pontos = Object.values(melhorPorDia).sort((a, b) => a.data.localeCompare(b.data));
  res.json(pontos);
}

async function listarCorpo(req, res) {
  const registros = await corpoModel.listarPorUsuario(req.usuario.id);
  res.json(registros);
}

async function registrarCorpo(req, res) {
  const { data, pesoKg } = req.body;
  if (!pesoKg) return res.status(400).json({ mensagem: 'Peso é obrigatório' });

  const registro = await corpoModel.criar(req.usuario.id, {
    data: data || new Date().toISOString().slice(0, 10),
    pesoKg,
  });
  res.status(201).json(registro);
}

module.exports = { listarExerciciosDisponiveis, evolucaoExercicio, listarCorpo, registrarCorpo };
