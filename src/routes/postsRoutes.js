// Importa o framework Express.js para criar a API
import express from "express";
import cors from "cors";

const corsOptions = {
  origin:"http://localhost:8000",
  optionsSuccessStatus: 200
}

// Importa o módulo Multer para lidar com uploads de arquivos
import multer from "multer";

// Importa funções controladoras do arquivo postsController.js
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controller/postsController.js";

// Configura o armazenamento de arquivos para o Multer
const storage = multer.diskStorage({
  // Define o diretório de destino para os uploads (pasta 'uploads/')
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  // Mantém o nome original do arquivo durante o upload
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// Cria uma instância do upload do Multer com o armazenamento configurado
const upload = multer({ dest: "./uploads", storage });

// Define uma função para configurar as rotas da API
const routes = (app) => {
  // Habilita o parseamento de dados JSON no corpo das requisições
  app.use(express.json());

  app.use(cors(corsOptions));

  // Rota GET para listar todos os posts (implementação na função listarPosts)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (implementação na função postarNovoPost)
  app.post("/posts", postarNovoPost);

  // Rota POST para upload de imagem (usa o middleware upload.single('imagem') para processar o upload e chama a função uploadImagem)
  app.post("/upload", upload.single('imagem'), uploadImagem);

  app.put("/upload/:id", atualizarNovoPost)
};

// Exporta a função routes para uso em outros arquivos do projeto
export default routes;