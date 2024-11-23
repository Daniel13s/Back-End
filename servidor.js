import express from "express";
import routes from "./src/routes/postsRoutes.js";

// Cria uma instância do servidor Express
const app = express();
app.use(express.static("uploads"))
routes(app)

// Define a porta do servidor
const port = 3000;

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor inicializado na porta ${port}...`);
});
