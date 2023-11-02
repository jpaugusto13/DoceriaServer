import { Router } from "express";
import SignErpKitController from "../../controller/ERP/SignErpKitController";

const SignErpKitRouter = Router();
SignErpKitRouter.post("/signKit", SignErpKitController);

export default SignErpKitRouter;
