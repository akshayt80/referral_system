import { Request, Router, Response } from "express";
import { createPaymentIntent, verifyPayment } from "../controllers/payment";
import { auth } from "../services/auth.services";

const paymentRouter = Router()

paymentRouter.post("/create-payment-intent", auth, async (req: Request, res: Response) => {
    return await createPaymentIntent(req, res)
})

paymentRouter.post("/verify", auth, async (req: Request, res: Response) => {
    return await verifyPayment(req, res)
})

export default paymentRouter 
