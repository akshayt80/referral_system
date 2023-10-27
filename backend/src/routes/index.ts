import { Router } from "express";
import paymentRouter from "./payment";
import subscriptionRouter from "./subscriptions";
import usersRouter from "./users";

const router = Router()

router.use("/user", usersRouter)
router.use("/subscription", subscriptionRouter)
router.use("/payments", paymentRouter)

export default router
