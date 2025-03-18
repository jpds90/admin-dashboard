import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';

const NoticiaPage = () => {
  const { id } = useParams(); // Obter o ID da notícia da URL
  const [noticia, setNoticia] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro

  useEffect(() => {
    // Buscar notícia do backend usando o ID
    axios.get(`/noticias/${id}`)
      .then(response => {
        setNoticia(response.data);
        setLoading(false); // Marcar como carregado
      })
      .catch(error => {
        setError("Erro ao carregar notícia");
        setLoading(false); // Marcar como carregado, mesmo em caso de erro
        console.error("Erro ao carregar notícia", error);
      });
  }, [id]);

  if (loading) {
    return <div>Carregando...</div>; // Exibe durante o carregamento
  }

  if (error) {
    return <div>{error}</div>; // Exibe mensagem de erro, caso ocorra
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-4xl font-bold mb-4">{noticia.titulo}</h1>
      <p className="text-gray-500 mb-5">
        {new Date(noticia.data_publicacao).toLocaleDateString('pt-BR')} {/* Formatação da data */}
      </p>

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
