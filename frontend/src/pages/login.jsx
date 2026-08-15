import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { login, registrar, salvarSessao } from '../api/api';
import '../styles/auth.css';

//tela de login e cadastro
export default function Login() {
  const [modoCadastro, setModoCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const navegar = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      if (modoCadastro) {
        // Cria o usuário e ja faz o login automaticamente
        await registrar(nome, email, senha);
        const resposta = await login(email, senha);
        salvarSessao(resposta);
      } else {
        const resposta = await login(email, senha);
        salvarSessao(resposta);
      }
      navegar('/');
    } catch (e) {
      setErro(e.message || 'Não foi possível continuar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="auth-tela">
      <div className="auth-logo">
        <div className="auth-logo-icone">
          <Dumbbell size={28} />
        </div>
        <h1 className="auth-titulo">Gym Tracker</h1>
        <p className="auth-subtitulo">
          {modoCadastro ? 'Crie sua conta para começar a treinar' : 'Entre para ver seus treinos'}
        </p>
      </div>

      <div className="auth-card">
        {erro && <div className="auth-erro">{erro}</div>}

        <form onSubmit={handleSubmit}>
          {modoCadastro && (
            <div className="campo-form">
              <label>Nome</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required />
            </div>
          )}

          <div className="campo-form">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="campo-form">
            <label>Senha</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button className="botao-primario" type="submit" disabled={carregando} style={{ marginTop: 8 }}>
            {carregando ? 'Aguarde...' : modoCadastro ? 'Criar conta' : 'Entrar'}
          </button>
        </form>
      </div>

      <div className="auth-alternar">
        {modoCadastro ? (
          <>
            Já tem uma conta?{' '}
            <button onClick={() => { setModoCadastro(false); setErro(''); }}>Entrar</button>
          </>
        ) : (
          <>
            Ainda não tem conta?{' '}
            <button onClick={() => { setModoCadastro(true); setErro(''); }}>Criar conta</button>
          </>
        )}
      </div>
    </div>
  );
}
