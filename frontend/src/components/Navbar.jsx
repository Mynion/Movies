
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

const API_URL = "http://localhost:8080/api";

function Navbar({ search, setSearch }) {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${API_URL}/auth/me`, {
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    setUser(null);
                    return null;
                }
                return response.json();
            })
            .then((data) => {
                if (data) {
                    setUser(data);
                }
            })
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                setUser(null);
                navigate("/login");
            }
        } catch (error) {
            console.error("Błąd podczas wylogowywania:", error);
        }
    };

    return (
        <nav className="bg-[#242426] border-b border-[#303034]">
            <div className="max-w-6xl mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">

                <h1 className="text-xl font-bold text-white">
                    MovieDiary
                </h1>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">

                    <div className="flex items-center gap-3">

                        <Link to="/" className="text-gray-300 hover:text-white text-sm">
                            Filmy
                        </Link>

                        <Link to="/" className="text-gray-300 hover:text-white text-sm">
                            Seriale
                        </Link>

                        <Link to="/rankings" className="text-gray-300 hover:text-white text-sm">
                            Rankingi
                        </Link>

                        {user && (
                            <Link to="/lists" className="text-gray-300 hover:text-white text-sm">
                                Moje listy
                            </Link>
                        )}

                        {user && (
                            <>
                                <Link
                                    to="/lists"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Moje listy
                                </Link>

                                <Link
                                    to="/history"
                                    className="text-gray-300 hover:text-white text-sm"
                                >
                                    Historia
                                </Link>
                            </>
                        )}

                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="text-gray-300 hover:text-white text-sm"
                            >
                                Wyloguj
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white text-sm">
                                    Zaloguj się
                                </Link>

                                <Link to="/register" className="text-gray-300 hover:text-white text-sm">
                                    Rejestracja
                                </Link>
                            </>
                        )}

                    </div>

                    <input
                        type="text"
                        placeholder="Szukaj filmu..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-[#303034] rounded-lg px-4 py-2 text-white outline-none focus:ring-1 focus:ring-[#cf6054]"
                    />

                </div>
            </div>
        </nav>
    );
}

export default Navbar;
