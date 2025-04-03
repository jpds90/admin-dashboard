import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminNoticias from "./pages/AdminNoticias"; 
import NoticiaPage from "./pages/NoticiaPage"; 
import Translate from "./components/Translate";
import AdminLogo from "./pages/AdminLogo"; 
import AdminBanners from "./pages/AdminBanners"; 

// Definição da URL do backend
const API_URL = "https://backendsafor.onrender.com"; // Altere se necessário

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
function Header({ isApiEnabled, toggleApi }) {
  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">Dashboard Admin</h1>
      <div className="flex items-center gap-4">
        <Translate /> {/* Seletor de idioma */}
        <button
          className={`px-4 py-2 rounded ${
            isApiEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={toggleApi}
        >
          {isApiEnabled ? "Desativar API" : "Ativar API"}
        </button>
      </div>
    </div>
  );
}

// Página principal do Dashboard
function Dashboard() {
  return <h2 className="p-5">Bem-vindo ao painel de administração</h2>;
}

// Componente principal App
export default function App() {
  const [isApiEnabled, setIsApiEnabled] = useState(true);

  // Buscar estado inicial da API no backend
  useEffect(() => {
    fetch(`${API_URL}/api-status`)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar status da API");
        return res.json();
      })
      .then((data) => setIsApiEnabled(data.apiEnabled))
      .catch((error) => console.error("Erro ao buscar status da API:", error));
  }, []);

  // Função para ativar/desativar a API
  function toggleApi() {
    const newState = !isApiEnabled;
    setIsApiEnabled(newState);

    fetch(`${API_URL}/toggle-api`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: newState }),
    }).catch((error) => console.error("Erro ao atualizar status da API:", error));
  }

  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Cabeçalho com seletor de idioma e botão de ativação/desativação da API */}
        <Header isApiEnabled={isApiEnabled} toggleApi={toggleApi} />

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
              <Route path="/news/:id" element={<NoticiaPage />} />
              <Route path="/store" element={<h2 className="p-5">Gerenciar Loja</h2>} />
              <Route path="/matches" element={<h2 className="p-5">Gerenciar Jogos</h2>} />
              <Route path="/players" element={<h2 className="p-5">Gerenciar Jogadores</h2>} />
              <Route path="/upload-logo" element={<AdminLogo />} />
              <Route path="/upload-banners" element={<AdminBanners />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}
