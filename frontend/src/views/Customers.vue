<template>
    <v-app>
        <Navbar />

        <v-main>
            <v-container>
                <h1>Customers</h1>

                <!-- Add Customer Form -->
                <v-form @submit.prevent="addCustomer">
                    <v-text-field
                        v-model="name"
                        label="Name"
                        required
                    />

                    <v-text-field
                        v-model="phone"
                        label="Phone"
                        required
                    />

                    <v-text-field
                        v-model.number="duration"
                        label="Duration (Days)"
                        type="number"
                        min="1"
                        step="1"
                        :rules="[
                            value => value !== '' && value !== null || 'Duration is required',
                            value => Number.isInteger(Number(value)) || 'Duration must be an integer',
                            value => Number(value) >= 1 || 'Duration must be at least 1 day'
                        ]"
                        required
                    />

                    <v-btn
                        type="submit"
                        color="primary"
                        :loading="loading"
                    >
                        Add Customer
                    </v-btn>
                </v-form>

                <v-alert
                    v-if="errorMessage"
                    type="error"
                    class="mt-4"
                    closable
                    @click:close="errorMessage = ''"
                >
                    {{ errorMessage }}
                </v-alert>

                <!-- Customer List -->
                <h2 class="mt-6 mb-3">Customers List</h2>

                <v-table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Duration (Days)</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr
                            v-for="customer in customers"
                            :key="customer.customerid"
                            class="customer-row"
                            @click="$router.push(`/customers/${customer.customerid}`)"
                        >
                            <td>{{ customer.customerid }}</td>
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.phone }}</td>
                            <td>{{ customer.duration }}</td>
                        </tr>

                        <tr v-if="customers.length === 0">
                            <td colspan="4" class="text-center">
                                No customers found.
                            </td>
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
    getCustomers,
    createCustomer
} from "../services/customerService";

const name = ref("");
const phone = ref("");
const duration = ref("");

const customers = ref([]);
const loading = ref(false);
const errorMessage = ref("");

const loadCustomers = async () => {
    try {
        customers.value = await getCustomers();
    } catch (error) {
        console.error("Failed to load customers", error);
        errorMessage.value = "Failed to load customers.";
    }
};

const addCustomer = async () => {
    errorMessage.value = "";

    if (
        !name.value.trim() ||
        !phone.value.trim() ||
        duration.value === "" ||
        !Number.isInteger(Number(duration.value)) ||
        Number(duration.value) < 1
    ) {
        errorMessage.value = "Please enter a name, phone number, and a valid whole-number duration of at least 1 day.";
        return;
    }

    loading.value = true;

    try {
        const newCustomer = {
            name: name.value.trim(),
            phone: phone.value.trim(),
            duration: Number(duration.value)
        };

        await createCustomer(newCustomer);

        // Reload to ensure the table reflects the saved database record and ID.
        await loadCustomers();

        name.value = "";
        phone.value = "";
        duration.value = "";
    } catch (error) {
        console.error("Failed to create customer", error);
        errorMessage.value =
            error.response?.data?.message ?? "Failed to create customer.";
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    loadCustomers();
});
</script>


<style scoped>
.customer-row {
    cursor: pointer;
}

.customer-row:hover {
    background-color: rgba(0, 0, 0, 0.04);
}
</style>
