import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Trash2, Star, ChevronRight, X } from 'lucide-react';
import { listarTreinos, criarTreino, excluirTreino } from '../api/api';
import '../styles/treinos.css';

// Cores disponíveis para a barrinha lateral de cada card de treino
const CORES_DISPONIVEIS = ['#8BC34A', '#2196F3', '#FF9800', '#E91E63', '#9C27B0'];

// Templates prontos para agilizar a criação de treinos comuns
const TEMPLATES = {
  'Push/Pull/Legs': [
    { nome: 'Treino Push - Peito/Ombro/Tríceps', cor: '#8BC34A', exercicios: [
      { nome: 'Supino Reto', series: 4, repeticoes: 10, cargaKg: 40 },
      { nome: 'Desenvolvimento', series: 3, repeticoes: 12, cargaKg: 20 },
      { nome: 'Tríceps Corda', series: 3, repeticoes: 12, cargaKg: 15 },
    ]},
    { nome: 'Treino Pull - Costas/Bíceps', cor: '#2196F3', exercicios: [
      { nome: 'Puxada Frontal', series: 4, repeticoes: 12, cargaKg: 45 },
      { nome: 'Remada Curvada', series: 4, repeticoes: 10, cargaKg: 30 },
      { nome: 'Rosca Direta', series: 3, repeticoes: 12, cargaKg: 12 },
    ]},
    { nome: 'Treino Legs - Pernas', cor: '#FF9800', exercicios: [
      { nome: 'Agachamento', series: 4, repeticoes: 10, cargaKg: 60 },
      { nome: 'Leg Press', series: 4, repeticoes: 12, cargaKg: 120 },
      { nome: 'Cadeira Extensora', series: 3, repeticoes: 15, cargaKg: 40 },
    ]},
  ],
  'Full Body': [
    { nome: 'Treino Full Body', cor: '#9C27B0', exercicios: [
      { nome: 'Agachamento', series: 3, repeticoes: 12, cargaKg: 50 },
      { nome: 'Supino Reto', series: 3, repeticoes: 12, cargaKg: 35 },
      { nome: 'Remada Curvada', series: 3, repeticoes: 12, cargaKg: 30 },
      { nome: 'Desenvolvimento', series: 3, repeticoes: 12, cargaKg: 18 },
    ]},
  ],
};

const EXERCICIO_VAZIO = { nome: '', series: 3, repeticoes: 12, cargaKg: 0 };

