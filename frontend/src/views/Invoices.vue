
<template>
    <v-app>
        <Navbar />

        <v-main>
            <v-container>
                <h1>Invoices</h1>

                <!-- Add Invoice Form -->
                <v-form @submit.prevent="addInvoice">
                    <v-text-field
                        v-model.number="amount"
                        label="Amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                    />

                    <v-text-field
                        v-model="dateofissue"
                        label="Date of Issue"
                        type="date"
                        required
                    />

                    <v-select
                        v-model="customerid"
                        :items="sortedCustomers"
                        item-title="name"
                        item-value="customerid"
                        label="Customer"
                        placeholder="Select a customer"
                        no-data-text="No customers available"
                        required
                    />

                    <v-btn
                        type="submit"
                        color="primary"
                        :loading="submitting"
                    >
                        Add Invoice
                    </v-btn>
                </v-form>

                <br />

                <v-alert
                    v-if="errorMessage"
                    type="error"
                    closable
                    @click:close="errorMessage = ''"
                >
                    {{ errorMessage }}
                </v-alert>

                <h2 class="mt-6 mb-3">Invoice List</h2>

                <!-- Status Legend -->
                <v-row class="mb-4" align="center" dense>
                    <v-col cols="auto">
                        <span class="text-body-2 font-weight-medium">
                            Status:
                        </span>
                    </v-col>

                    <v-col cols="auto">
                        <v-chip color="yellow-darken-2" size="small">
                            Pending
                        </v-chip>
                    </v-col>

                    <v-col cols="auto">
                        <v-chip color="green" size="small">
                            Done
                        </v-chip>
                    </v-col>

                    <v-col cols="auto">
                        <v-chip color="red" size="small">
                            Overdue
                        </v-chip>
                    </v-col>
                </v-row>

                <v-table>
                    <thead>
                        <tr>
                            <th>Invoice ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Date of Issue</th>
                            <th>Due Date</th>
                            <th>Remaining Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="invoice in invoices"
                            :key="invoice.invoiceid"
                        >
                            <td>{{ invoice.invoiceid }}</td>
                            <td>
                                {{ getCustomerName(invoice.customerid) }}
                            </td>
                            <td>{{ formatAmount(invoice.amount) }}</td>
                            <td>{{ formatDate(invoice.dateofissue) }}</td>
                            <td>{{ formatDate(invoice.duedate) }}</td>
                            <td>
                                {{ formatAmount(invoice.remainingamount) }}
                            </td>
                            <td>
                                <v-chip
                                    :color="getStatusColor(invoice.status)"
                                    size="small"
                                >
                                    {{ formatStatus(invoice.status) }}
                                </v-chip>
                            </td>
                        </tr>

                        <tr v-if="invoices.length === 0">
                            <td colspan="7" class="text-center">
                                No invoices found
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";

import {
    getInvoices,
    createInvoice
} from "../services/invoiceService";

import { getCustomers } from "../services/customerService";

const amount = ref("");
const dateofissue = ref("");
const customerid = ref(null);

const invoices = ref([]);
const customers = ref([]);
const errorMessage = ref("");
const submitting = ref(false);

const sortedCustomers = computed(() => {
    return [...customers.value].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
            sensitivity: "base"
        })
    );
});

const getCustomerName = (id) => {
    const customer = customers.value.find(
        (customer) => Number(customer.customerid) === Number(id)
    );

    return customer?.name ?? `Customer #${id}`;
};

const formatDate = (value) => {
    if (!value) return "-";

    // DATEONLY values arrive as YYYY-MM-DD.
    const dateString = String(value).slice(0, 10);
    const [year, month, day] = dateString.split("-");

    if (!year || !month || !day) return dateString;

    return `${day}-${month}-${year}`;
};

const formatAmount = (value) => {
    return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
        case "pending":
            return "yellow-darken-2";
        case "done":
            return "green";
        case "overdue":
            return "red";
        default:
            return "grey";
    }
};

const formatStatus = (status) => {
    if (!status) return "-";

    return String(status).charAt(0).toUpperCase()
        + String(status).slice(1).toLowerCase();
};

const loadInvoices = async () => {
    try {
        invoices.value = await getInvoices();
    } catch (error) {
        console.error("Failed to load invoices", error);
        errorMessage.value = "Failed to load invoices";
    }
};

const loadCustomers = async () => {
    try {
        customers.value = await getCustomers();
    } catch (error) {
        console.error("Failed to load customers", error);
        errorMessage.value = "Failed to load customers";
    }
};

const addInvoice = async () => {
    try {
        errorMessage.value = "";
        submitting.value = true;

        const newInvoice = {
            amount: amount.value,
            dateofissue: dateofissue.value,
            customerid: customerid.value
        };

        const invoice = await createInvoice(newInvoice);

        invoices.value.push(invoice);

        amount.value = "";
        dateofissue.value = "";
        customerid.value = null;
    } catch (error) {
        console.error("Failed to create invoice", error);

        errorMessage.value =
            error.response?.data?.message ??
            "Failed to create invoice";
    } finally {
        submitting.value = false;
    }
};

onMounted(async () => {
    await Promise.all([
        loadInvoices(),
        loadCustomers()
    ]);
});
</script>
