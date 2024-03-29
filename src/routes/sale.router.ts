import { Router } from "express";
import AuthMidleware from "../middlewares/auth.middleware";

import SalesController from "../controllers/sale.controller";

const saleRouter = Router();
saleRouter.post("/post", SalesController.registerSale);
saleRouter.get("/get", SalesController.getSale);

export default saleRouter;
