import { NavLink } from 'react-router-dom';
import { Home, Dumbbell, Clock, BarChart3, User } from 'lucide-react';

//Barra de navegação inferior, fixa em todas as telas do app.
const ITENS = [
  { rota: '/', rotulo: 'Home', Icone: Home },
  { rota: '/treinos', rotulo: 'Treinos', Icone: Dumbbell },
  { rota: '/historico', rotulo: 'Histórico', Icone: Clock },
  { rota: '/progresso', rotulo: 'Progresso', Icone: BarChart3 },
  { rota: '/perfil', rotulo: 'Perfil', Icone: User },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      {ITENS.map(({ rota, rotulo, Icone }) => (
        <NavLink
          key={rota}
          to={rota}
          end={rota === '/'}
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'ativo' : ''}`}
        >
          <Icone strokeWidth={2.2} />
          <span>{rotulo}</span>
        </NavLink>
      ))}
    </nav>
  );
}
