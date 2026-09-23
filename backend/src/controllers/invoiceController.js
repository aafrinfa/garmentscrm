const Invoice = require("../models/invoice");
const Customer = require("../models/customer");

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll();

        res.json(invoices);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch invoices"
        });
    }
};

const createInvoice = async (req, res) => {
    try {
        const { amount, dateofissue, duration, customerid } = req.body;
        // 1. Find customer
        const customer = await Customer.findByPk(customerid);

        // 2. If customer doesn't exist
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }
        // 3. Create invoice
        const invoice = await Invoice.create({
            amount,
            dateofissue,
            duration,
            customerid,
            remainingamount: amount,
            status: "pending"
        });

        res.status(201).json(invoice);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create invoice"
        });
    }
};

module.exports = {
    getInvoices,
    createInvoice
};