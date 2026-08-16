import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import {
  listarExerciciosDisponiveis,
  buscarEvolucaoExercicio,
  listarRegistrosCorpo,
  registrarCorpo,
} from '../api/api';
import '../styles/progresso.css';

export default function Progresso() {
  const [aba, setAba] = useState('exercicios');

  return (
    <div className="pagina">
      <h1 className="pagina-titulo">Progresso</h1>

      <div className="abas-grupo">
        <button className={`aba-item ${aba === 'exercicios' ? 'ativa' : ''}`} onClick={() => setAba('exercicios')}>
          Exercícios
        </button>
        <button className={`aba-item ${aba === 'corpo' ? 'ativa' : ''}`} onClick={() => setAba('corpo')}>
          Corpo
        </button>
      </div>

      {aba === 'exercicios' ? <AbaExercicios /> : <AbaCorpo />}
    </div>
  );
}

function AbaExercicios() {
  const [nomes, setNomes] = useState([]);
  const [selecionado, setSelecionado] = useState('');
  const [pontos, setPontos] = useState(null);

  useEffect(() => {
    listarExerciciosDisponiveis().then(setNomes);
  }, []);

  useEffect(() => {
    if (!selecionado) {
      setPontos(null);
      return;
    }
    buscarEvolucaoExercicio(selecionado).then(setPontos);
  }, [selecionado]);

  const dadosGrafico = (pontos ?? []).map((p) => ({
    data: new Date(p.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    carga: p.cargaMaximaKg,
  }));

  const cargaInicial = dadosGrafico[0]?.carga;
  const cargaAtual = dadosGrafico[dadosGrafico.length - 1]?.carga;
  const evolucaoPercentual =
    cargaInicial && cargaAtual ? (((cargaAtual - cargaInicial) / cargaInicial) * 100).toFixed(1) : null;

  return (
    <>
      <div className="campo-form seletor-exercicio">
        <select value={selecionado} onChange={(e) => setSelecionado(e.target.value)}>
          <option value="">Selecione um exercício</option>
          {nomes.map((nome) => (
            <option key={nome} value={nome}>{nome}</option>
          ))}
        </select>
      </div>

      {!selecionado ? (
        <div className="estado-vazio">Escolha um exercício acima para ver sua evolução de carga.</div>
      ) : !pontos || pontos.length === 0 ? (
        <div className="estado-vazio">Ainda não há registros desse exercício no histórico.</div>
      ) : (
        <>
          <div className="resumo-progresso">
            <div className="resumo-progresso-item">
              <div className="resumo-progresso-valor">{cargaAtual}kg</div>
              <div className="resumo-progresso-rotulo">Carga atual</div>
            </div>
            <div className="resumo-progresso-item">
              <div className="resumo-progresso-valor">{evolucaoPercentual > 0 ? '+' : ''}{evolucaoPercentual}%</div>
              <div className="resumo-progresso-rotulo">Evolução</div>
            </div>
          </div>

          <div className="grafico-card">
            <p className="grafico-card-titulo">Carga máxima por sessão (kg)</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dadosGrafico} margin={{ top: 4, right: 16, left: -16, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2129" />
                <XAxis dataKey="data" stroke="#5c6270" fontSize={11} />
                <YAxis stroke="#5c6270" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#14151c', border: '1px solid #1f2129', borderRadius: 8 }} />
                <Line type="monotone" dataKey="carga" stroke="#a3e635" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </>
  );
}

function AbaCorpo() {
  const [registros, setRegistros] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [peso, setPeso] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    listarRegistrosCorpo().then(setRegistros);
  }

  async function handleRegistrar(e) {
    e.preventDefault();
    if (!peso) return;
    setSalvando(true);
    try {
      await registrarCorpo({ data: new Date().toISOString().slice(0, 10), pesoKg: Number(peso) });
      setPeso('');
      setMostrarForm(false);
      carregar();
    } finally {
      setSalvando(false);
    }
  }

  const dadosGrafico = (registros ?? [])
    .filter((r) => r.pesoKg != null)
    .map((r) => ({
      data: new Date(r.data).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      peso: r.pesoKg,
    }));

  return (
    <>
      {!registros ? (
        <div className="spinner" />
      ) : dadosGrafico.length === 0 ? (
        <div className="estado-vazio">Nenhum registro de peso ainda.</div>
      ) : (
        <div className="grafico-card">
          <p className="grafico-card-titulo">Peso corporal (kg)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dadosGrafico} margin={{ top: 4, right: 16, left: -16, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2129" />
              <XAxis dataKey="data" stroke="#5c6270" fontSize={11} />
              <YAxis stroke="#5c6270" fontSize={11} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip contentStyle={{ backgroundColor: '#14151c', border: '1px solid #1f2129', borderRadius: 8 }} />
              <Line type="monotone" dataKey="peso" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {mostrarForm ? (
        <form className="campo-form" onSubmit={handleRegistrar} style={{ display: 'flex', gap: 8 }}>
          <input
            type="number"
            step="0.1"
            placeholder="Peso de hoje (kg)"
            value={peso}
            onChange={(e) => setPeso(e.target.value)}
            autoFocus
            style={{ flex: 1 }}
          />
          <button className="botao-novo" type="submit" disabled={salvando}>
            {salvando ? '...' : 'Salvar'}
          </button>
        </form>
      ) : (
        <button className="botao-registrar-corpo" onClick={() => setMostrarForm(true)}>
          + Registrar peso de hoje
        </button>
      )}
    </>
  );
}
