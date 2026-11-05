const Invoice = require("../models/invoice");
const Customer = require("../models/customer");

const getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            order: [["dateofissue", "ASC"]]
        });

        res.json(invoices);
    } catch (error) {
        console.error("Failed to fetch invoices:", error);
        res.status(500).json({
            message: "Failed to fetch invoices"
        });
    }
};

const createInvoice = async (req, res) => {
    try {
        const { invoiceid, amount, dateofissue, customerid } = req.body;
        const invoiceAmount = Number(amount);
        const issueDate = new Date(dateofissue);
        if (
            !invoiceid ||
            !Number.isFinite(invoiceAmount) ||
            invoiceAmount <= 0 ||
            !dateofissue ||
            Number.isNaN(issueDate.getTime()) ||
            !Number.isInteger(Number(customerid))
        ) {
            return res.status(400).json({
                message: "Valid invoice ID, amount, issue date and customer ID are required"
            });
        }
        
        const customer = await Customer.findByPk(customerid);
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        const duration = Number(customer.duration);

        if (!Number.isInteger(duration) || duration < 0) {
            return res.status(400).json({
                message: "Customer duration must be a non-negative number of days"
            });
        }
        const duedate = new Date(dateofissue);
        duedate.setDate(duedate.getDate() + duration);

        
        const invoice = await Invoice.create({
            invoiceid, 
            amount: invoiceAmount,
            dateofissue: issueDate,
            customerid: customer.customerid,
            duedate,
            remainingamount: invoiceAmount,
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