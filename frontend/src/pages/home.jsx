import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Calendar, Trophy, Dumbbell, Zap } from 'lucide-react';
import { buscarHome } from '../api/api';
import '../styles/home.css';

// Tela home com tudo que o usuario precisa
export default function Home() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(null);
  const navegar = useNavigate();

  useEffect(() => {
    buscarHome()
      .then(setDados)
      .catch((e) => setErro(e.message));
  }, []);

  if (erro) {
    return (
      <div className="pagina">
        <div className="estado-vazio">
          Não foi possível carregar a Home.<br />
          <small>{erro}</small>
        </div>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="pagina">
        <div className="spinner" />
      </div>
    );
  }

  const treino = dados.treinoDeHoje;

  return (
    <div className="pagina">
      <p className="home-saudacao">{dados.saudacao}</p>
      <h1 className="home-nome">{dados.nomeUsuario} 💪</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icone"><Flame size={22} color="#f97316" /></div>
          <div className="stat-card-valor">{dados.streakDias}</div>
          <div className="stat-card-rotulo">Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icone"><Calendar size={22} color="#3b82f6" /></div>
          <div className="stat-card-valor">{dados.treinosSemana}</div>
          <div className="stat-card-rotulo">Semana</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icone"><Trophy size={22} color="#eab308" /></div>
          <div className="stat-card-valor">{dados.conquistasDesbloqueadas}</div>
          <div className="stat-card-rotulo">Conquistas</div>
        </div>
      </div>

      {treino ? (
        <div className="treino-hoje-card">
          <div className="treino-hoje-cabecalho">
            <div>
              <p className="treino-hoje-rotulo">Treino de hoje</p>
              <p className="treino-hoje-nome">{treino.nome}</p>
            </div>
            <div className="treino-hoje-icone">
              <Dumbbell size={22} />
            </div>
          </div>
          <p className="treino-hoje-qtd">{treino.exercicios.length} exercícios</p>
          <button className="botao-primario" onClick={() => navegar(`/treinos/${treino.id}/executar`)}>
            <Zap size={18} fill="currentColor" />
            Iniciar Treino
          </button>
        </div>
      ) : (
        <div className="estado-vazio">
          Você ainda não tem treinos cadastrados.<br />
          Vá até a aba "Treinos" e crie o seu primeiro!
        </div>
      )}
    </div>
  );
}
