import bcrypt from "bcrypt"
import { Op } from "sequelize";
import { Request, Response } from "express"
import { LoginInput } from "../interfaces/user.interfaces";
import { Referrals } from "../models/referrals";
import { Users } from "../models/users";
import { UserSubscriptions } from "../models/userSubscriptions";
import { generateToken } from "../services/auth.services";
import { addReferralEntry, generateReferralCode } from "../services/user.services";

// logs in user
export const login = async (req: Request, res: Response) => {
    const data: LoginInput = req.body
    try {
        const user = await Users.findOne({ where: { email: data.email } })
        if (!user) {
            throw new Error("No user found")
        }
        const isMatch = bcrypt.compareSync(data.password, user.password)

        if (isMatch) {
            const token = generateToken({ id: user.id })
            return res.status(200).send({ token: token, userId: user.id })
        } else {
            throw new Error("Password didn't match")
        }
    } catch (err: unknown) {
        return res.status(400).send("Something went wrong")
    }

}
// finds user by given userId
export const findById = async (req: Request, res: Response) => {
    const userId = Number(req.headers.userId)
    try {
        const user = await Users.findOne({ where: { id: userId } })
        if (!user) {
            throw new Error("No user found")
        }
        return res.status(200).send({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            referralCode: user.referralCode
        })
    } catch (error) {
        return res.status(400).send("User not found")
    }

}

// creates user
export const create = async (req: Request, res: Response) => {
    const data = req.body
    try {
        const usedReferralCode = data.referralCode
        const user = await Users.create({ ...data, referralCode: generateReferralCode() })
        // if user signing up from a referral code then make a referral entry
        if (usedReferralCode) {
            addReferralEntry(user.id, usedReferralCode)
        }
        const token = generateToken({ id: user.id })
        return res.status(201).send({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            referralCode: user.referralCode,
            token: token
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.name === "SequelizeUniqueConstraintError") {
                return res.status(409).send("Email already exists")
            }
        }
        return res.status(400).send("Error occurred")
    }

}

// gets user's subscription
export const getSubscription = async (req: Request, res: Response) => {
    const userId = Number(req.headers.userId)
    const user = await Users.findOne({ where: { id: userId } })
    const subscription = await UserSubscriptions.findOne({ where: { userId: user?.id } })
    return res.status(200).send({ subscriptionId: subscription })
}

export const getReferrals = async (req: Request, res: Response) => {
    const userId = Number(req.headers.userId)
    const referralRows: Referrals[] = await Referrals.findAll({
        where: {
            userId: userId,
            paid: false,
            amountEarned: { [Op.gt]: 0 }
        }
    })
    if (referralRows.length !== 0) {
        let totalAmount = 0;
        const referrals = await Promise.all(referralRows.map(async (referral) => {
            const user = await Users.findOne({ where: { id: referral.referredUserId } })
            totalAmount = totalAmount + referral.amountEarned
            return { firstName: user!.firstName, lastName: user!.lastName, amountEarned: referral.amountEarned }
        }))
        return res.status(200).send({ referrals: referrals, totalAmount: totalAmount })
    }
    return res.status(200).send({ referrals: [], totalAmount: 0 })



}
