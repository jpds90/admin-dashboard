require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "principal.html"));
});

// Configuração do CORS
app.use(cors({ origin: "*" }));
app.use(express.json());

// 🗄️ Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 📸 Configuração do Multer para upload de arquivos
const upload = multer({ dest: "uploads/" });

// ☁️ Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🚀 Criar uma nova notícia
app.post('/noticias', upload.single("imagem"), async (req, res) => {
  const { titulo, conteudo } = req.body;
  let imagem_url = null, imagem_large = null, imagem_small = null;

  try {
    if (!titulo || !conteudo) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "saforgandia",
      });

      imagem_url = uploadResult.secure_url;
      imagem_large = cloudinary.url(uploadResult.public_id, { width: 802, height: 461, crop: "fill" });
      imagem_small = cloudinary.url(uploadResult.public_id, { width: 351, height: 197, crop: "fill" });

      fs.unlinkSync(req.file.path);
    }

    const queryResult = await pool.query(
      `INSERT INTO saforgandia_noticias (titulo, conteudo, imagem_url, imagem_large, imagem_small) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, conteudo, imagem_url, imagem_large, imagem_small]
    );

    res.status(201).json({ message: 'Notícia criada com sucesso', noticia: queryResult.rows[0] });

  } catch (error) {
    console.error("Erro ao criar notícia:", error);
    res.status(500).json({ error: 'Erro ao criar notícia' });
  }
});

// 📜 Listar todas as notícias
app.get('/noticias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM saforgandia_noticias ORDER BY data_publicacao DESC');
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    res.status(500).json({ error: 'Erro ao buscar notícias' });
  }
});

// 🔍 Obter uma notícia por ID
app.get('/noticias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM saforgandia_noticias WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar notícia:", error);
    res.status(500).json({ error: 'Erro ao buscar notícia' });
  }
});

// ✏️ Atualizar uma notícia
app.put('/noticias/:id', upload.single("imagem"), async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo } = req.body;
  let imagem_url = null, imagem_large = null, imagem_small = null;

  try {
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "saforgandia",
      });

      imagem_url = uploadResult.secure_url;
      imagem_large = cloudinary.url(uploadResult.public_id, { width: 802, height: 461, crop: "fill" });
      imagem_small = cloudinary.url(uploadResult.public_id, { width: 351, height: 197, crop: "fill" });

      fs.unlinkSync(req.file.path);
    }

    const queryResult = await pool.query(
      `UPDATE saforgandia_noticias 
       SET titulo = $1, conteudo = $2, 
           imagem_url = COALESCE($3, imagem_url), 
           imagem_large = COALESCE($4, imagem_large), 
           imagem_small = COALESCE($5, imagem_small) 
       WHERE id = $6 RETURNING *`,
      [titulo, conteudo, imagem_url, imagem_large, imagem_small, id]
    );

    if (queryResult.rows.length === 0) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }

    res.json({ message: 'Notícia atualizada com sucesso', noticia: queryResult.rows[0] });

  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);
    res.status(500).json({ error: 'Erro ao atualizar notícia' });
  }
});

// ❌ Deletar uma notícia
app.delete('/noticias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM saforgandia_noticias WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }
    res.json({ message: 'Notícia deletada com sucesso' });
  } catch (error) {
    console.error("Erro ao deletar notícia:", error);
    res.status(500).json({ error: 'Erro ao deletar notícia' });
  }
});



// 🚀 Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
