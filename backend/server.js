require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const upload = require("./uploadConfig"); // Importa a configuração do multer

const app = express();
const port = process.env.PORT || 3000;

// Configuração do CORS
app.use(cors({ origin: "*" }));
app.use(express.json());

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// 📌 Configuração do PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// ☁️ Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
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

app.get('/noticias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM saforgandia_noticias WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notícia não encontrada' }); // Retorna JSON, não HTML
    }
    res.json(result.rows[0]); // Certifique-se de sempre retornar JSON
  } catch (error) {
    console.error("Erro ao buscar notícia:", error);
    res.status(500).json({ error: 'Erro ao buscar notícia' });
  }
});


// 🚀 Criar uma nova notícia
app.post('/noticias', async (req, res) => {
  const { titulo, conteudo } = req.body;

  try {
    if (!titulo || !conteudo) {
      return res.status(400).json({ error: 'Título e conteúdo são obrigatórios' });
    }

    // 🖼️ Buscar a última imagem cadastrada
    const imagemResult = await pool.query(
      "SELECT original_url, large_url, small_url FROM saforgandia_imagens ORDER BY id DESC LIMIT 1"
    );

    let imagem_url = null;
    let imagem_large = null;
    let imagem_small = null;

    if (imagemResult.rows.length > 0) {
      imagem_url = imagemResult.rows[0].original_url;
      imagem_large = imagemResult.rows[0].large_url;
      imagem_small = imagemResult.rows[0].small_url;
    }

    // 📰 Inserir a notícia no banco
    const result = await pool.query(
      `INSERT INTO saforgandia_noticias (titulo, conteudo, imagem_url, imagem_large, imagem_small) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, conteudo, imagem_url, imagem_large, imagem_small]
    );

    res.status(201).json({ message: 'Notícia criada com sucesso', noticia: result.rows[0] });

  } catch (error) {
    console.error("Erro ao criar notícia:", error);
    res.status(500).json({ error: 'Erro ao criar notícia' });
  }
});

// 📸 Upload de imagem para o Cloudinary
app.post("/upload", upload.single("imagem"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "saforgandia",
    });

    const imagem_large = cloudinary.url(uploadResult.public_id, { width: 802, height: 461, crop: "fill" });
    const imagem_small = cloudinary.url(uploadResult.public_id, { width: 351, height: 197, crop: "fill" });

    await pool.query(
      "INSERT INTO saforgandia_imagens (original_url, large_url, small_url) VALUES ($1, $2, $3)",
      [uploadResult.secure_url, imagem_large, imagem_small]
    );

    fs.unlinkSync(req.file.path);

    res.json({ original: uploadResult.secure_url, large: imagem_large, small: imagem_small });

  } catch (error) {
    console.error("Erro no upload:", error);
    res.status(500).json({ error: "Erro ao processar imagem" });
  }
});

// 📸 Upload de logo para o Cloudinary
app.post("/upload-logo", upload.single("logo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma logo enviada" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "saforgandia/logos",
    });

    const logo_url = cloudinary.url(uploadResult.public_id, { width: 40, height: 40, crop: "fill" });

    await pool.query(
      "INSERT INTO saforgandia_logos (logo_url) VALUES ($1) RETURNING *",
      [logo_url]
    );

    fs.unlinkSync(req.file.path);

    res.json({ logo: logo_url });

  } catch (error) {
    console.error("Erro no upload da logo:", error);
    res.status(500).json({ error: "Erro ao processar o upload da logo" });
  }
});

// 📜 Obter a última logo salva
app.get("/logo", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT logo_url FROM saforgandia_logos ORDER BY created_at DESC LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nenhuma logo encontrada" });
    }

    res.json({ logo: result.rows[0].logo_url });
  } catch (error) {
    console.error("Erro ao buscar a logo:", error);
    res.status(500).json({ error: "Erro ao buscar a logo" });
  }
});

app.get("/api/logo", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT logo_url FROM saforgandia_logos ORDER BY created_at DESC LIMIT 1"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nenhuma logo encontrada" });
    }

    res.json({ logo_url: result.rows[0].logo_url });
  } catch (error) {
    console.error("Erro ao buscar a logo:", error);
    res.status(500).json({ error: "Erro ao buscar a logo" });
  }
});

// 📸 Upload de banners para o Cloudinary
app.post("/upload-banners", upload.single("banners"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma Banners enviada" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "saforgandia/banners",
    });

    const banners_url = cloudinary.url(uploadResult.public_id, { width: 993, height: 558, crop: "fill" });

    await pool.query(
      "INSERT INTO saforgandia_banners (banners_url) VALUES ($1) RETURNING *",
      [banners_url]
    );

    fs.unlinkSync(req.file.path);

    res.json({ banners: banners_url });

  } catch (error) {
    console.error("Erro no upload da Banners:", error);
    res.status(500).json({ error: "Erro ao processar o upload da Banners" });
  }
});

// 🚀 Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
