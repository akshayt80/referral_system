import { Request, Response } from "express";
import Stripe from "stripe"
import { CreatePaymentIntentRequest, PaymentVerificationRequest } from "../interfaces/payment.interfaces";
import { SubscriptionPlans } from "../models/subscriptionPlans"
import { subscribe } from "./subscriptions"

const stripe = new Stripe(process.env.STRIPE_KEY, { apiVersion: "2020-08-27" })

// creates payment intent on stripe
export const createPaymentIntent = async (req: Request, res: Response) => {

    const data: CreatePaymentIntentRequest = req.body
    const subscriptionPlan = await SubscriptionPlans.findOne({ where: { id: data.subscriptionId } })
    if (!subscriptionPlan) {
        throw new Error("Subscription plan not found")
    }

    const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: subscriptionPlan.price * 100, // stripe is using cents as unit
        metadata: {
            subscriptionId: data.subscriptionId,
            userId: data.userId
        }
    })

    return res.status(200).send({ clientSecret: paymentIntent.client_secret })
}

// verifies if the payment actually succeeded
export const verifyPayment = async (req: Request, res: Response) => {
    const data: PaymentVerificationRequest = req.body
    const response = await stripe.paymentIntents.retrieve(data.paymentIntent)
    if (response.status == "succeeded") {
        const { subscriptionId, userId } = response.metadata
        await subscribe(parseInt(userId), parseInt(subscriptionId))
        return res.status(204).send()
    }
    console.log(`Response from payment verification : ${JSON.stringify(response)}`)
    return res.status(402).send()
}
