import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/config';
import { hashPassword } from '../services/auth.services';
import { UserAttributes, UserInput } from '../interfaces/user.interfaces';


export class Users extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public password!: string;
    public referralCode!: string;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
}
Users.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    referralCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, { sequelize })

Users.beforeCreate(async (user: Users) => {
    user.password = await hashPassword(user.password)
})
