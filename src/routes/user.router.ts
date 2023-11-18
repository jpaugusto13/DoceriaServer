import { Router } from "express";
import UserControler from "../controllers/user.controller";

const usersRouter = Router();
usersRouter.post("/login", UserControler.login);

export default usersRouter;