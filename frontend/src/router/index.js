import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Customers from "../views/Customers.vue";
import Invoices from "../views/Invoices.vue";
import Payments from "../views/Payments.vue";

const router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: "/",
            component: Home
        },
        {
            path: "/customers",
            component: Customers
        },
        {
            path: "/invoices",
            component: Invoices
        },
        {
            path: "/payments",
            component: Payments
        }
    ]
});

export default router;