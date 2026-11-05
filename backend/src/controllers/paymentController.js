const sequelize = require("../config/database");

const {
    Customer,
    Invoice,
    Payment,
    PaymentAllocation
} = require("../models/associations");

const { Op } = require("sequelize");

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
    let transaction;

    try {
        transaction = await sequelize.transaction();
        const { amount, date, customerid } = req.body;

        const paymentAmount = Number(amount);

        if (
            !Number.isFinite(paymentAmount) ||
            paymentAmount <= 0 ||
            !Number.isInteger(Number(customerid))
        ) {
            await transaction.rollback();

            return res.status(400).json({
                message: "Valid customer ID and positive payment amount are required"
            });
        }

        // 1. Verify the customer exists.
        const customer = await Customer.findByPk(customerid, {
            transaction
        });

        if (!customer) {
            await transaction.rollback();

            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // 2. Fetch all outstanding invoices, oldest first.
        const invoices = await Invoice.findAll({
            where: {
                customerid,
                remainingamount: {
                    [Op.gt]: 0
                }
            },
            order: [
                ["dateofissue", "ASC"],
                ["invoiceid", "ASC"]
            ],
            transaction,
            lock: transaction.LOCK.UPDATE
        });

        // 3. Record the payment once.
        const payment = await Payment.create({
            amount: paymentAmount,
            date: date || new Date(),
            customerid
        }, {
            transaction
        });

        let remainingPayment = Math.round(paymentAmount * 100) / 100;
        const allocations = [];

        // 4. Apply the payment to the oldest invoice first.
        for (const invoice of invoices) {
            if (remainingPayment <= 0) break;

            const outstanding =
                Math.round(Number(invoice.remainingamount) * 100) / 100;

            const allocatedAmount = Math.min(
                remainingPayment,
                outstanding
            );

            const newRemaining = Math.round(
                (outstanding - allocatedAmount) * 100
            ) / 100;

            invoice.remainingamount = newRemaining;

            if (newRemaining === 0) {
                invoice.status = "done";
            }

            await invoice.save({ transaction });

            allocations.push({
                paymentid: payment.paymentid,
                invoiceid: invoice.invoiceid,
                amount: allocatedAmount
            });

            remainingPayment = Math.round(
                (remainingPayment - allocatedAmount) * 100
            ) / 100;
        }

        // 5. Save the invoice-level allocation history.
        if (allocations.length > 0) {
            await PaymentAllocation.bulkCreate(allocations, {
                transaction
            });
        }


        await transaction.commit();

        return res.status(201).json({
            message: remainingPayment > 0
            ? "Payment recorded; some amount remains unallocated"
            : "Payment recorded and allocated successfully",
            payment,
            allocations,
            unallocatedamount: remainingPayment
        });
    } catch (error) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }

        console.error("Payment creation failed:", error);

        return res.status(500).json({
            message: "Failed to create payment"
        });
    }
};

module.exports = {
    getPayments,
    createPayment
};