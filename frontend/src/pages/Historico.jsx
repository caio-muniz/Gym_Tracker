import { useEffect, useState } from 'react';
import { listarHistorico } from '../api/api';
import '../styles/historico.css';

export default function Historico() {
  const [historico, setHistorico] = useState(null);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    listarHistorico()
      .then(setHistorico)
      .catch((e) => setErro(e.message));
  }, []);

  return (
    <div className="pagina">
      <h1 className="pagina-titulo">Histórico</h1>

      {erro ? (
        <div className="estado-vazio">Não foi possível carregar o histórico.<br /><small>{erro}</small></div>
      ) : historico === null ? (
        <div className="spinner" />
      ) : historico.length === 0 ? (
        <div className="estado-vazio">Nenhum treino realizado ainda.</div>
      ) : (
        historico.map((h) => (
          <div className="historico-card" key={h.id} style={{ '--cor-treino': h.corTreino }}>
            <div>
              <div className="historico-card-nome">{h.nomeTreino}</div>
              <div className="historico-card-data">{formatarData(h.dataExecucao)}</div>
            </div>
            <div className="historico-card-metricas">
              <div className="historico-card-volume">{Math.round(h.volumeTotalKg ?? 0)} kg</div>
              <div>{h.series.length} séries{h.duracaoSegundos ? ` · ${Math.round(h.duracaoSegundos / 60)} min` : ''}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function formatarData(isoString) {
  const data = new Date(isoString);
  return data.toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
