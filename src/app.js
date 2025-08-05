import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";

/**
 * Implementar o cron job para fazer a cobrança recorrente https://youtu.be/4qZd5nhajmg?si=clMi9a0wRCvQiKTy
 */
//Tudo que está comentado abaixo é para servir arquivos estáticos, como imagens, do diretório 'uploads'.
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

routes(app);

export default app;




