export interface SubscribeRequest {
    userId: number;
    subscriptionId: number;
}

export interface SubscriptionPlanAndFeatures {
    subscriptionId: number;
    name: string;
    price: number;
    features: [string];
}

export interface SubscriptionPlansResponse {
    subscriptionPlans: SubscriptionPlanAndFeatures[]
}

export interface SubscriptionRequest {
    subscriptionId: number;
    price: number;
    userId: number;
}
