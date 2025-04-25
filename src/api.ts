const baseUrl = "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/";

export const fetchTrainings = async () => {
    try {
        const res = await fetch(`${baseUrl}gettrainings`);
        if (!res.ok) throw new Error("Failed to fetch trainings");
        return await res.json();
    } catch (error) {
        console.error("Error fetching trainings:", error);
        throw error;
    }
};

export const fetchCustomers = async () => {
    try {
        const res = await fetch(`${baseUrl}customers`);
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        return data._embedded.customers.map((cust: any) => {
            const parts = cust._links.self.href.split("/");
            return { ...cust, id: Number(parts[parts.length - 1]) };
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

export const deleteTraining = async (id: number) => {
    try {
        const res = await fetch(`${baseUrl}trainings/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete training");
    } catch (error) {
        console.error("Error deleting training:", error);
        throw error;
    }
};

export const saveTraining = async (payload: any) => {
    try {
        const res = await fetch(`${baseUrl}trainings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to save training");
    } catch (error) {
        console.error("Error saving training:", error);
        throw error;
    }
};


export const deleteCustomer = async (id: number) => {
    try {
        const res = await fetch(`${baseUrl}customers/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete customer");
    } catch (error) {
        console.error("Error deleting customer:", error);
        throw error;
    }
};

export const saveCustomer = async (customerData: any, customerId?: number) => {
    try {
        const url = customerId ? `${baseUrl}customers/${customerId}` : `${baseUrl}customers`;
        const method = customerId ? "PUT" : "POST";
        const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
        });
        if (!res.ok) throw new Error("Failed to save customer");
    } catch (error) {
        console.error("Error saving customer:", error);
        throw error;
    }
};

export const resetApiData = async () => {
    try {
        const res = await fetch(`https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset`, { method: "POST" });
        if (!res.ok) throw new Error("Failed to reset API data");
    } catch (error) {
        console.error("Error resetting API data:", error);
        throw error;
    }
};
