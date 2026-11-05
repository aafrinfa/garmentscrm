
<template>
    <v-app>
        <Navbar />

        <v-main>
            <v-container class="py-6">
                <v-btn
                    variant="text"
                    prepend-icon="mdi-arrow-left"
                    to="/customers"
                    class="mb-4"
                >
                    Back to Customers
                </v-btn>

                <div v-if="loading" class="text-center pa-8">
                    <v-progress-circular
                        indeterminate
                        color="primary"
                        size="40"
                    />
                    <p class="mt-3">Loading customer details...</p>
                </div>

                <v-alert
                    v-else-if="errorMessage"
                    type="error"
                    variant="tonal"
                >
                    {{ errorMessage }}
                </v-alert>

                <template v-else-if="customer">
                    <!-- Customer information -->
                    <div class="d-flex align-center justify-space-between flex-wrap mb-6">
                        <div>
                            <h1 class="text-h4 font-weight-bold">
                                {{ customer.name }}
                            </h1>

                            <p class="text-medium-emphasis mt-2">
                                Customer #{{ customer.customerid }}
                                · {{ customer.phone }}
                            </p>

                            <p class="text-medium-emphasis">
                                Payment duration: {{ customer.duration }} days
                            </p>
                        </div>

                        <v-chip
                            v-if="summary.hasEverBeenOverdue"
                            color="error"
                            variant="tonal"
                        >
                            Has been overdue
                        </v-chip>

                        <v-chip
                            v-else
                            color="success"
                            variant="tonal"
                        >
                            No overdue history detected
                        </v-chip>
                    </div>

                    <!-- Financial summary -->
                    <v-row>
                        <v-col cols="12" sm="6" md="3">
                            <v-card variant="outlined" class="pa-4 h-100">
                                <p class="text-medium-emphasis">
                                    Total Purchases
                                </p>
                                <h2 class="text-h5 mt-2">
                                    {{ money(summary.totalPurchases) }}
                                </h2>
                                <p class="text-caption mt-2">
                                    {{ summary.totalInvoiceCount }} invoices
                                </p>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6" md="3">
                            <v-card variant="outlined" class="pa-4 h-100">
                                <p class="text-medium-emphasis">
                                    Payments Received
                                </p>
                                <h2 class="text-h5 mt-2 text-success">
                                    {{ money(summary.totalPaymentsReceived) }}
                                </h2>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6" md="3">
                            <v-card variant="outlined" class="pa-4 h-100">
                                <p class="text-medium-emphasis">
                                    Outstanding Balance
                                </p>
                                <h2
                                    class="text-h5 mt-2"
                                    :class="Number(summary.outstandingBalance) > 0
                                        ? 'text-error'
                                        : 'text-success'"
                                >
                                    {{ money(summary.outstandingBalance) }}
                                </h2>
                            </v-card>
                        </v-col>

                        <v-col cols="12" sm="6" md="3">
                            <v-card variant="outlined" class="pa-4 h-100">
                                <p class="text-medium-emphasis">
                                    Current Invoices
                                </p>
                                <h2 class="text-h5 mt-2">
                                    {{ summary.currentInvoiceCount }}
                                </h2>
                                <p class="text-caption mt-2">
                                    {{ summary.overdueInvoiceCount }} overdue
                                </p>
                            </v-card>
                        </v-col>
                    </v-row>

                    <!-- Current invoices -->
                    <h2 class="text-h5 mt-8 mb-3">
                        Current Invoices
                    </h2>

                    <v-card variant="outlined">
                        <v-table>
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th class="text-right">Total</th>
                                    <th class="text-right">Paid</th>
                                    <th class="text-right">Remaining</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="invoice in currentInvoices"
                                    :key="invoice.invoiceid"
                                >
                                    <td>{{ invoice.invoiceid }}</td>
                                    <td>{{ formatDate(invoice.dateofissue) }}</td>
                                    <td>{{ formatDate(invoice.duedate) }}</td>
                                    <td class="text-right">
                                        {{ money(invoice.amount) }}
                                    </td>
                                    <td class="text-right">
                                        {{ money(invoice.amountpaid) }}
                                    </td>
                                    <td class="text-right">
                                        {{ money(invoice.remainingamount) }}
                                    </td>
                                    <td>
                                        <v-chip
                                            size="small"
                                            :color="statusColor(invoice.status)"
                                            variant="tonal"
                                        >
                                            {{ invoice.status }}
                                        </v-chip>
                                    </td>
                                </tr>

                                <tr v-if="currentInvoices.length === 0">
                                    <td colspan="7" class="text-center pa-6">
                                        No outstanding invoices.
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>

                    <!-- Invoice history -->
                    <h2 class="text-h5 mt-8 mb-3">
                        Complete Invoice History
                    </h2>

                    <v-card variant="outlined">
                        <v-table>
                            <thead>
                                <tr>
                                    <th>Invoice ID</th>
                                    <th>Issue Date</th>
                                    <th>Due Date</th>
                                    <th class="text-right">Amount</th>
                                    <th class="text-right">Remaining</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr
                                    v-for="invoice in invoiceHistory"
                                    :key="invoice.invoiceid"
                                >
                                    <td>{{ invoice.invoiceid }}</td>
                                    <td>{{ formatDate(invoice.dateofissue) }}</td>
                                    <td>{{ formatDate(invoice.duedate) }}</td>
                                    <td class="text-right">
                                        {{ money(invoice.amount) }}
                                    </td>
                                    <td class="text-right">
                                        {{ money(invoice.remainingamount) }}
                                    </td>
                                    <td>
                                        <v-chip
                                            size="small"
                                            :color="statusColor(invoice.status)"
                                            variant="tonal"
                                        >
                                            {{ invoice.status }}
                                        </v-chip>
                                    </td>
                                </tr>

                                <tr v-if="invoiceHistory.length === 0">
                                    <td colspan="6" class="text-center pa-6">
                                        No invoice history.
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>

                    <!-- Payment history -->
                    <h2 class="text-h5 mt-8 mb-3">
                        Payment History
                    </h2>

                    <v-card
                        v-for="payment in payments"
                        :key="payment.paymentid"
                        variant="outlined"
                        class="mb-4"
                    >
                        <v-card-title class="d-flex justify-space-between flex-wrap ga-2">
                            <span>Payment #{{ payment.paymentid }}</span>
                            <span class="text-success">
                                {{ money(payment.amount) }}
                            </span>
                        </v-card-title>

                        <v-card-text>
                            <p class="mb-3">
                                Date: {{ formatDate(payment.date) }}
                            </p>

                            <p class="mb-3">
                                Allocated:
                                {{ money(payment.amountallocated) }}
                                · Unallocated:
                                {{ money(payment.unallocatedamount) }}
                            </p>

                            <p class="font-weight-medium mb-2">
                                Invoice allocations
                            </p>

                            <v-table density="compact">
                                <thead>
                                    <tr>
                                        <th>Invoice ID</th>
                                        <th>Invoice Date</th>
                                        <th class="text-right">
                                            Amount Applied
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr
                                        v-for="allocation in payment.allocations"
                                        :key="allocation.allocationid"
                                    >
                                        <td>{{ allocation.invoiceid }}</td>
                                        <td>
                                            {{ formatDate(allocation.dateofissue) }}
                                        </td>
                                        <td class="text-right">
                                            {{ money(allocation.amount) }}
                                        </td>
                                    </tr>

                                    <tr v-if="!payment.allocations?.length">
                                        <td colspan="3" class="text-center">
                                            No invoice allocations.
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>
                        </v-card-text>
                    </v-card>

                    <v-alert
                        v-if="payments.length === 0"
                        type="info"
                        variant="tonal"
                    >
                        No payments recorded for this customer.
                    </v-alert>
                </template>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import Navbar from "../components/Navbar.vue";
