/**
 * https://expressjs.com/en/resources/middleware/multer.html
 * Quando for exibir a imagem no frontend, preciso servir a pasta src/uploads/ como ESTÁTICA:
 */

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/avatares");// a pasta 'uploads' guardará os arquivos enviados
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Arquivo inválido. Apenas imagens são permitidas."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // Limite: 2MB,o 2 é multiplicado por 1024 para converter em KB e depois por 1024 novamente para MB
});

export default upload;