export default function Treinos() {
  const [treinos, setTreinos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  async function carregar() {
    setCarregando(true);
    const lista = await listarTreinos();
    setTreinos(lista);
    setCarregando(false);
  }

  async function handleExcluir(id) {
    if (!confirm('Excluir este treino? Essa ação não pode ser desfeita.')) return;
    await excluirTreino(id);
    carregar();
  }

  async function handleCriarTemplate(exerciciosTemplate) {
    setSalvando(true);
    try {
      // Cria, em sequência, cada treino definido no template escolhido
      for (const t of exerciciosTemplate) {
        await criarTreino(t);
      }
      await carregar();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="pagina">
      <div className="pagina-cabecalho">
        <h1 className="pagina-titulo" style={{ marginBottom: 0 }}>Treinos</h1>
        <button className="botao-novo" onClick={() => setModalAberto(true)}>
          <Plus size={16} strokeWidth={3} /> Novo
        </button>
      </div>

      {carregando ? (
        <div className="spinner" />
      ) : treinos.length === 0 ? (
        <div className="estado-vazio">Nenhum treino cadastrado ainda. Toque em "+ Novo" para criar o primeiro.</div>
      ) : (
        treinos.map((treino) => (
          <div key={treino.id} className="treino-card" style={{ '--cor-treino': treino.cor }}>
            <div className="treino-card-topo">
              <div>
                <div className="treino-card-nome">{treino.nome}</div>
                <div className="treino-card-qtd">{treino.exercicios.length} exercícios</div>
              </div>
              <div className="treino-card-acoes">
                <button className="botao-excluir" onClick={() => handleExcluir(treino.id)} aria-label="Excluir treino">
                  <Trash2 size={18} />
                </button>
                <button className="botao-play" onClick={() => navegar(`/treinos/${treino.id}/executar`)} aria-label="Iniciar treino">
                  <Play size={18} fill="currentColor" />
                </button>
              </div>
            </div>

            {treino.exercicios.slice(0, 3).map((ex) => (
              <div className="exercicio-linha" key={ex.id}>
                <span className="exercicio-linha-nome"><Star size={14} /> {ex.nome}</span>
                <span className="exercicio-linha-detalhe">{ex.series}×{ex.repeticoes} · {ex.cargaKg}kg</span>
              </div>
            ))}
            {treino.exercicios.length > 3 && (
              <div className="exercicio-mais">+{treino.exercicios.length - 3} mais</div>
            )}
          </div>
        ))
      )}

      <p className="templates-titulo">Templates</p>
      {Object.entries(TEMPLATES).map(([nomeTemplate, treinosTemplate]) => (
        <button
          key={nomeTemplate}
          className="template-item"
          disabled={salvando}
          onClick={() => handleCriarTemplate(treinosTemplate)}
        >
          {nomeTemplate}
          <ChevronRight size={18} />
        </button>
      ))}

      {modalAberto && (
        <ModalNovoTreino
          onFechar={() => setModalAberto(false)}
          onCriado={() => {
            setModalAberto(false);
            carregar();
          }}
        />
      )}
    </div>
  );
}

// Modal de criação de um novo treino: nome, cor e lista dinâmica de exercícios.
function ModalNovoTreino({ onFechar, onCriado }) {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState(CORES_DISPONIVEIS[0]);
  const [exercicios, setExercicios] = useState([{ ...EXERCICIO_VAZIO }]);
  const [salvando, setSalvando] = useState(false);

  function atualizarExercicio(indice, campo, valor) {
    setExercicios((atual) =>
      atual.map((ex, i) => (i === indice ? { ...ex, [campo]: valor } : ex))
    );
  }

  function removerExercicio(indice) {
    setExercicios((atual) => atual.filter((_, i) => i !== indice));
  }

  async function handleSalvar(e) {
    e.preventDefault();
    if (!nome.trim() || exercicios.length === 0) return;

    setSalvando(true);
    try {
      await criarTreino({
        nome,
        cor,
        exercicios: exercicios.filter((ex) => ex.nome.trim()),
      });
      onCriado();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <div className="pagina-cabecalho">
          <h2 className="pagina-titulo" style={{ fontSize: 20, marginBottom: 0 }}>Novo Treino</h2>
          <button className="botao-icone" onClick={onFechar}><X size={20} /></button>
        </div>

        <form onSubmit={handleSalvar}>
          <div className="campo-form">
            <label>Nome do treino</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Treino D - Ombro"
              required
            />
          </div>

          <div className="campo-form">
            <label>Cor</label>
            <div className="cor-swatch-grupo">
              {CORES_DISPONIVEIS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`cor-swatch ${cor === c ? 'selecionada' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setCor(c)}
                />
              ))}
            </div>
          </div>

          <label style={{ display: 'block', fontSize: 13, color: 'var(--cor-texto-secundario)', margin: '18px 0 8px' }}>
            Exercícios
          </label>

          {exercicios.map((ex, i) => (
            <div className="exercicio-form-item" key={i}>
              <div className="exercicio-form-topo">
                <span>Exercício {i + 1}</span>
                {exercicios.length > 1 && (
                  <button type="button" className="link-remover" onClick={() => removerExercicio(i)}>
                    Remover
                  </button>
                )}
              </div>
              <div className="campo-form">
                <input
                  placeholder="Nome do exercício"
                  value={ex.nome}
                  onChange={(e) => atualizarExercicio(i, 'nome', e.target.value)}
                />
              </div>
              <div className="linha-3-colunas">
                <div className="campo-form">
                  <label>Séries</label>
                  <input type="number" min="1" value={ex.series}
                    onChange={(e) => atualizarExercicio(i, 'series', Number(e.target.value))} />
                </div>
                <div className="campo-form">
                  <label>Reps</label>
                  <input type="number" min="1" value={ex.repeticoes}
                    onChange={(e) => atualizarExercicio(i, 'repeticoes', Number(e.target.value))} />
                </div>
                <div className="campo-form">
                  <label>Carga (kg)</label>
                  <input type="number" min="0" step="0.5" value={ex.cargaKg}
                    onChange={(e) => atualizarExercicio(i, 'cargaKg', Number(e.target.value))} />
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="link-adicionar-exercicio"
            onClick={() => setExercicios((atual) => [...atual, { ...EXERCICIO_VAZIO }])}
          >
            <Plus size={16} /> Adicionar exercício
          </button>

          <button className="botao-primario" type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar Treino'}
          </button>
        </form>
      </div>
    </div>
  );
}
