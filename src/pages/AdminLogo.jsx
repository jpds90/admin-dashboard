import { useState } from "react";

export default function AdminLogo() {
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
    formData.append("logo", file); // Envia o arquivo como logo
    formData.append("field", "logo"); // Indica que é um logo

    try {
      const response = await fetch("https://backendsafor.onrender.com/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload. Tente novamente.");
      }

      const data = await response.json();
      setImageUrl(data.original); // Atualiza o estado com a URL da imagem
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-xl font-bold mb-4">Upload da Logo</h2>
      <input type="file" accept="image/*" onChange={handleUpload} className="mb-2" />

      {uploading && <p className="text-blue-500">Enviando logo...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {imageUrl && (
        <div className="mt-4">
          <p>Logo enviada:</p>
          <img src={imageUrl} alt="Logo enviada" className="mt-2 w-32 border rounded-lg" />
        </div>
      )}
    </div>
  );
}
