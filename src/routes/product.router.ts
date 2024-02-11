import { Router } from "express";
import AuthMidleware from "../middlewares/auth.middleware";

import ProductController from "../controllers/product.controller";

const productRouter = Router();

productRouter.post("/create", AuthMidleware.authAdmin, ProductController.createProduct);
productRouter.get("/get", ProductController.getProduct);
productRouter.put("/update", AuthMidleware.authAdmin,ProductController.updateProduct);
productRouter.delete("/delete", AuthMidleware.authAdmin, ProductController.deleteProduct);

export default productRouter;
