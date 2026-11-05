const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PaymentAllocation = sequelize.define(
    "PaymentAllocation",
    {
        allocationid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        paymentid: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "payments",
                key: "paymentid"
            }
        },

        invoiceid: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "invoices",
                key: "invoiceid"
            }
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        tableName: "payment_allocations",
        timestamps: false
    }
);

module.exports = PaymentAllocation;