import { Router } from "express";
import AuthMidleware from "../middlewares/auth.middleware";

import ProductController from "../controllers/product.controller";

const productRouter = Router();

productRouter.post("/register", AuthMidleware.authAdmin, ProductController.registerProduct);
productRouter.get("/products", AuthMidleware.authPadrao, ProductController.getProduct);

export default productRouter;
