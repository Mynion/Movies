const API_URL = "/api/auth";

export async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Nieprawidłowy e-mail lub hasło.");
    }

    return response.json();
}

export async function register(username, email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            username,
            email,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Nie udało się utworzyć konta.");
    }

    return response.json();
}