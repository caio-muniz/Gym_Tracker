import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import Home from './pages/Home';
import Treinos from './pages/Treinos';
import TreinoExecucao from './pages/TreinoExecucao';
import Historico from './pages/Historico';
import Progresso from './pages/Progresso';
import Perfil from './pages/Perfil';
import { estaAutenticado } from './api/api';
import './styles/app.css';


export default function App() {
  return (
    <HashRouter>
      <ConteudoApp />
    </HashRouter>
  );
}

// Protege uma rota: se não houver token JWT salvo, redireciona para /login
function RotaProtegida({ children }) {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function ConteudoApp() {
  const location = useLocation();

  // Nas telas de Login e de execução de treino, a bottom nav fica escondida:
  // a de login não precisa dela, e a de execução usa a mesma área fixa para o botão "Concluir".
  const emExecucaoDeTreino = /^\/treinos\/[^/]+\/executar$/.test(location.pathname);
  const naTelaDeLogin = location.pathname === '/login';

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<RotaProtegida><Home /></RotaProtegida>} />
        <Route path="/treinos" element={<RotaProtegida><Treinos /></RotaProtegida>} />
        <Route path="/treinos/:id/executar" element={<RotaProtegida><TreinoExecucao /></RotaProtegida>} />
        <Route path="/historico" element={<RotaProtegida><Historico /></RotaProtegida>} />
        <Route path="/progresso" element={<RotaProtegida><Progresso /></RotaProtegida>} />
        <Route path="/perfil" element={<RotaProtegida><Perfil /></RotaProtegida>} />
      </Routes>
      {!emExecucaoDeTreino && !naTelaDeLogin && <BottomNav />}
    </div>
  );
}
