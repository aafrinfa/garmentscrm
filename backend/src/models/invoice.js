const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Invoice = sequelize.define(
    "Invoice",
    {
        invoiceid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        dateofissue: {
            type: DataTypes.DATE,
            allowNull: false
        },

        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        customerid: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        remainingamount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: "invoices",
        timestamps: false
    }
);

module.exports = Invoice;