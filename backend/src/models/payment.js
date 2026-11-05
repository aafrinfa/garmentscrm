const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define(
    "Payment",
    {
        paymentid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        customerid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "customers",
                key: "customerid"
            }
        }
    },
    {
        tableName: "payments",
        timestamps: false
    }
);

module.exports = Payment;