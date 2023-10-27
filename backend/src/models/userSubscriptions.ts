import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/config';
import { SubscriptionPlans } from './subscriptionPlans';
import { Users } from './users';

export class UserSubscriptions extends Model { }
UserSubscriptions.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        unique: true,
        references: {
            model: Users,
            key: "id"
        }
    },
    subscriptionId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubscriptionPlans,
            key: "id"
        }
    }
}, { sequelize })
