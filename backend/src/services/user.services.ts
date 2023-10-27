import { Referrals } from "../models/referrals";
import { Users } from "../models/users";

export const generateReferralCode = (): string => {
    // 6 character referral code
    return Math.random().toString(16).substring(2, 8);
}

export const addReferralEntry = async (referredUserId: number, referralCode: string) => {
    const user = await Users.findOne({ where: { referralCode: referralCode } })
    if (user) {
        await Referrals.create({ userId: user.id, referredUserId: referredUserId })
    }
    console.log(`user not found for referral code: ${referralCode}`)
}
