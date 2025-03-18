import { useState } from "react";

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState(""); // Para exibir a imagem depois do upload
  const [uploading, setUploading] = useState(false); // Estado para indicar upload em andamento
  const [error, setError] = useState(null); // Estado para mensagens de erro

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return; // Se nenhum arquivo foi selecionado, sai da função

    if (!file.type.startsWith("image/")) {
      setError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("imagem", file); // Nome do campo deve coincidir com o backend

    try {
      const response = await fetch("https://admin-dashboard-aii9.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload. Tente novamente.");
      }

      const data = await response.json();
      setImageUrl(data.imageUrl); // Atualiza o estado com a URL da imagem
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4">
      <input type="file" accept="image/*" onChange={handleUpload} className="mb-2" />
      
      {uploading && <p className="text-blue-500">Enviando imagem...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {imageUrl && (
        <img src={imageUrl} alt="Imagem enviada" className="mt-4 w-64 border rounded-lg" />
      )}
    </div>
  );
}
