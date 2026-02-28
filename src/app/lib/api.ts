/**
 * API Utility for Backend Communication
 */

const API_BASE_URL = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? "http://localhost:5000/api"
    : "/api";

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
