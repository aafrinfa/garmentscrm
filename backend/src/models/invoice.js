const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Invoice = sequelize.define(
    "Invoice",
    {
        invoiceid: {
            type: DataTypes.STRING,
            primaryKey: true
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },

        dateofissue: {
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
        },

        duedate:{
            type: DataTypes.DATEONLY,
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