import { getCustomerDetails } from "../services/customerService";

const route = useRoute();

const customer = ref(null);
const summary = ref({});
const currentInvoices = ref([]);
const invoiceHistory = ref([]);
const payments = ref([]);

const loading = ref(true);
const errorMessage = ref("");

const money = (value) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(value ?? 0));
};

const formatDate = (value) => {
    if (!value) return "—";

    // DATEONLY values arrive as YYYY-MM-DD.
    const parts = String(value).slice(0, 10).split("-");

    if (parts.length !== 3) return value;

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

const statusColor = (status) => {
    switch (String(status ?? "").toLowerCase()) {
        case "done":
            return "success";
        case "overdue":
            return "error";
        default:
            return "warning";
    }
};

const loadDetails = async () => {
    loading.value = true;
    errorMessage.value = "";

    try {
        const data = await getCustomerDetails(route.params.customerid);

        customer.value = data.customer;
        summary.value = data.summary ?? {};
        currentInvoices.value = data.currentInvoices ?? [];
        invoiceHistory.value = data.invoiceHistory ?? [];
        payments.value = data.payments ?? [];
    } catch (error) {
        console.error("Failed to load customer details:", error);

        errorMessage.value =
            error.response?.data?.message ??
            "Failed to load customer details. Check that the backend is running and the customer exists.";
    } finally {
        loading.value = false;
    }
};

watch(
    () => route.params.customerid,
    () => loadDetails()
);

onMounted(loadDetails);
</script>
