import axios from "axios";

const API_URL = "http://localhost:3000/api/customers";

export const getCustomers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createCustomer = async (customer) => {
    const response = await axios.post(API_URL, customer);
    return response.data;
};