const Invoice = require("../models/invoice");
const Payment = require("../models/payment");

const getPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();

        res.json(payments);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch payments"
        });
    }
};

const createPayment = async (req, res) => {
    try {
        const { amount, date, customerid, invoiceid } = req.body;
        // 1. Find Invoice
        const invoice = await Invoice.findByPk(invoiceid);

        // 2. If invoice doesn't exist
        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }
        
        // 3. Check payment doesn't exceed remaining amount
        if (Number(amount) > Number(invoice.remainingamount)) {
            return res.status(400).json({
                message: "Payment amount exceeds remaining invoice amount"
            });
        }


        // 4. Subtract payment amount from remaining amount
        invoice.remainingamount = Number(invoice.remainingamount) - Number(amount)  ;

        // 5. If remaining amount is 0, mark invoice as done
        if (Number(invoice.remainingamount) === 0) {
            invoice.status = "done";
        }
        // 6. Save updated invoice
        await invoice.save();

        
        // 7. Create payment
        const payment = await Payment.create({
            amount,
            date,
            customerid,
            invoiceid
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create payment"
        });
    }
};

module.exports = {
    getPayments,
    createPayment
};