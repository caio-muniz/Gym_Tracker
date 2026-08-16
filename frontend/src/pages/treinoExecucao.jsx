import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { buscarTreino, registrarTreinoConcluido } from '../api/api';
import '../styles/execucao.css';

//Tela de execução de um treino aberta ao tocar em "Iniciar Treino" (Home ou Treinos).
//Para cada exercício, o usuário confirma reps/carga de cada série planejada.
export default function TreinoExecucao() {
  const { id } = useParams();
  const navegar = useNavigate();

  const [treino, setTreino] = useState(null);
  const [seriesPreenchidas, setSeriesPreenchidas] = useState({}); // chave: "exercicioId-numeroSerie"
  const [segundosDecorridos, setSegundosDecorridos] = useState(0);
  const [finalizando, setFinalizando] = useState(false);
  const intervaloRef = useRef(null);

  useEffect(() => {
    buscarTreino(id).then(setTreino);

    // Cronômetro simples: soma 1 segundo a cada tick, desde que a tela foi aberta
    intervaloRef.current = setInterval(() => setSegundosDecorridos((s) => s + 1), 1000);
    return () => clearInterval(intervaloRef.current);
  }, [id]);

  if (!treino) {
    return (
      <div className="pagina">
        <div className="spinner" />
      </div>
    );
  }

  const chave = (exercicioId, numeroSerie) => `${exercicioId}-${numeroSerie}`;

  function atualizarSerie(exercicioId, numeroSerie, campo, valor) {
    setSeriesPreenchidas((atual) => ({
      ...atual,
      [chave(exercicioId, numeroSerie)]: {
        ...atual[chave(exercicioId, numeroSerie)],
        [campo]: valor,
      },
    }));
  }

  function alternarConcluida(exercicioId, numeroSerie, repsPadrao, cargaPadrao) {
    const atual = seriesPreenchidas[chave(exercicioId, numeroSerie)] || {
      repeticoes: repsPadrao,
      cargaKg: cargaPadrao,
    };
    atualizarSerie(exercicioId, numeroSerie, 'concluida', !atual.concluida);
  }

  const totalSeriesPlanejadas = treino.exercicios.reduce((soma, ex) => soma + ex.series, 0);
  const totalSeriesConcluidas = Object.values(seriesPreenchidas).filter((s) => s?.concluida).length;

  async function handleFinalizar() {
    // Monta a lista apenas com as séries marcadas como concluídas
    const series = [];
    treino.exercicios.forEach((ex) => {
      for (let n = 1; n <= ex.series; n++) {
        const dados = seriesPreenchidas[chave(ex.id, n)];
        if (dados?.concluida) {
          series.push({
            exercicioNome: ex.nome,
            numeroSerie: n,
            repeticoes: Number(dados.repeticoes ?? ex.repeticoes),
            cargaKg: Number(dados.cargaKg ?? ex.cargaKg),
          });
        }
      }
    });

    if (series.length === 0) {
      alert('Marque ao menos uma série como concluída antes de finalizar.');
      return;
    }

    setFinalizando(true);
    try {
      await registrarTreinoConcluido({
        treinoId: treino.id,
        nomeTreino: treino.nome,
        corTreino: treino.cor,
        duracaoSegundos: segundosDecorridos,
        series,
      });
      navegar('/historico');
    } finally {
      setFinalizando(false);
    }
  }

  const minutos = String(Math.floor(segundosDecorridos / 60)).padStart(2, '0');
  const segundos = String(segundosDecorridos % 60).padStart(2, '0');

  return (
    <div className="pagina" style={{ paddingBottom: 110 }}>
      <div className="execucao-topo">
        <button className="botao-icone" onClick={() => navegar(-1)}><ArrowLeft size={20} /></button>
        <h1 className="pagina-titulo" style={{ marginBottom: 0, fontSize: 20 }}>{treino.nome}</h1>
      </div>
      <p style={{ color: 'var(--cor-texto-secundario)', fontSize: 13, marginBottom: 16 }}>
        {totalSeriesConcluidas}/{totalSeriesPlanejadas} séries concluídas
      </p>

      {treino.exercicios.map((ex) => (
        <div className="execucao-exercicio-card" key={ex.id}>
          <div className="execucao-exercicio-nome">{ex.nome}</div>
          <div className="execucao-exercicio-meta">Meta: {ex.series}×{ex.repeticoes} · {ex.cargaKg}kg</div>

          {Array.from({ length: ex.series }, (_, i) => i + 1).map((numeroSerie) => {
            const dados = seriesPreenchidas[chave(ex.id, numeroSerie)] || {};
            const concluida = !!dados.concluida;
            return (
              <div className={`execucao-serie-linha ${concluida ? 'concluida' : ''}`} key={numeroSerie}>
                <div className="execucao-serie-numero">{numeroSerie}</div>
                <div className="execucao-serie-input-grupo">
                  <input
                    type="number"
                    placeholder={String(ex.repeticoes)}
                    value={dados.repeticoes ?? ''}
                    onChange={(e) => atualizarSerie(ex.id, numeroSerie, 'repeticoes', e.target.value)}
                  />
                  <span>reps</span>
                </div>
                <div className="execucao-serie-input-grupo">
                  <input
                    type="number"
                    step="0.5"
                    placeholder={String(ex.cargaKg)}
                    value={dados.cargaKg ?? ''}
                    onChange={(e) => atualizarSerie(ex.id, numeroSerie, 'cargaKg', e.target.value)}
                  />
                  <span>kg</span>
                </div>
                <button
                  className="execucao-serie-check"
                  onClick={() => alternarConcluida(ex.id, numeroSerie, ex.repeticoes, ex.cargaKg)}
                  aria-label="Marcar série como concluída"
                >
                  <Check size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ))}

      <div className="execucao-rodape">
        <button className="botao-primario" onClick={handleFinalizar} disabled={finalizando}>
          {finalizando ? 'Salvando...' : `Concluir Treino · ${minutos}:${segundos}`}
        </button>
      </div>
    </div>
  );
}
