<template>
    <div>
        <Navbar />

        <h1>Customers</h1>

        <!-- Add Customer Form -->

        <form @submit.prevent="addCustomer">

            <div>
                <label>Name</label>

                <input
                    type="text"
                    v-model="name"
                    required
                />
            </div>

            <div>
                <label>Phone</label>

                <input
                    type="text"
                    v-model="phone"
                    required
                />
            </div>

            <button type="submit">
                Add Customer
            </button>

        </form>


        <!-- Customer List -->

        <h2>Customers List</h2>

        <table>

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
                    :key="customer.customerid"
                >
                    <td>{{ customer.customerid }}</td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.phone }}</td>
                </tr>

            </tbody>

        </table>

    </div>
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