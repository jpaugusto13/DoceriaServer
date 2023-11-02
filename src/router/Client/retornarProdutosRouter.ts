import { Router } from "express";
import RetornarProdutosController from "../../controller/Client/RetornarProdutosController";

const retornarProdutosRouter = Router();
retornarProdutosRouter.get("/produtos", RetornarProdutosController);

export default retornarProdutosRouter;
