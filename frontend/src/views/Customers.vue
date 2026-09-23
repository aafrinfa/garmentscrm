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

            <v-btn type="submit" color="primary">
                Add Customer
            </v-btn>

        </v-form>



        <!-- Customer List -->

        <h2>Customers List</h2>

        <v-table>

            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Phone</th>
                </tr>
            </thead>

            <tbody>

                <tr
                    v-for="customer in customers"
                    :key="customer.id"
                >
                    <td>{{ customer.id }}</td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.phone }}</td>
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

const customers = ref([]);


const loadCustomers = async () => {
    try {
        customers.value = await getCustomers();
    } catch (error) {
        console.error("Failed to load customers", error);
    }
};


const addCustomer = async () => {
    try {
        const newCustomer = {
            name: name.value,
            phone: phone.value
        };
        const customer = await createCustomer(newCustomer);
        customers.value.push(customer);
        name.value = "";
        phone.value = "";
    } catch (error) {
        console.error("Failed to create customer", error);
    }
};


onMounted(() => {
    loadCustomers();
});

</script>