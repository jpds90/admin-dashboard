import { useState, useEffect } from "react";

export default function AdminBanners() {
  const [imageUrl, setImageUrl] = useState(""); // Para exibir a imagem depois do upload
  const [uploading, setUploading] = useState(false); // Estado para indicar upload em andamento
  const [error, setError] = useState(null); // Estado para mensagens de erro
  const [banners, setBanners] = useState([]); // Lista de banners salvos

  // Buscar banners salvos
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch("https://backendsafor.onrender.com/api/banners");
        if (!response.ok) {
          throw new Error("Erro ao buscar banners");
        }
        const data = await response.json();
        setBanners(data); // Atualiza a lista de banners
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBanners();
  }, []); // Executa apenas na primeira renderização

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("banners", file);

    try {
      const response = await fetch("https://backendsafor.onrender.com/upload-banners", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload. Tente novamente.");
      }

      const data = await response.json();
      setImageUrl(data.banners); // Atualiza o estado com a URL do novo banner
      setBanners((prev) => [data, ...prev]); // Atualiza a lista de banners
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // Função para excluir um banner
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este banner?")) return;

    try {
      const response = await fetch(`https://backendsafor.onrender.com/api/banners/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir o banner");
      }

      setBanners(banners.filter((banner) => banner.id !== id)); // Atualiza a lista
      alert("Banner excluído com sucesso!");
    } catch (err) {
      alert("Erro ao excluir o banner.");
      console.error("Erro ao excluir:", err);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Upload de Banner</h2>
      <input type="file" accept="image/*" onChange={handleUpload} className="mb-2" />

      {uploading && <p className="text-blue-500">Enviando banner...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {imageUrl && (
        <div className="mt-4">
          <p>Banner enviado:</p>
          <img src={imageUrl} alt="Banner enviado" className="mt-2 w-32 border rounded-lg" />
        </div>
      )}

      <h3 className="text-lg font-bold mt-6">Banners Salvos</h3>
      <div className="grid grid-cols-3 gap-4 mt-2">
        {banners.map((banner) => (
          <div key={banner.id} className="relative p-2 border rounded-lg shadow-md">
            <img src={banner.banners_url} alt={`Banner ${banner.id}`} className="w-32 border rounded-lg" />
            <p className="text-sm text-gray-600 mt-1">ID: {banner.id}</p>
            <button
              onClick={() => handleDelete(banner.id)}
              className="mt-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
