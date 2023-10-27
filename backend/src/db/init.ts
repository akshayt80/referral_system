import { Referrals } from "../models/referrals"
import { SubscriptionFeatures } from "../models/subscriptionFeatures"
import { SubscriptionPlans } from "../models/subscriptionPlans"
import { Users } from "../models/users"
import { UserSubscriptions } from "../models/userSubscriptions"

const dbInit = async () => {
    // Primary tables
    await Promise.all([
        Users.sync({ alter: true }),
        SubscriptionPlans.sync({ alter: true }),

    ])
    // Dependent tables
    await Promise.all([
        UserSubscriptions.sync({ alter: true }),
        Referrals.sync({ alter: true }),
        SubscriptionFeatures.sync({ alter: true })
    ])

    // TODO add some subscription plans in db
    await Promise.all([
        SubscriptionPlans.create({ name: "Free", price: 0, referralBonus: 0 }),
        SubscriptionPlans.create({ name: "Pro", price: 15, referralBonus: 1.5 }),
        SubscriptionPlans.create({ name: "Enterprise", price: 30, referralBonus: 3 })
    ])

    await Promise.all([
        SubscriptionFeatures.create({ text: "10 users included", subscriptionId: 1 }),
        SubscriptionFeatures.create({ text: "2Gb of storage", subscriptionId: 1 }),
        SubscriptionFeatures.create({ text: "Email Support", subscriptionId: 1 }),
        SubscriptionFeatures.create({ text: "20 users included", subscriptionId: 2 }),
        SubscriptionFeatures.create({ text: "10Gb of storage", subscriptionId: 2 }),
        SubscriptionFeatures.create({ text: "Priority Email Support", subscriptionId: 2 }),
        SubscriptionFeatures.create({ text: "50 users included", subscriptionId: 3 }),
        SubscriptionFeatures.create({ text: "30Gb of storage", subscriptionId: 3 }),
        SubscriptionFeatures.create({ text: "Phone & email Support", subscriptionId: 3 }),
    ])
}

dbInit()
