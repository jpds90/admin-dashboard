import { useState, useEffect } from "react";
import UploadImage from "../components/UploadImage"; // Importando o componente

export default function AdminNoticias() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [noticias, setNoticias] = useState([]);

  // 🔄 Buscar notícias ao carregar a página
  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    const response = await fetch("https://backendsafor.onrender.com/noticias");
    const data = await response.json();
    setNoticias(data);
  };

  // 📝 Cadastrar nova notícia
  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://backendsafor.onrender.com/noticias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, conteudo, imagem_url: imagemUrl }),
    });

    if (response.ok) {
      setMensagem("Notícia cadastrada com sucesso!");
      setTitulo("");
      setConteudo("");
      setImagemUrl("");
      fetchNoticias(); // Atualiza a lista após cadastro
    } else {
      setMensagem("Erro ao cadastrar notícia.");
    }
  };

  // ❌ Excluir notícia
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta notícia?")) return;

    const response = await fetch(`https://backendsafor.onrender.com/noticias/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setMensagem("Notícia excluída com sucesso!");
      fetchNoticias(); // Atualiza a lista após exclusão
    } else {
      setMensagem("Erro ao excluir notícia.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cadastrar Notícia</h1>
      {mensagem && <p className="text-green-600">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        <textarea
          placeholder="Conteúdo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
        
        {/* Componente de Upload */}
        <UploadImage setImagemUrl={setImagemUrl} />
        
        {imagemUrl && <img src={imagemUrl} alt="Pré-visualização" className="mt-2 w-40 rounded" />}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Cadastrar
        </button>
      </form>

      {/* 📋 Lista de Notícias Cadastradas */}
      <h2 className="text-xl font-bold mt-6">Notícias Cadastradas</h2>
      <ul className="mt-4 space-y-4">
        {noticias.map((noticia) => (
          <li key={noticia.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{noticia.titulo}</h3>
              <p className="text-gray-600">{noticia.conteudo}</p>
              {noticia.imagem_small && (
                <img src={noticia.imagem_small} alt="Imagem da notícia" className="mt-2 w-40 rounded" />
              )}
              <p className="text-xs text-gray-400">Publicado em: {new Date(noticia.data_publicacao).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => handleDelete(noticia.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
