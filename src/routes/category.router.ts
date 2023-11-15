// Importações da Rota
import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import AuthMidleware from "../middlewares/auth.middleware";

const CategoryRouter = Router();
CategoryRouter.post("/register", AuthMidleware.authAdmin, CategoryController.registerCatogory);
CategoryRouter.get("/categorys", AuthMidleware.authPadrao, CategoryController.getCategory);

export default CategoryRouter;
