export interface CreatePaymentIntentRequest {
    subscriptionId: number;
    userId: number;
}

export interface PaymentVerificationRequest {
    paymentIntent: string;
    paymentIntentClientSecret: string;
}
