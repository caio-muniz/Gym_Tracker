import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, X, LogOut } from 'lucide-react';
import { buscarPerfil, atualizarPerfil as salvarPerfil, limparSessao } from '../api/api';
import '../styles/perfil.css';

//Tela de perfil de identificação do usuário (estatísticas gerais)
export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [erro, setErro] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const navegar = useNavigate();

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    buscarPerfil()
      .then(setPerfil)
      .catch((e) => setErro(e.message));
  }

  function handleSair() {
    limparSessao();
    navegar('/login');
  }

  if (erro) {
    return (
      <div className="pagina">
        <div className="estado-vazio">Não foi possível carregar o perfil.<br /><small>{erro}</small></div>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="pagina">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="pagina">
      <button className="perfil-card-usuario" style={{ width: '100%' }} onClick={() => setModalAberto(true)}>
        <div className="perfil-avatar">
          <UserIcon size={32} />
        </div>
        <div className="perfil-nome">{perfil.nome}</div>
        <div className="perfil-editar-dica">Toque para editar</div>
      </button>

      <div className="perfil-stats-grid">
        <div className="perfil-stat-card">
          <div className="perfil-stat-valor">{perfil.treinosTotais}</div>
          <div className="perfil-stat-rotulo">Treinos Totais</div>
        </div>
        <div className="perfil-stat-card">
          <div className="perfil-stat-valor">{Math.round(perfil.volumeTotalKg)}</div>
          <div className="perfil-stat-rotulo">Volume Total (kg)</div>
        </div>
      </div>

      <p className="conquistas-titulo">Todas as Conquistas</p>
      {perfil.conquistas.map((c) => (
        <div className={`conquista-item ${c.desbloqueada ? '' : 'bloqueada'}`} key={c.codigo}>
          <div className="conquista-icone">{c.icone}</div>
          <div>
            <div className="conquista-nome">{c.nome}</div>
            <div className="conquista-descricao">{c.descricao}</div>
          </div>
        </div>
      ))}

      <button className="botao-registrar-corpo" onClick={handleSair} style={{ marginTop: 20, color: '#f87171' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center', width: '100%' }}>
          <LogOut size={16} /> Sair da conta
        </span>
      </button>

      {modalAberto && (
        <ModalEditarPerfil
          perfilAtual={perfil}
          onFechar={() => setModalAberto(false)}
          onSalvo={() => {
            setModalAberto(false);
            carregar();
          }}
        />
      )}
    </div>
  );
}

function ModalEditarPerfil({ perfilAtual, onFechar, onSalvo }) {
  const [nome, setNome] = useState(perfilAtual.nome);
  const [salvando, setSalvando] = useState(false);

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    try {
      await salvarPerfil({ nome });
      onSalvo();
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
        <div className="pagina-cabecalho">
          <h2 className="pagina-titulo" style={{ fontSize: 20, marginBottom: 0 }}>Editar Perfil</h2>
          <button className="botao-icone" onClick={onFechar}><X size={20} /></button>
        </div>
        <form onSubmit={handleSalvar}>
          <div className="campo-form">
            <label>Nome</label>
            <input value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <button className="botao-primario" type="submit" disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </form>
      </div>
    </div>
  );
}
