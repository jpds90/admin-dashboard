import { useState, useEffect } from "react";
import UploadImage from "../components/UploadImage"; // Importando o componente

export default function Adminhistoria() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [historia, sethistoria] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState(null); // Guarda a Historia que está sendo editada

  // 🔄 Buscar Historia ao carregar a página
  useEffect(() => {
    fetchhistoria();
  }, []);

  const fetchhistoria = async () => {
    const response = await fetch("https://backendsafor.onrender.com/historia");
    const data = await response.json();
    sethistoria(data);
  };

  // 📝 Cadastrar ou editar Historia
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editando
      ? `https://backendsafor.onrender.com/historia/${editando.id}`
      : "https://backendsafor.onrender.com/historia";

    const method = editando ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, conteudo, imagem_url: imagemUrl }),
    });

    if (response.ok) {
      setMensagem(editando ? "Historia atualizada com sucesso!" : "Historia cadastrada com sucesso!");
      setTitulo("");
      setConteudo("");
      setImagemUrl("");
      setEditando(null);
      fetchhistoria(); // Atualiza a lista
    } else {
      setMensagem("Erro ao salvar Historia.");
    }
  };

  // 🖊️ Preencher formulário para edição
  const handleEdit = (historia) => {
    setEditando(historia);
    setTitulo(historia.titulo);
    setConteudo(historia.conteudo);
    setImagemUrl(historia.imagem_url);
  };

  // ❌ Excluir Historia
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta Historia?")) return;

    const response = await fetch(`https://backendsafor.onrender.com/historia/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setMensagem("Historia excluída com sucesso!");
      fetchhistoria();
    } else {
      setMensagem("Erro ao excluir Historia.");
    }
  };

  // 🗑️ Excluir apenas a imagem
  const handleDeleteImage = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover a imagem?")) return;

    const response = await fetch(`https://backendsafor.onrender.com/historia/${id}/remover-imagem`, {
      method: "PUT",
    });

    if (response.ok) {
      setMensagem("Imagem removida com sucesso!");
      fetchhistoria();
    } else {
      setMensagem("Erro ao remover imagem.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{editando ? "Editar Historia" : "Cadastrar Historia"}</h1>
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

        {imagemUrl && (
          <div className="relative">
            <img src={imagemUrl} alt="Pré-visualização" className="mt-2 w-40 rounded" />
            <button
              onClick={() => setImagemUrl("")}
              className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded"
            >
              X
            </button>
          </div>
        )}

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editando ? "Atualizar" : "Cadastrar"}
        </button>

        {editando && (
          <button
            onClick={() => {
              setEditando(null);
              setTitulo("");
              setConteudo("");
              setImagemUrl("");
            }}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* 📋 Lista de Historia Cadastradas */}
      <h2 className="text-xl font-bold mt-6">Historia Cadastradas</h2>
      <ul className="mt-4 space-y-4">
        {historia.map((historia) => (
          <li key={historia.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold">{historia.titulo}</h3>
              <p className="text-gray-600">{historia.conteudo}</p>
              {historia.imagem_small && (
                <div className="relative">
                  <img src={historia.imagem_small} alt="Imagem da Historia" className="mt-2 w-40 rounded" />
                  <button
                    onClick={() => handleDeleteImage(historia.id)}
                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded"
                  >
                    X
                  </button>
                </div>
              )}
              <p className="text-xs text-gray-400">
                Publicado em: {new Date(historia.data_publicacao).toLocaleDateString()}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(historia)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(historia.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
