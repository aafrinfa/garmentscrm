const express = require("express");
const cors = require("cors");

const sequelize = require("./config/database");
const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);

const PORT = 3000;

sequelize
    .sync()
    .then(() => {
        console.log("Database connected");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });