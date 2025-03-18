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

// Rota para a página inicial
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

// 📸 Configuração do Multer para upload de arquivos na memória
const upload = multer({ dest: "uploads/" });

// ☁️ Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🚀 Criar uma nova notícia
app.post('/noticias', async (req, res) => {
  const { titulo, conteudo, imagem_url } = req.body;
  try {
    if (!titulo || !conteudo) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }

    const result = await pool.query(
      'INSERT INTO saforgandia_noticias (titulo, conteudo, imagem_url) VALUES ($1, $2, $3) RETURNING *',
      [titulo, conteudo, imagem_url]
    );

    res.status(201).json(result.rows[0]);
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
app.put('/noticias/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo, imagem_url } = req.body;
  try {
    const result = await pool.query(
      'UPDATE saforgandia_noticias SET titulo = $1, conteudo = $2, imagem_url = $3 WHERE id = $4 RETURNING *',
      [titulo, conteudo, imagem_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notícia não encontrada' });
    }
    res.json(result.rows[0]);
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

// 📸 Upload de imagem no Cloudinary
app.post("/upload", upload.single("imagem"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    // Faz upload para o Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "saforgandia",
    });

    // Gera versões redimensionadas
    const imageLarge = cloudinary.url(result.public_id, { width: 802, height: 461, crop: "fill" });
    const imageSmall = cloudinary.url(result.public_id, { width: 351, height: 197, crop: "fill" });

    // Salva no banco de dados
    await pool.query(
      "INSERT INTO saforgandia_imagens (original_url, large_url, small_url) VALUES ($1, $2, $3)",
      [result.secure_url, imageLarge, imageSmall]
    );

    // Remove o arquivo temporário
    fs.unlinkSync(req.file.path);

    res.json({
      original: result.secure_url,
      large: imageLarge,
      small: imageSmall,
    });

  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro ao processar imagem" });
  }
});

// 🖼️ Listar imagens salvas
app.get("/imagens", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM saforgandia_imagens ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar imagens:", error);
    res.status(500).json({ error: "Erro ao buscar imagens" });
  }
});

// 🚀 Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
