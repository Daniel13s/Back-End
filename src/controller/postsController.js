import fs from "fs";
import {getTodosPosts, criarPost, atualizarPost} from "../model/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req,res) {
  // Chama a função do modelo para obter todos os posts do banco de dados
  const posts = await getTodosPosts();
  // Envia os posts como resposta em formato JSON com status 200 (sucesso)
  res.status(200).json(posts);
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
  // Obtém os dados do novo post do corpo da requisição
  const novoPost = req.body;
  try {
    // Chama a função do modelo para criar o novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch(erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma mensagem de erro ao cliente com status 500 (erro interno do servidor)
    res.status(500).json({"Erro:":"falha na requisição"});
  }
}

// Função assíncrona para fazer upload de uma imagem e criar um novo post
export async function uploadImagem(req, res) {
  // Cria um objeto com os dados do novo post, incluindo o nome da imagem original
  const novoPost = {
    descricao: "",
    imgUrl: req.file.originalname,
    alt: ""
  };
  try {
    // Chama a função do modelo para criar o novo post no banco de dados
    const postCriado = await criarPost(novoPost);
    // Constrói o novo nome da imagem com o ID do post inserido
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
    // Renomeia o arquivo da imagem para o novo nome
    fs.renameSync(req.file.path, imagemAtualizada);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch(erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma mensagem de erro ao cliente com status 500 (erro interno do servidor)
    res.status(500).json({"Erro:":"falha na requisição"});
  }
}

export async function atualizarNovoPost(req, res) {
  // Obtém os dados do novo post do corpo da requisição
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`

  try {
    // Chama a função do modelo para criar o novo post no banco de dados
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
    const descricao = await gerarDescricaoComGemini(imgBuffer)
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt
    }
    const postCriado = await atualizarPost(id, post);
    // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(postCriado);
  } catch(erro) {
    // Imprime o erro no console para depuração
    console.error(erro.message);
    // Envia uma mensagem de erro ao cliente com status 500 (erro interno do servidor)
    res.status(500).json({"Erro:":"falha na requisição"});
  }
}
