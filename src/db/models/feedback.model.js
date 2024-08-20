import { DataTypes } from "sequelize";
import { sequelize } from "../../config/db.js";

export const Feedback = sequelize.define("feedback", {
    feedbackId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    invoiceId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    consumerId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: true
})
