import { DataTypes, UUID } from "sequelize"
import { sequelize } from "../../config/db.js"


export const Otp = sequelize.define("otp", {

    otpId: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey:true
    },
    code: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
    ,
    consumerId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiry: {
        type: DataTypes.STRING,
        defaultValue: "60s"
    }
}
    , {
        timestamps: true,
    })