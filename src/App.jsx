import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
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

// Páginas do Painel
function Dashboard() {
  return <h2 className="p-5">Bem-vindo ao painel de administração</h2>;
}

function News() {
  return <h2 className="p-5">Gerenciar Notícias</h2>;
}

function Store() {
  return <h2 className="p-5">Gerenciar Loja</h2>;
}

function Matches() {
  return <h2 className="p-5">Gerenciar Jogos</h2>;
}

function Players() {
  return <h2 className="p-5">Gerenciar Jogadores</h2>;
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
              <Route path="/news" element={<News />} />
              <Route path="/store" element={<Store />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/players" element={<Players />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
