const {
    Customer,
    Invoice,
    Payment,
    PaymentAllocation
} = require("../models/associations");

const { Op } = require("sequelize");

const getCustomers = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            order: [["name", "ASC"]]
        });

        res.json(customers);
    } catch (error) {
        console.error("Failed to fetch customers:", error);
        res.status(500).json({
            message: "Failed to fetch customers"
        });
    }
};

const createCustomer = async (req, res) => {
    try {
        const { name, phone, duration } = req.body;
        const parsedDuration = Number(duration);

        if (
            !name?.trim() ||
            !phone?.trim() ||
            duration === "" ||
            duration === undefined ||
            !Number.isInteger(parsedDuration) ||
            parsedDuration < 1
        ) {
            return res.status(400).json({
                message: "Name, phone and a positive whole-number duration are required"
            });
        }

        const customer = await Customer.create({
            name: name.trim(),
            phone: phone.trim(),
            duration: parsedDuration
        });

        res.status(201).json(customer);
    } catch (error) {
        console.error("Failed to create customer:", error);
        res.status(500).json({
            message: "Failed to create customer"
        });
    }
};

const getCustomerDetails = async (req, res) => {
    try {
        const customerid = Number(req.params.customerid);

        if (!Number.isInteger(customerid) || customerid <= 0) {
            return res.status(400).json({
                message: "Invalid customer ID"
            });
        }

        const customer = await Customer.findByPk(customerid);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // Fetch this customer's complete invoice and payment history.
        const invoices = await Invoice.findAll({
            where: { customerid },
            order: [
                ["dateofissue", "DESC"],
                ["invoiceid", "ASC"]
            ]
        });

        const payments = await Payment.findAll({
            where: { customerid },
            order: [
                ["date", "DESC"],
                ["paymentid", "DESC"]
            ]
        });

        const invoiceIds = invoices.map(invoice => invoice.invoiceid);
        const paymentIds = payments.map(payment => payment.paymentid);

        // Fetch allocations belonging to these invoices and payments.
        const allocationConditions = [];

        if (invoiceIds.length > 0) {
            allocationConditions.push({
                invoiceid: { [Op.in]: invoiceIds }
            });
        }

        if (paymentIds.length > 0) {
            allocationConditions.push({
                paymentid: { [Op.in]: paymentIds }
            });
        }

        const allocations = allocationConditions.length > 0
            ? await PaymentAllocation.findAll({
                where: {
                    [Op.or]: allocationConditions
                },
                include: [
                    {
                        model: Payment,
                        attributes: [
                            "paymentid",
                            "amount",
                            "date",
                            "customerid"
                        ],
                        required: false
                    },
                    {
                        model: Invoice,
                        attributes: [
                            "invoiceid",
                            "amount",
                            "dateofissue",
                            "duedate",
                            "customerid"
                        ],
                        required: false
                    }
                ],
                order: [["allocationid", "ASC"]]
            })
            : [];

        const roundMoney = value =>
            Math.round((Number(value) + Number.EPSILON) * 100) / 100;

        const today = new Date().toISOString().slice(0, 10);

        const invoiceById = new Map(
            invoices.map(invoice => [invoice.invoiceid, invoice])
        );

        const paymentById = new Map(
            payments.map(payment => [payment.paymentid, payment])
        );

        const allocatedByInvoice = new Map();
        const allocatedByPayment = new Map();
        const allocatedByInvoiceBeforeDue = new Map();

        for (const allocation of allocations) {
            const amount = Number(allocation.amount);
            const invoiceid = allocation.invoiceid;
            const paymentid = allocation.paymentid;

            allocatedByInvoice.set(
                invoiceid,
                roundMoney((allocatedByInvoice.get(invoiceid) || 0) + amount)
            );

            allocatedByPayment.set(
                paymentid,
                roundMoney((allocatedByPayment.get(paymentid) || 0) + amount)
            );

            const invoice = invoiceById.get(invoiceid);
            const payment = paymentById.get(paymentid);

            if (
                invoice &&
                payment &&
                payment.date <= invoice.duedate
            ) {
                allocatedByInvoiceBeforeDue.set(
                    invoiceid,
                    roundMoney(
                        (allocatedByInvoiceBeforeDue.get(invoiceid) || 0) +
                        amount
                    )
                );
            }
        }

        // Enrich every invoice with its current balance and history.
        const invoiceHistory = invoices.map(invoice => {
            const originalAmount = Number(invoice.amount);
            const remainingAmount = Number(invoice.remainingamount);

            const amountAllocated = roundMoney(
                allocatedByInvoice.get(invoice.invoiceid) || 0
            );

            const amountPaid = roundMoney(
                originalAmount - remainingAmount
            );

            const dueDate = invoice.duedate;
            const overdueNow =
                remainingAmount > 0 && dueDate < today;

            // An invoice was overdue if its due date passed before
            // it was fully paid, or it remains unpaid past its due date.
            const allocatedByDueDate = roundMoney(
                allocatedByInvoiceBeforeDue.get(invoice.invoiceid) || 0
            );

            const wasEverOverdue =
                dueDate < today &&
                allocatedByDueDate < originalAmount;

            const currentStatus =
                remainingAmount <= 0
                    ? "done"
                    : overdueNow
                        ? "overdue"
                        : "pending";

            const invoiceAllocations = allocations
                .filter(allocation =>
                    allocation.invoiceid === invoice.invoiceid
                )
                .map(allocation => ({
                    allocationid: allocation.allocationid,
                    paymentid: allocation.paymentid,
                    paymentdate: allocation.Payment?.date ?? null,
                    amount: Number(allocation.amount)
                }));

            return {
                ...invoice.toJSON(),
                amount: originalAmount,
                remainingamount: remainingAmount,
                amountpaid: amountPaid,
                amountallocated: amountAllocated,
                status: currentStatus,
                overdueNow,
                wasEverOverdue,
                allocations: invoiceAllocations
            };
        });

        // Enrich every payment with all invoices it paid.
        const paymentHistory = payments.map(payment => {
            const paymentAllocations = allocations
                .filter(allocation =>
                    allocation.paymentid === payment.paymentid
                )
                .map(allocation => ({
                    allocationid: allocation.allocationid,
                    invoiceid: allocation.invoiceid,
                    invoiceDate: allocation.Invoice?.dateofissue ?? null,
                    invoiceDueDate: allocation.Invoice?.duedate ?? null,
                    amount: Number(allocation.amount)
                }));

            const amount = Number(payment.amount);
            const amountAllocated = roundMoney(
                allocatedByPayment.get(payment.paymentid) || 0
            );

            return {
                ...payment.toJSON(),
                amount,
                amountallocated: amountAllocated,
                unallocatedamount: roundMoney(amount - amountAllocated),
                allocations: paymentAllocations
            };
        });

        const totalPurchases = roundMoney(
            invoices.reduce((sum, invoice) =>
                sum + Number(invoice.amount), 0)
        );

        const totalPaymentsReceived = roundMoney(
            payments.reduce((sum, payment) =>
                sum + Number(payment.amount), 0)
        );

        const totalAllocated = roundMoney(
            allocations.reduce((sum, allocation) =>
                sum + Number(allocation.amount), 0)
        );

        const unallocatedAmount = roundMoney(
            totalPaymentsReceived - totalAllocated
        );

        const outstandingBalance = roundMoney(
            invoices.reduce((sum, invoice) =>
                sum + Number(invoice.remainingamount), 0)
        );

        const currentInvoices = invoiceHistory.filter(
            invoice => invoice.remainingamount > 0
        );

        const overdueInvoices = currentInvoices.filter(
            invoice => invoice.overdueNow
        );

        const summary = {
            totalPurchases,
            totalPaymentsReceived,
            totalAllocated,
            unallocatedAmount,
            outstandingBalance,
            totalInvoiceCount: invoices.length,
            currentInvoiceCount: currentInvoices.length,
            overdueInvoiceCount: overdueInvoices.length,
            hasEverBeenOverdue: invoiceHistory.some(
                invoice => invoice.wasEverOverdue
            )
        };

        return res.json({
            customer,
            summary,
            currentInvoices,
            invoiceHistory,
            payments: paymentHistory,
            allocations: allocations.map(allocation => ({
                allocationid: allocation.allocationid,
                paymentid: allocation.paymentid,
                invoiceid: allocation.invoiceid,
                amount: Number(allocation.amount),
                paymentdate: allocation.Payment?.date ?? null
            }))
        });
    } catch (error) {
        console.error("Failed to fetch customer details:", error);

        return res.status(500).json({
            message: "Failed to fetch customer details"
        });
    }
};

module.exports = {
    getCustomers,
    createCustomer,
    getCustomerDetails
};
