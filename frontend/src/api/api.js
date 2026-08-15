
//todas as chamadas a API do backend


const API_BASE_URL = 'http://localhost:8080/api';

const CHAVE_TOKEN = 'gymtracker_token';
const CHAVE_NOME = 'gymtracker_nome';
const CHAVE_EMAIL = 'gymtracker_email';

//Sessão (token JWT)
export function salvarSessao({ token, nome, email }) {
  localStorage.setItem(CHAVE_TOKEN, token);
  localStorage.setItem(CHAVE_NOME, nome);
  localStorage.setItem(CHAVE_EMAIL, email);
}

export function limparSessao() {
  localStorage.removeItem(CHAVE_TOKEN);
  localStorage.removeItem(CHAVE_NOME);
  localStorage.removeItem(CHAVE_EMAIL);
}

export function obterToken() {
  return localStorage.getItem(CHAVE_TOKEN);
}

export function estaAutenticado() {
  return !!obterToken();
}

async function requisitar(caminho, opcoes = {}) {
  const token = obterToken();

  const resposta = await fetch(`${API_BASE_URL}${caminho}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...opcoes,
  });

  // Token ausente/expirado/inválido que limpa a sessão para a tela de Login aparecer de novo
  if (resposta.status === 401) {
    limparSessao();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!resposta.ok) {
    let mensagem = `Erro ${resposta.status} ao chamar ${caminho}`;
    try {
      const corpoErro = await resposta.json();
      mensagem = corpoErro.mensagem || mensagem;
    } catch {
      // resposta sem corpo JSON, mantém mensagem padrão
    }
    throw new Error(mensagem);
  }

  if (resposta.status === 204) return null;
  return resposta.json();
}

//Autenticação
export const registrar = (nome, email, senha) =>
  requisitar('/auth/register', { method: 'POST', body: JSON.stringify({ nome, email, senha }) });

export const login = (email, senha) =>
  requisitar('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });

// Home
export const buscarHome = () => requisitar('/home');

//Treinos
export const listarTreinos = () => requisitar('/treinos');
export const buscarTreino = (id) => requisitar(`/treinos/${id}`);
export const criarTreino = (treino) =>
  requisitar('/treinos', { method: 'POST', body: JSON.stringify(treino) });
export const atualizarTreino = (id, treino) =>
  requisitar(`/treinos/${id}`, { method: 'PUT', body: JSON.stringify(treino) });
export const excluirTreino = (id) =>
  requisitar(`/treinos/${id}`, { method: 'DELETE' });

//Exercícios
export const criarExercicio = (treinoId, exercicio) =>
  requisitar(`/treinos/${treinoId}/exercicios`, { method: 'POST', body: JSON.stringify(exercicio) });
export const atualizarExercicio = (id, exercicio) =>
  requisitar(`/exercicios/${id}`, { method: 'PUT', body: JSON.stringify(exercicio) });
export const excluirExercicio = (id) =>
  requisitar(`/exercicios/${id}`, { method: 'DELETE' });

//Histórico
export const listarHistorico = () => requisitar('/historico');
export const registrarTreinoConcluido = (sessao) =>
  requisitar('/historico', { method: 'POST', body: JSON.stringify(sessao) });

//Progresso
export const listarExerciciosDisponiveis = () => requisitar('/progresso/exercicios');
export const buscarEvolucaoExercicio = (nomeExercicio) =>
  requisitar(`/progresso/exercicios/${encodeURIComponent(nomeExercicio)}`);
export const listarRegistrosCorpo = () => requisitar('/progresso/corpo');
export const registrarCorpo = (registro) =>
  requisitar('/progresso/corpo', { method: 'POST', body: JSON.stringify(registro) });

//Perfil
export const buscarPerfil = () => requisitar('/perfil');
export const atualizarPerfil = (dados) =>
  requisitar('/perfil', { method: 'PUT', body: JSON.stringify(dados) });
