import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";
import { searchMovies } from "../services/tmdb";

function Home() {
    const [search, setSearch] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [type, setType] = useState("all");
    const [minRating, setMinRating] = useState(0);
    const [sort, setSort] = useState("relevance");

    useEffect(() => {
        const controller = new AbortController();

        async function loadMovies() {
            setLoading(true);
            setError("");

            try {
                const results = await searchMovies(search);

                if (!controller.signal.aborted) {
                    setMovies(results);
                }
            } catch {
                if (!controller.signal.aborted) {
                    setError("Wystąpił problem z pobieraniem filmów.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        const timeout = setTimeout(loadMovies, 400);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [search]);

    const filteredMovies = movies
        .filter((movie) => {
            if (type === "all") return true;
            return movie.media_type === type;
        })
        .filter((movie) => movie.vote_average >= minRating)
        .sort((a, b) => {
            if (sort === "rating") {
                return b.vote_average - a.vote_average;
            }

            return 0;
        });


    return (
        <div className="min-h-screen bg-[#181818] text-white">

            <Navbar search={search} setSearch={setSearch} />

            <main className="max-w-5xl mx-auto px-5 py-12">

                <section className="bg-[#242426] rounded-2xl p-6 mb-6 border border-[#303034]">

                    <h1 className="text-2xl font-bold">
                        {search
                            ? `Wyniki dla frazy: ${search}`
                            : "Popularne filmy i seriale"}
                    </h1>

                </section>

                <section className="bg-[#242426] rounded-2xl p-6 mb-10 border border-[#303034]">

                    <div className="flex justify-between items-center mb-6">

                        <div>
                            <h2 className="text-xl font-bold">Filtry</h2>

                            <p className="text-gray-400 text-sm mt-1">
                                Zastosowane filtry wyszukiwania.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setType("all");
                                setMinRating(0);
                                setSort("relevance");
                            }}
                            className="bg-[#303034] px-4 py-2 rounded-lg text-sm"
                        >
                            Wyczyść filtry
                        </button>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div>
                            <label className="text-gray-400 text-sm">
                                Typ
                            </label>

                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full mt-2 bg-[#303034] p-3 rounded-lg"
                            >
                                <option value="all">Filmy i seriale</option>
                                <option value="movie">Filmy</option>
                                <option value="tv">Seriale</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-400 text-sm">
                                Minimalna ocena
                            </label>

                            <select
                                value={minRating}
                                onChange={(e) => setMinRating(Number(e.target.value))}
                                className="w-full mt-2 bg-[#303034] p-3 rounded-lg"
                            >
                                <option value="0">Wszystkie</option>
                                <option value="5">5+</option>
                                <option value="6">6+</option>
                                <option value="7">7+</option>
                                <option value="8">8+</option>
                                <option value="9">9+</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-400 text-sm">
                                Sortowanie
                            </label>

                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full mt-2 bg-[#303034] p-3 rounded-lg"
                            >
                                <option value="relevance">Trafność</option>
                                <option value="rating">Najwyższa ocena</option>
                            </select>
                        </div>

                    </div>
                </section>

                <div className="flex justify-between items-center mb-5">

                    <div>
                        <h2 className="text-2xl font-bold">Wyniki</h2>

                        <p className="text-gray-400 text-sm">
                            Znaleziono {filteredMovies.length} wyników
                        </p>
                    </div>

                </div>

                {loading && <p>Ładowanie filmów...</p>}

                {error && <p className="text-red-400">{error}</p>}

                {!loading && !error && (
                    <div className="flex flex-col gap-5">

                        {filteredMovies.map((movie) => (
                            <MovieCard
                                key={`${movie.media_type}-${movie.id}`}
                                movie={movie}
                            />
                        ))}

                        {filteredMovies.length === 0 && (
                            <p className="text-gray-400">
                                Nie znaleziono produkcji.
                            </p>
                        )}

                    </div>
                )}

            </main>
        </div>
    );
}

export default Home;