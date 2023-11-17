import { Router } from "express";

import SchedulingController from "../controllers/scheduling.controller";
import AuthMidleware from "../middlewares/auth.middleware";
import SchedulingMiddleware from "../middlewares/scheduling.middleware";

const schedulingRouter = Router();
schedulingRouter.post("/register", AuthMidleware.authAdmin, SchedulingMiddleware.verifyScheduling, SchedulingController.createScheduling);

export default schedulingRouter;
