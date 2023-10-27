import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/config';
import { Users } from './users';

export class Referrals extends Model {
    public id!: number;
    public userId!: number;
    public referredUserId!: number;
    public amountEarned!: number;
    public paid!: boolean;
}
Referrals.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: Users,
            key: "id"
        }
    },
    referredUserId: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: Users,
            key: "id",
        }
    },
    amountEarned: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.00
    },
    paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, { sequelize })
