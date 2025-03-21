import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const NoticiaPage = () => {
  const { id } = useParams(); // Obter o ID da notícia da URL
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    // Usando Fetch para buscar a notícia pelo ID
    fetch(`/noticias/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar a notícia');
        }
        return response.json();
      })
      .then(data => setNoticia(data))
      .catch(error => {
        console.error("Erro ao carregar notícia:", error);
      });
  }, [id]);

  if (!noticia) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-4xl font-bold mb-4">{noticia.titulo}</h1>
      <p className="text-gray-500 mb-5">{new Date(noticia.data_publicacao).toLocaleDateString()}</p>

      <div className="mb-8">
        <img src={noticia.imagem_url} alt="Imagem da notícia" className="w-full h-auto" />
      </div>

      <div className="prose">
        <p>{noticia.conteudo}</p>
      </div>
    </div>
  );
};

export default NoticiaPage;
