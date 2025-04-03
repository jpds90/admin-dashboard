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

// Página inicial
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "principal.html"));
});

// 📌 tradutor Abaixo




const DEEPL_API_KEY = process.env.DEEPL_API_KEY; // Chave salva como variável de ambiente

app.post("/traduzir", async (req, res) => {
    const { text, targetLang } = req.body;

    if (!text || !targetLang) {
        return res.status(400).json({ error: "Texto e idioma de destino são obrigatórios" });
    }

    try {
        // 1. Verificar se a tradução já existe no banco de dados
        console.log(`🔍 Verificando tradução no banco de dados para o texto: "${text}" no idioma ${targetLang}`);

        const existingTranslation = await pool.query(
            'SELECT texto_traduzido FROM traducoes WHERE texto_original = $1 AND idioma = $2',
            [text.trim(), targetLang]
        );

        if (existingTranslation.rows.length > 0) {
            // Caso a tradução já exista no banco, retorna ela diretamente
            console.log(`🌍 Tradução encontrada no banco de dados para o texto: "${text}" no idioma ${targetLang}`);
            return res.json({ translations: [{ text: existingTranslation.rows[0].texto_traduzido }] });
        }

        // 2. Caso a tradução não esteja no banco, fazer a requisição para a API do DeepL
        console.log(`🔄 Tradução não encontrada no banco, consultando a API do DeepL para o texto: "${text}" no idioma ${targetLang}`);

        const response = await fetch("https://api-free.deepl.com/v2/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`
            },
            body: new URLSearchParams({
                "text": text,
                "target_lang": targetLang
            })
        });

        const data = await response.json();

        if (!data.translations || data.translations.length === 0) {
            throw new Error("Resposta inválida da API de tradução");
        }

        // 3. Armazenar a tradução no banco de dados para futuras consultas
        const translatedText = data.translations[0].text;

        console.log(`🌍 Tradução obtida da API e salva no banco de dados para o texto: "${text}" no idioma ${targetLang}`);
        
        await pool.query(
            'INSERT INTO traducoes (texto_original, idioma, texto_traduzido) VALUES ($1, $2, $3)',
            [text, targetLang, translatedText]
        );

        // 4. Retornar a tradução no formato esperado pelo frontend
        res.json({ translations: [{ text: translatedText }] });

    } catch (error) {
        console.error("❌ Erro na tradução:", error);
        res.status(500).json({ error: "Erro ao conectar com o DeepL" });
    }
});









// 📌 tradutor cima


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

app.get("/api/banners", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT banners_url FROM saforgandia_banners ORDER BY created_at DESC"
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nenhum banner encontrado" });
    }

    res.json(result.rows); // Retorna todos os banners como array
  } catch (error) {
    console.error("Erro ao buscar banners:", error);
    res.status(500).json({ error: "Erro ao buscar banners" });
  }
});

app.delete("/api/banners/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar a URL do banner no banco
    const result = await pool.query(
      "SELECT banners_url FROM saforgandia_banners WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Banner não encontrado" });
    }

    const bannerUrl = result.rows[0].banners_url;

    // Extrair o public_id do Cloudinary (pegar apenas a parte do nome do arquivo)
    const publicId = bannerUrl.split("/").pop().split(".")[0];

    // Excluir do Cloudinary
    await cloudinary.uploader.destroy(`saforgandia/banners/${publicId}`);

    // Remover do banco de dados
    await pool.query("DELETE FROM saforgandia_banners WHERE id = $1", [id]);

    res.json({ message: "Banner excluído com sucesso" });

  } catch (error) {
    console.error("Erro ao excluir o banner:", error);
    res.status(500).json({ error: "Erro ao excluir o banner" });
  }
});


// 🚀 Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
