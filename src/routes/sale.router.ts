import { Router } from "express";
import SalesController from "../controllers/sales.controller";
import AuthMidleware from "../middlewares/auth.middleware";

const saleRouter = Router();
saleRouter.post("/sales", AuthMidleware.authAdmin, SalesController.registerSale);
saleRouter.get("/sales", AuthMidleware.authPadrao, SalesController.getSale);

export default saleRouter;
