import { Router, Request, Response } from "express"
import { create, findById, getReferrals, getSubscription, login } from "../controllers/users"
import { auth } from "../services/auth.services"

const usersRouter = Router()

usersRouter.post("/login", async (req: Request, res: Response) => {
    return await login(req, res)
})

usersRouter.get("/", auth, async (req: Request, res: Response) => {
    return await findById(req, res)
})

usersRouter.post("/", async (req: Request, res: Response) => {
    return await create(req, res)
})

usersRouter.get("/subscription", auth, async (req: Request, res: Response) => {
    return await getSubscription(req, res)

})

usersRouter.get("/referrals", auth, async (req: Request, res: Response) => {
    return await getReferrals(req, res)
})

export default usersRouter
