import axios from "axios";

const API_URL = "http://localhost:3000/api/payments";

export const getPayments = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createPayment = async (payment) => {
    const response = await axios.post(API_URL, payment);
    return response.data;
};

