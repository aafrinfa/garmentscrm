
<template>
    <v-app>
        <Navbar />

        <v-main>
            <v-container class="py-8">

                <!-- Welcome section -->
                <section class="welcome-section mb-8">
                    <div class="welcome-content">
                        <div class="text-overline mb-2">
                            YOUR BUSINESS DASHBOARD
                        </div>

                        <h1 class="text-h3 font-weight-bold mb-4">
                            Welcome to My CRM
                        </h1>

                        <p class="text-body-1 text-medium-emphasis welcome-text">
                            Everything you need to manage your garments
                            business, all in one place.
                        </p>

                        <div class="d-flex flex-wrap ga-3 mt-6">
                            <v-btn
                                color="primary"
                                prepend-icon="mdi-account-group-outline"
                                to="/customers"
                                rounded="lg"
                                size="large"
                            >
                                View Customers
                            </v-btn>

                            <v-btn
                                variant="outlined"
                                color="primary"
                                prepend-icon="mdi-receipt-text-outline"
                                to="/invoices"
                                rounded="lg"
                                size="large"
                            >
                                View Invoices
                            </v-btn>
                        </div>
                    </div>

                    <div class="welcome-illustration">
                        <v-icon
                            icon="mdi-store-outline"
                            size="110"
                            color="primary"
                        />
                        <div class="illustration-caption">
                            Manage your business with ease
                        </div>
                    </div>
                </section>

                <!-- Quick access -->
                <div class="section-heading mb-4">
                    <div>
                        <h2 class="text-h5 font-weight-bold">
                            Quick Access
                        </h2>
                        <p class="text-body-2 text-medium-emphasis mt-1">
                            Jump straight into what you need.
                        </p>
                    </div>
                </div>

                <v-row>
                    <v-col
                        v-for="item in sections"
                        :key="item.title"
                        cols="12"
                        sm="6"
                        md="4"
                    >
                        <v-card
                            :to="item.to"
                            class="section-card h-100"
                            rounded="lg"
                            elevation="0"
                            border
                        >
                            <v-card-text class="pa-5">
                                <div class="d-flex align-start justify-space-between">
                                    <v-avatar
                                        color="primary"
                                        variant="tonal"
                                        rounded="lg"
                                        size="54"
                                    >
                                        <v-icon
                                            :icon="item.icon"
                                            size="28"
                                        />
                                    </v-avatar>

                                    <v-icon
                                        icon="mdi-arrow-top-right"
                                        color="medium-emphasis"
                                    />
                                </div>

                                <h3 class="text-h6 font-weight-bold mt-5 mb-2">
                                    {{ item.title }}
                                </h3>

                                <p class="text-body-2 text-medium-emphasis description">
                                    {{ item.description }}
                                </p>

                                <v-divider class="my-4" />

                                <div class="text-body-2 font-weight-medium text-primary">
                                    {{ item.action }}
                                    <v-icon
                                        icon="mdi-arrow-right"
                                        size="16"
                                        class="ml-1"
                                    />
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <!-- Bottom information section -->
                <v-card
                    class="mt-8"
                    rounded="lg"
                    variant="tonal"
                    color="primary"
                >
                    <v-card-text class="pa-5">
                        <div class="d-flex align-center ga-4">
                            <v-avatar
                                color="primary"
                                variant="flat"
                                size="48"
                            >
                                <v-icon
                                    icon="mdi-clipboard-check-outline"
                                    size="26"
                                />
                            </v-avatar>

                            <div>
                                <h3 class="text-subtitle-1 font-weight-bold">
                                    Your Business, All in One Place
                                </h3>

                                <p class="text-body-2 mt-1">
                                    Keep customer records organised,
                                    track invoices, and stay on top of payments.
                                </p>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";

const sections = [
    {
        title: "Customers",
        description: "Manage customer details, payment duration, and account history.",
        action: "Manage customers",
        to: "/customers",
        icon: "mdi-account-group-outline"
    },
    {
        title: "Invoices",
        description: "Create invoices, check outstanding balances, and track due dates.",
        action: "Manage invoices",
        to: "/invoices",
        icon: "mdi-receipt-text-outline"
    },
    {
        title: "Payments",
        description: "Record payments and review how amounts are allocated to invoices.",
        action: "Manage payments",
        to: "/payments",
        icon: "mdi-cash-multiple"
    }
];
</script>

<style scoped>
.welcome-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 40px;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 12px;
}

.welcome-content {
    flex: 1;
}

.welcome-text {
    max-width: 540px;
    line-height: 1.8;
}

.welcome-illustration {
    min-width: 220px;
    min-height: 190px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    border-radius: 12px;
}

.illustration-caption {
    font-size: 0.85rem;
    text-align: center;
    color: rgb(var(--v-theme-primary));
}

.section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-card {
    transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.section-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 18px rgba(0, 0, 0, 0.07) !important;
}

.description {
    line-height: 1.7;
    min-height: 48px;
}

@media (max-width: 600px) {
    .welcome-section {
        padding: 24px;
    }

    .welcome-illustration {
        display: none;
    }

    .welcome-section h1 {
        font-size: 2rem !important;
    }
}
</style>
