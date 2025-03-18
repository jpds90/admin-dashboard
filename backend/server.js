const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
dotenv = require('dotenv');
dotenv.config();
const multer = require("multer");
const cloudinary = require("./cloudinaryConfig");


const upload = multer({ storage: multer.memoryStorage() });
const app = express();
const port = process.env.PORT || 3000;

// Configuração do banco de dados
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// Criar uma nova notícia
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
        console.error(error);
        res.status(500).json({ error: 'Erro ao criar notícia' });
    }
});

// Listar todas as notícias
app.get('/noticias', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM saforgandia_noticias ORDER BY data_publicacao DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar notícias' });
    }
});

// Obter uma notícia por ID
app.get('/noticias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM saforgandia_noticias WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notícia não encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar notícia' });
    }
});

// Atualizar uma notícia
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
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar notícia' });
    }
});

// Deletar uma notícia
app.delete('/noticias/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM saforgandia_noticias WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notícia não encontrada' });
        }
        res.json({ message: 'Notícia deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar notícia' });
    }
});

app.post("/upload", upload.single("imagem"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Nenhuma imagem enviada" });
    }

    cloudinary.uploader.upload_stream({ folder: "saforgandia" }, async (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro no upload" });
      }

      // Salva a URL no banco
      await pool.query("INSERT INTO saforgandia_imagens (url) VALUES ($1)", [result.secure_url]);

      res.json({ imageUrl: result.secure_url });
    }).end(req.file.buffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao processar imagem" });
  }
});


app.get("/imagens", async (req, res) => {
  const result = await pool.query("SELECT url FROM saforgandia_imagens");
  res.json(result.rows);
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
