import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../services/auth";
import Navbar from "../components/Navbar.jsx";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            await login(email, password);

            navigate("/");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#181818] ">

            <Navbar/>

            <div className="flex items-center justify-center px-4">

                <div className="bg-[#242426] border border-[#303034] rounded-2xl p-8 w-full max-w-md ">

                    <h1 className="text-3xl font-bold text-white text-center mb-2">
                        Zaloguj się
                    </h1>

                    {error && (
                        <div className="bg-red-900/30 text-red-400 p-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">
                                Adres e-mail
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="twoj@email.pl"
                                required
                                className="w-full bg-[#303034] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#cf6054]"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">
                                Hasło
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Wprowadź hasło"
                                required
                                className="w-full bg-[#303034] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#cf6054]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#cf6054] hover:bg-[#b94d43] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Logowanie..." : "Zaloguj się"}
                        </button>

                    </form>

                    <p className="text-gray-400 text-center mt-6 text-sm">
                        Nie masz konta?{" "}

                        <Link
                            to="/register"
                            className="text-[#cf6054] hover:underline"
                        >
                            Zarejestruj się
                        </Link>
                    </p>

                </div>

            </div>
        </div>
    );
}

export default Login;