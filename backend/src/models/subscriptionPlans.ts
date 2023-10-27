import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/config';

export class SubscriptionPlans extends Model {
    public id!: number;
    public name!: string;
    public price!: number;
    public referralBonus!: number
}
SubscriptionPlans.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
    price: DataTypes.FLOAT,
    referralBonus: DataTypes.FLOAT
}, { sequelize });

