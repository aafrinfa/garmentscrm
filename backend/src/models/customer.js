const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Customer = sequelize.define(
    "Customer",
    {
        customerid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },

        duration: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    },
    {
        tableName: "customers",
        timestamps: false
    }
);

module.exports = Customer;