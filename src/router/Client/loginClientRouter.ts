import { Router } from "express";
import loginClientController from "../../controller/Client/LoginClientController";

const loginClientRouter = Router();
loginClientRouter.post("/login", loginClientController);

export default loginClientRouter;
