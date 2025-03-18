const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config(); // Carrega variáveis de ambiente do arquivo .env

cloudinary.config({
  cloud_name: "dkzwenccl",
  api_key: "381682983929796",
  api_secret: process.env.CLOUDINARY_API_SECRET, // NÃO EXIBA DIRETAMENTE NO CÓDIGO!
});

module.exports = cloudinary;
