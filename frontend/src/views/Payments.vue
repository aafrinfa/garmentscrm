<template>
    <v-app>
        <Navbar />

        <v-main>
            <v-container>
                <h1>Payments</h1>

                <v-form @submit.prevent="addPayment">
                    <v-text-field
                        v-model.number="amount"
                        label="Amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                    />

                    <v-text-field
                        v-model="date"
                        label="Payment Date"
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
                        Add Payment
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

                <h2 class="mt-6 mb-3">Payment List</h2>

                <v-table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Customer</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="payment in payments"
                            :key="payment.paymentid"
                        >
                            <td>{{ payment.paymentid }}</td>
                            <td>
                                {{ getCustomerName(payment.customerid) }}
                            </td>
                            <td>{{ formatAmount(payment.amount) }}</td>
                            <td>{{ formatDate(payment.date) }}</td>

                        </tr>

                        <tr v-if="payments.length === 0">
                            <td colspan="4" class="text-center">
                                No payments found
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
    getPayments,
    createPayment
} from "../services/paymentService";

import { getCustomers } from "../services/customerService";

const amount = ref("");
const date = ref("");
const customerid = ref(null);

const payments = ref([]);
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
    return String(value).slice(0, 10);
};

const formatAmount = (value) => {
    return Number(value).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
};

const loadPayments = async () => {
    try {
        payments.value = await getPayments();
    } catch (error) {
        console.error("Failed to load payments", error);
        errorMessage.value = "Failed to load payments";
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

const addPayment = async () => {
    try {
        errorMessage.value = "";
        submitting.value = true;

        const newPayment = {
            amount: amount.value,
            date: date.value,
            customerid: customerid.value
        };

        const payment = await createPayment(newPayment);

        payments.value.push(payment);

        amount.value = "";
        date.value = "";
        customerid.value = null;
    } catch (error) {
        console.error("Failed to create payment", error);

        errorMessage.value =
            error.response?.data?.message ??
            "Failed to create payment";
    } finally {
        submitting.value = false;
    }
};

onMounted(async () => {
    await Promise.all([
        loadPayments(),
        loadCustomers()
    ]);
});
</script>
