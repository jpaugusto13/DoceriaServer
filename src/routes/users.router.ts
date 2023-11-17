import { Router } from "express";
import UserControler from "../controllers/users.controller";

const usersRouter = Router();
usersRouter.post("/login", UserControler.login);

export default usersRouter;