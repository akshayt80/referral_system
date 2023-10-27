import { Optional } from "sequelize";

export interface UserAttributes {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    referralCode: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface LoginOutput {
    userId: number;
    token: string;
}

export interface UserInput extends Optional<UserAttributes, "id" | "referralCode"> { }

export interface UserOutput {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    referralCode: string;
}
