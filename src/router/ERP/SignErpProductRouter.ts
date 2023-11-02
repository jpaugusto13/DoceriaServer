import { Router } from "express";
import SignErpProductController from "../../controller/ERP/SignErpProductController";

const SignErpProductRouter = Router();
SignErpProductRouter.post("/signProduct", SignErpProductController);

export default SignErpProductRouter;
