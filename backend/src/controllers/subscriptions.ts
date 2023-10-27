import { Request, Response } from "express";
import { col } from "sequelize";
import { SubscribeRequest, SubscriptionPlanAndFeatures, SubscriptionPlansResponse } from "../interfaces/subscription.interfaces";
import { Referrals } from "../models/referrals";
import { SubscriptionFeatures } from "../models/subscriptionFeatures"
import { SubscriptionPlans } from "../models/subscriptionPlans"
import { UserSubscriptions } from "../models/userSubscriptions";

// gets all plans ordered by price in ascending order
export const getAllPlans = async (req: Request, res: Response) => {
    const subscriptionPlans: SubscriptionPlans[] = await SubscriptionPlans.findAll({
        order: col("price")
    })
    const subscriptionFeatures: SubscriptionFeatures[] = await SubscriptionFeatures.findAll()
    // grouping subscription features with subscription id
    // TODO: can be done using db query in the first place
    const groupedSubscriptionFeatures: { [subscriptionId: string]: [string] } = subscriptionFeatures.reduce((r, a) => {
        r[a.subscriptionId] = r[a.subscriptionId] || []
        r[a.subscriptionId].push(a.text)
        return r
    }, Object.create(null))

    const response: SubscriptionPlansResponse = {
        subscriptionPlans: subscriptionPlans.map((subscriptionPlan): SubscriptionPlanAndFeatures => {
            return {
                subscriptionId: subscriptionPlan.id,
                name: subscriptionPlan.name,
                price: subscriptionPlan.price,
                features: groupedSubscriptionFeatures[`${subscriptionPlan.id}`]
            }
        })
    }
    return res.status(200).send(response)
}

export const subscribe = async (req: Request, res: Response) => {
    const data: SubscribeRequest = req.body
    await UserSubscriptions.create({ userId: data.userId, subscriptionId: data.subscriptionId })
    // update referral entry if available to update the bonus for the user who referred the current customer
    const subscriptionPlan = await SubscriptionPlans.findOne({ where: { id: data.subscriptionId } })
    await Referrals.update({ amountEarned: subscriptionPlan?.referralBonus }, { where: { referredUserId: data.userId } })

    return res.status(204).send()
}
