import { Router } from "express";
import registerUserController from "../../controller/Client/RegisterUserController";

const registerRouter = Router();
registerRouter.post("/register", registerUserController);

export default registerRouter;
