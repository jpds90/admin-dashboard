import { useState } from "react";

export default function Uploadbanners() {
  const [imageUrl, setImageUrl] = useState(""); // URL da banners após o upload
  const [uploading, setUploading] = useState(false); // Indica se está enviando
  const [error, setError] = useState(null); // Armazena erro, se houver

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return; // Nenhum arquivo selecionado

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }

    setUploading(true);
    setError(null);
    setImageUrl(""); // Limpa a imagem anterior enquanto faz o upload

    const formData = new FormData();
    formData.append("banners", file); // Deve ser "banners", igual ao backend

    try {
      const response = await fetch("https://backendsafor.onrender.com/upload-banners", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro no upload. Tente novamente.");

      const data = await response.json();
      setImageUrl(data.banners); // Atualiza a banners com a URL retornada
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Upload da banners</h2>
      
      <input type="file" accept="image/*" onChange={handleUpload} className="mb-2" />
      
      {uploading && <p className="text-blue-500">Enviando banners...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {imageUrl && (
        <div className="mt-4">
          <p>banners enviada:</p>
          <img 
            src={imageUrl} 
            alt="banners enviada" 
            className="mt-2 w-48 h-48 object-contain border rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
