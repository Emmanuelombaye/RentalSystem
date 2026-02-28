/**
 * API Utility for Backend Communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : '/api');

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "An error occurred");
    }

    return response.json();
}

export const api = {
    dashboard: {
        getStats: () => fetchWithAuth("/dashboard/stats"),
    },
    properties: {
        getAll: () => fetchWithAuth("/properties"),
        getOne: (id: string) => fetchWithAuth(`/properties/${id}`),
        create: (data: any) => fetchWithAuth("/properties", { method: "POST", body: JSON.stringify(data) }),
    },
    units: {
        getAll: () => fetchWithAuth("/units"),
    },
    tenants: {
        getAll: () => fetchWithAuth("/tenants"),
    },
};
