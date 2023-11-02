import { Router } from "express";
import loginErpController from "../../controller/ERP/LoginErpController";

const loginErpRouter = Router();
loginErpRouter.post("/login", loginErpController);

export default loginErpRouter;
