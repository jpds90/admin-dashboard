import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import AdminNoticias from "./pages/AdminNoticias"; // Importando a página de Administração de Notícias
import NoticiaPage from "./pages/NoticiaPage"; // Importando a página de uma notícia
import Translate from "./components/Translate";
import AdminLogo from "./pages/AdminLogo"; // Importe o componente correto
import AdminBanners from "./pages/AdminBanners"; // Importe o componente correto
import { useState } from "react";

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
        <li className="mb-2 hover:bg-gray-700 p-2 rounded">
          <Link to="/upload-logo">Upload de Logo</Link>
        </li>
        <li className="mb-2 hover:bg-gray-700 p-2 rounded">
          <Link to="/upload-banners">Upload de Banners</Link>
        </li>
      </ul>
    </div>
  );
}

// Componente Header
function Header() {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Dashboard Admin</h1>
      <Translate /> {/* Seletor de idioma à direita */}
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
        {/* Cabeçalho com seletor de idioma à direita */}
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
              <Route path="/news/:id" element={<NoticiaPage />} /> {/* Rota para exibir uma notícia */}
              <Route path="/store" element={<h2 className='p-5'>Gerenciar Loja</h2>} />
              <Route path="/matches" element={<h2 className='p-5'>Gerenciar Jogos</h2>} />
              <Route path="/players" element={<h2 className='p-5'>Gerenciar Jogadores</h2>} />
              <Route path="/upload-logo" element={<AdminLogo />} /> {/* Nova rota adicionada */}
              <Route path="/upload-banners" element={<AdminBanners />} /> {/* Nova rota adicionada */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
