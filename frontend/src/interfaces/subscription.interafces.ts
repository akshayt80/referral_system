export interface UserSubscription {
    subscriptionId: number | null;
}

export interface SubscriptionPlan {
    subscriptionId: number;
    name: string;
    price: number;
    features: string[];
}

export interface SubscriptionPlanResponse {
    subscriptionPlans: SubscriptionPlan[];
}
