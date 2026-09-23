import axios from "axios";

const API_URL = "http://localhost:3000/api/invoices";

export const getInvoices = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createInvoice = async (invoice) => {
    const response = await axios.post(API_URL, invoice);
    return response.data;
};

