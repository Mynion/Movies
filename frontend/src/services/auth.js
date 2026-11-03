const API_URL = "http://localhost:8080/api/auth";

export async function login(username, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify({
            username,
            password,
        }),
    });

    if (!response.ok) {
        throw new Error("Nieprawidłowy login lub hasło.");
    }

    return response.json();
}

export async function register(username, email, password) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            username,
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || JSON.stringify(data)
        );
    }

    return data;
}