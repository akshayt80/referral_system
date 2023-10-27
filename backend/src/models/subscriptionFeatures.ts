import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";
import { SubscriptionPlans } from "./subscriptionPlans";

export class SubscriptionFeatures extends Model {
    public subscriptionId!: number;
    public id!: number;
    public text!: string
}
SubscriptionFeatures.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    text: DataTypes.STRING,
    subscriptionId: {
        type: DataTypes.INTEGER,
        references: {
            model: SubscriptionPlans,
            key: "id"
        }
    }
}, { sequelize });
