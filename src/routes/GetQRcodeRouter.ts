// Importações da Rota
import { Router } from "express";

// Importações do Controller
import { Request, Response } from "express";
import chatbot from "../services/chatbot.service";

// Criação da Rota
const ERPQrcodeRouter = Router();
ERPQrcodeRouter.get("/qrCodeBot", ERPQrcodeController);

// Criação do Controller
async function ERPQrcodeController(req: Request, res: Response) {
  try {
    const response = await chatbot.get("/");
    const imageBase64 = response.data.qrCode;
    const statusSession = response.data.status;

    res.status(200).send({ qrcode: imageBase64, status: statusSession });
  } catch (error) {
    return res.status(500).json({ message: "Erro ao obter imagem", error: (error as Error).message });
  }
}

export default ERPQrcodeRouter;
