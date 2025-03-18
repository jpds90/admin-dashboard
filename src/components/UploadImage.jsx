import { useState } from "react";

export default function UploadImage() {
  const [imageUrl, setImageUrl] = useState(""); // Para exibir a imagem depois do upload

  const handleUpload = async (e) => {
    const file = e.target.files[0]; // Pega o arquivo selecionado
    const formData = new FormData();
    formData.append("imagem", file); // Envia a imagem para o backend

    // Faz o upload para o servidor
    const response = await fetch("https://seuservidor.com/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setImageUrl(data.imageUrl); // Atualiza o estado com a URL da imagem
  };

  return (
    <div className="p-4">
      <input type="file" onChange={handleUpload} />
      {imageUrl && <img src={imageUrl} alt="Imagem enviada" className="mt-4 w-64" />}
    </div>
  );
}
