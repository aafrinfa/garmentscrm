<template>
    <v-app>
        <Navbar />
        <v-main>
            <v-container>

        <h1>Invoices</h1>

        <!-- Add Invoice Form -->

        <v-form @submit.prevent="addInvoice">
            
            <v-text-field
                v-model="amount"
                label="Amount"
                required
            />

            <v-text-field
                v-model="dateofissue"
                label="Date of Issue(YYYY-MM-DD)"
                required
            />

            <v-text-field
                v-model="duration"
                label="Duration in days"
                required
            />

            <v-text-field
                v-model="customerid"
                label="Customer ID"
                required
            />

            <v-btn type="submit" color="primary">
                Add Invoice
            </v-btn>

        </v-form>
        <br>
        <v-alert
        v-if="errorMessage"
        type="error"
>
        {{ errorMessage }}
        </v-alert>

        <h2>Invoice List</h2>

        <v-table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Amount</th>
                    <th>Date of Issue</th>
                    <th>Customer ID</th>
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
                    <td>{{ invoice.amount }}</td>
                    <td>{{ invoice.dateofissue }}</td>
                    <td>{{ invoice.customerid }}</td>
                    <td>{{ invoice.remainingamount }}</td>
                    <td>{{ invoice.status }}</td>
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
    getInvoices,
    createInvoice
} from "../services/invoiceService";


const amount = ref("");
const dateofissue = ref("");
const duration = ref("");
const customerid = ref("");

const invoices = ref([]);
const errorMessage = ref("");


const loadInvoices = async () => {
    try {
        invoices.value = await getInvoices();
    } catch (error) {
        console.error("Failed to load invoices", error);
    }
};


const addInvoice = async () => {
    try {
        errorMessage.value = "";
        const newInvoice = {
            amount: amount.value,
            dateofissue: dateofissue.value,
            duration: duration.value,
            customerid: customerid.value
        };
        const invoice = await createInvoice(newInvoice);
        invoices.value.push(invoice);
        amount.value = "";
        dateofissue.value = "";
        duration.value = "";
        customerid.value = "";
    } catch (error) {
        if (error.response?.status === 404) {
            errorMessage.value = "Customer not found";
        } else {
            errorMessage.value = "Failed to create invoice";
        }
    }
};


onMounted(() => {
    loadInvoices();
});


</script>