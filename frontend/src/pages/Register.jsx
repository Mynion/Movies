
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../services/auth";
import Navbar from "../components/Navbar.jsx";

function Register() {
    const navigate = useNavigate();

    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        if (password !== repeatPassword) {
            setError("Hasła nie są takie same.");
            return;
        }

        setLoading(true);

        try {
            await register(login, email, password);
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#181818]">
            <Navbar />

            <div className="flex items-center justify-center px-4 py-10">
                <div className="bg-[#242426] border border-[#303034] rounded-2xl p-8 w-full max-w-md">

                    <h1 className="text-3xl font-bold text-white text-center mb-6">
                        Zarejestruj się
                    </h1>

                    {error && (
                        <div className="bg-red-900/30 text-red-400 p-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">
                                Login
                            </label>

                            <input
                                type="text"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                                placeholder="Wprowadź login"
                                required
                                className="w-full bg-[#303034] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#cf6054]"
                            />
                        </div>

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

                        <div>
                            <label className="block text-gray-300 text-sm mb-2">
                                Powtórz hasło
                            </label>

                            <input
                                type="password"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                placeholder="Powtórz hasło"
                                required
                                className="w-full bg-[#303034] text-white p-3 rounded-lg outline-none focus:ring-2 focus:ring-[#cf6054]"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#cf6054] hover:bg-[#b94d43] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
                        >
                            {loading ? "Rejestrowanie..." : "Zarejestruj się"}
                        </button>

                    </form>

                    <p className="text-gray-400 text-center mt-6 text-sm">
                        Masz już konto?{" "}
                        <Link
                            to="/login"
                            className="text-[#cf6054] hover:underline"
                        >
                            Zaloguj się
                        </Link>
                    </p>

                </div>
            </div>
        </div>
    );
}

export default Register;
