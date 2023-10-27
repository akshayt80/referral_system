export interface ReferralDetail {
    firstName: string;
    lastName: string;
    amountEarned: number;
}

export interface ReferralsResponse {
    referrals: ReferralDetail[],
    totalAmount: number
}
