<template>
    <v-app>
        <Navbar />
        <v-main>
            <v-container>
                <br>
                <br>
                <v-card>
                    <v-card-title>
                        Welcome to My CRM
                    </v-card-title>
                    <v-card-text>
                        Tracks your customers, invoices, and payments all in one place. Use the navigation bar to access different sections of the application.
                    </v-card-text>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
</script>