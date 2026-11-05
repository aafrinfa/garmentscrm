const Customer = require("./Customer");
const Invoice = require("./Invoice");
const Payment = require("./Payment");
const PaymentAllocation = require("./PaymentAllocation");

Customer.hasMany(Invoice, {
    foreignKey: "customerid"
});
Invoice.belongsTo(Customer, {
    foreignKey: "customerid"
});

Customer.hasMany(Payment, {
    foreignKey: "customerid"
});
Payment.belongsTo(Customer, {
    foreignKey: "customerid"
});

Payment.hasMany(PaymentAllocation, {
    foreignKey: "paymentid"
});
PaymentAllocation.belongsTo(Payment, {
    foreignKey: "paymentid"
});

Invoice.hasMany(PaymentAllocation, {
    foreignKey: "invoiceid",
    sourceKey: "invoiceid"
});
PaymentAllocation.belongsTo(Invoice, {
    foreignKey: "invoiceid",
    targetKey: "invoiceid"
});

module.exports = {
    Customer,
    Invoice,
    Payment,
    PaymentAllocation
};