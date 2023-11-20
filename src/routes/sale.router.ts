import { Router } from "express";
import AuthMidleware from "../middlewares/auth.middleware";

import SalesController from "../controllers/sales.controller";

const saleRouter = Router();
saleRouter.post("/register", SalesController.registerSale);
saleRouter.post("/get", SalesController.getSale);

export default saleRouter;
