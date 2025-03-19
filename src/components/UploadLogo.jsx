import { useState } from "react";

export default function UploadLogo() {
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("logo", file); // Deve ser "logo"

    try {
      const response = await fetch("https://backendsafor.onrender.com/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Erro no upload. Tente novamente.");

      const data = await response.json();
      setImageUrl(data.logo); // Ajustado para corresponder ao backend
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
      {imageUrl && <img src={imageUrl} alt="Logo enviada" className="mt-4 w-32 border rounded-lg" />}
    </div>
  );
}
