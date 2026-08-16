// Card pequeno usado na Home para exibir uma estatística com ícone, número e rótulo

export default function StatCard({ icone, valor, rotulo, corIcone }) {
  return (
    <div className="stat-card">
      <div className="stat-card-icone" style={{ color: corIcone }}>
        {icone}
      </div>
      <div className="stat-card-valor">{valor}</div>
      <div className="stat-card-rotulo">{rotulo}</div>
    </div>
  );
}
