const express = require("express");

const {
    getCustomers,
    createCustomer,
    getCustomerDetails
} = require("../controllers/customerController");

const router = express.Router();

router.get("/", getCustomers);
router.get("/:customerid/details", getCustomerDetails);
router.post("/", createCustomer);


module.exports = router;