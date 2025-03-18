import { useState } from 'react';

export default function AdminNoticias() {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://backendsafor.onrender.com/noticias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, conteudo, imagem_url: imagemUrl }),

    });

    if (response.ok) {
      setMensagem('Notícia cadastrada com sucesso!');
      setTitulo('');
      setConteudo('');
      setImagemUrl('');
    } else {
      setMensagem('Erro ao cadastrar notícia.');
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
          className="w-full p-2 border"
          required
        />
        <textarea
          placeholder="Conteúdo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className="w-full p-2 border"
          required
        />
        <input
          type="text"
          placeholder="URL da Imagem (opcional)"
          value={imagemUrl}
          onChange={(e) => setImagemUrl(e.target.value)}
          className="w-full p-2 border"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
