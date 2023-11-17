import { Router } from "express";
import AuthMidleware from "../middlewares/auth.middleware";

import ProductController from "../controllers/product.controller";

const productRouter = Router();

productRouter.post("/register", AuthMidleware.authAdmin, ProductController.registerProduct);
productRouter.delete("/delete", AuthMidleware.authAdmin, ProductController.deleteProduct);
productRouter.put("/update", AuthMidleware.authAdmin,ProductController.updateProduct);
productRouter.get("/get", ProductController.getProduct);

export default productRouter;
