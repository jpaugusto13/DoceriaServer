// Importações da Rota
import { Router } from "express";
import CategoryController from "../controllers/category.controller";
import AuthMidleware from "../middlewares/auth.middleware";

const CategoryRouter = Router();
CategoryRouter.post("/create", AuthMidleware.authAdmin, CategoryController.createCategory);
CategoryRouter.get("/update", AuthMidleware.authAdmin, CategoryController.updateCategory);
CategoryRouter.get("/update", AuthMidleware.authAdmin, CategoryController.updateCategory);
CategoryRouter.get("/get", CategoryController.getCategory);

export default CategoryRouter;