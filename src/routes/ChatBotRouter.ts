// Importações da Rota
import { Router } from "express";

// Importações do Controller
import { Request, Response } from "express";
import chatbot from "../services/chatbot.service";

// Criação da Rota
const ChatBotErpRouter = Router();
ChatBotErpRouter.get("/session", ChatBotController);

// Criação do Controller
async function ChatBotController(req: Request, res: Response) {
  await chatbot.get("/session");
}

export default ChatBotErpRouter;
