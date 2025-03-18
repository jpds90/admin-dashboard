import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import AdminNoticias from "./pages/AdminNoticias"; // Importando a página de Notícias
import NoticiaPage from "./pages/NoticiaPage"; // Página de Notícia

// Componente Sidebar
function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5">
      <h2 className="text-xl font-bold mb-5">Admin Dashboard</h2>
      <ul>
        <li className="mb-2 hover:bg-gray-700 p-2 rounded">
          <Link to="/news">Notícias</Link>
        </li>
        <li className="mb-2 hover:bg-gray-700 p-2 rounded">
          <Link to="/store">Loja</Link>
        </li>
        <li className="mb-2 hover:bg-gray-700 p-2 rounded">
          <Link to="/matches">Jogos</Link>
        </li>
        <li className="mb-2 hover:bg-gray-700 p-2 rounded">
          <Link to="/players">Jogadores</Link>
        </li>
      </ul>
    </div>
  );
}

// Componente Header
function Header() {
  return (
    <div className="bg-gray-800 text-white p-4">
      <h1 className="text-xl">Dashboard Admin</h1>
    </div>
  );
}

// Página principal do Dashboard
function Dashboard() {
  return <h2 className="p-5">Bem-vindo ao painel de administração</h2>;
}

// Componente principal App
export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Cabeçalho */}
        <Header />
        
        <div className="flex flex-1">
          {/* Sidebar (visível apenas em telas grandes) */}
          <div className="hidden lg:block">
            <Sidebar />
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 p-5 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/news" element={<AdminNoticias />} />
              <Route path="/store" element={<h2 className='p-5'>Gerenciar Loja</h2>} />
              <Route path="/matches" element={<h2 className='p-5'>Gerenciar Jogos</h2>} />
              <Route path="/players" element={<h2 className='p-5'>Gerenciar Jogadores</h2>} />
              <Route path="/noticias/:id" element={<NoticiaPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
