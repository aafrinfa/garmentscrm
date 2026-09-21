const Customer = require("../models/customer");

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll();

        res.json(customers);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch customers"
        });
    }
};

const createCustomer = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const customer = await Customer.create({
            name,
            phone
        });

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create customer"
        });
    }
};

module.exports = {
    getCustomers,
    createCustomer
};