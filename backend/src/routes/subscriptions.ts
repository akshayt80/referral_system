import { Request, Response, Router } from "express";
import { getAllPlans, subscribe } from "../controllers/subscriptions";
import { auth } from "../services/auth.services";

const subscriptionRouter = Router()

subscriptionRouter.get("/", async (req: Request, res: Response) => {
    return await getAllPlans(req, res)
})

subscriptionRouter.post("/", auth, async (req: Request, res: Response) => {
    return await subscribe(req, res)
})

export default subscriptionRouter
