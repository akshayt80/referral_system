export interface ReferralDetail {
    firstName: string,
    lastName: string,
    amountEarned: number
}

export interface ReferralResponse {
    referrals: ReferralDetail[],
    totalAmount: number
}
