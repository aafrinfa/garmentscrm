<template>
    <v-app>
        <Navbar />
        <v-main>
            <v-container>

        <h1>Payments</h1>

        <!-- Add Payment Form -->

        <v-form @submit.prevent="addPayment">
            
            <v-text-field
                v-model="amount"
                label="Amount"
                required
            />

            <v-text-field
                v-model="date"
                label="Date (YYYY-MM-DD)"
                required
            />

            <v-text-field
                v-model="customerid"
                label="Customer ID"
                required
            />

            <v-text-field
                v-model="invoiceid"
                label="Invoice ID"
                required
            />

            <v-btn type="submit" color="primary">
                Add Payment
            </v-btn>

        </v-form>
        <br>
        <v-alert
        v-if="errorMessage"
        type="error"
>
        {{ errorMessage }}
        </v-alert>

        <h2>Payment List</h2>

        <v-table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Customer ID</th>
                    <th>Invoice ID</th>   
                </tr>
            </thead>

            <tbody>

                <tr
                    v-for="payment in payments"
                    :key="payment.paymentid"
                >
                    <td>{{ payment.paymentid }}</td>
                    <td>{{ payment.amount }}</td>
                    <td>{{ payment.date }}</td>
                    <td>{{ payment.customerid }}</td>
                    <td>{{ payment.invoiceid }}</td>
                </tr>

            </tbody>

        </v-table>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import {
    getPayments,
    createPayment
} from "../services/paymentService";


const amount = ref("");
const date = ref("");
const customerid = ref("");
const invoiceid = ref("");

const payments = ref([]);
const errorMessage = ref("");


const loadPayments = async () => {
    try {
        payments.value = await getPayments();
    } catch (error) {
        console.error("Failed to load payments", error);
    }
};


const addPayment = async () => {
    try {
        errorMessage.value = "";
        const newPayment = {
            amount: amount.value,
            date: date.value,
            customerid: customerid.value,
            invoiceid: invoiceid.value
        };
        const payment = await createPayment(newPayment);
        payments.value.push(payment);
        amount.value = "";
        date.value = "";
        customerid.value = "";
        invoiceid.value = "";   
    } catch (error) {
        if (error.response?.status === 404) {
            errorMessage.value = "Customer not found";
        } else {
            errorMessage.value = "Failed to create payment";
        }
    }
};


onMounted(() => {
    loadPayments();
});

</script>