
const cron = require("node-cron");
const { Op } = require("sequelize");
const Invoice = require("../models/invoice");

const checkOverdueInvoices = async () => {
    try {
        const now = new Date();

        const overdueInvoices = await Invoice.findAll({
            where: {
                remainingamount: {
                    [Op.gt]: 0
                },
                duedate: {
                    [Op.lt]: now
                },
                status: {
                    [Op.not]: "overdue"
                }
            }
        });

        for (const invoice of overdueInvoices) {
            invoice.status = "overdue";
            await invoice.save();
        }

        console.log(
            `Overdue check completed. ${overdueInvoices.length} invoice(s) marked overdue.`
        );

    } catch (error) {
        console.error("Overdue invoice check failed:", error);
    }
};

// Run every day at 12:05 AM, India time
cron.schedule("5 0 * * *", checkOverdueInvoices, {
    timezone: "Asia/Kolkata"
});

module.exports = checkOverdueInvoices;
