import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import MovieCard from "../components/MovieCard";

import {
    searchMovies,
    searchSeries,
    getMovies,
    getSeries,
    getGenres
} from "../services/tmdb";

function Home() {
    const [search, setSearch] = useState("");

    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [type, setType] = useState("movie");
    const [genreId, setGenreId] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        async function loadGenres() {
            try {
                const data = await getGenres(type);

                if (!controller.signal.aborted) {
                    setGenres(data);
                    setGenreId("");
                }
            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error("Błąd pobierania gatunków:", err);
                }
            }
        }

        loadGenres();

        return () => controller.abort();
    }, [type]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadMovies() {
            setLoading(true);
            setError("");

            try {
                let data;

                if (search.trim()) {
                    data = type === "tv"
                        ? await searchSeries(search, controller.signal)
                        : await searchMovies(search, controller.signal);
                } else {
                    data = type === "tv"
                        ? await getSeries(page, genreId || null, controller.signal)
                        : await getMovies(page, genreId || null, controller.signal);
                }

                if (!controller.signal.aborted) {
                    setMovies(data.results ?? []);
                    setTotalPages(data.total_pages ?? 1);
                    setTotalResults(data.total_results ?? 0);
                }

            } catch (err) {
                if (!controller.signal.aborted) {
                    console.error("BŁĄD POBIERANIA:", err);
                    console.error("SZCZEGÓŁY:", err.message);

                    setError(`Błąd: ${err.message}`);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        const timeout = setTimeout(
            loadMovies,
            search.trim() ? 400 : 0
        );

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };

    }, [search, type, page, genreId]);

    const filteredMovies = movies.filter((movie) => {
        if (!genreId) return true;

        return movie.genre_ids?.includes(Number(genreId));
    });

    function handleTypeChange(value) {
        setType(value);
        setPage(1);
        setGenreId("");
    }

    function handleSearchChange(value) {
        setSearch(value);
        setPage(1);
    }

    function clearFilters() {
        setGenreId("");
        setPage(1);
    }

    return (
        <div className="min-h-screen bg-[#181818] text-white">

            <Navbar
                search={search}
                setSearch={handleSearchChange}
            />

            <main className="max-w-5xl mx-auto px-5 py-12">

                {/* Nagłówek */}

                <section className="bg-[#242426] rounded-2xl p-6 mb-6 border border-[#303034]">

                    <h1 className="text-2xl font-bold">
                        {search
                            ? `Wyniki dla frazy: ${search}`
                            : type === "movie"
                                ? "Popularne filmy"
                                : "Popularne seriale"}
                    </h1>

                    <p className="text-gray-400 text-sm mt-2">
                        Przeglądaj i odkrywaj nowe produkcje.
                    </p>

                </section>

                {/* Filtry */}

                <section className="bg-[#242426] rounded-2xl p-6 mb-10 border border-[#303034]">

                    <div className="flex justify-between items-center mb-6">

                        <div>
                            <h2 className="text-xl font-bold">
                                Filtry
                            </h2>

                            <p className="text-gray-400 text-sm mt-1">
                                Wybierz rodzaj produkcji i gatunek.
                            </p>
                        </div>

                        <button
                            onClick={clearFilters}
                            className="bg-[#303034] hover:bg-[#404045] px-4 py-2 rounded-lg text-sm"
                        >
                            Wyczyść filtry
                        </button>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Typ */}

                        <div>
                            <label className="text-gray-400 text-sm">
                                Typ produkcji
                            </label>

                            <select
                                value={type}
                                onChange={(e) => handleTypeChange(e.target.value)}
                                className="w-full mt-2 bg-[#303034] p-3 rounded-lg"
                            >
                                <option value="movie">Filmy</option>
                                <option value="tv">Seriale</option>
                            </select>
                        </div>

                        {/* Gatunek */}

                        <div>
                            <label className="text-gray-400 text-sm">
                                Gatunek
                            </label>

                            <select
                                value={genreId}
                                onChange={(e) => {
                                    setGenreId(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full mt-2 bg-[#303034] p-3 rounded-lg"
                            >
                                <option value="">
                                    Wszystkie gatunki
                                </option>

                                {genres.map((genre) => (
                                    <option
                                        key={genre.id}
                                        value={genre.id}
                                    >
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                </section>

                {/* Wyniki */}

                <div className="flex justify-between items-center mb-5">

                    <div>
                        <h2 className="text-2xl font-bold">
                            Wyniki
                        </h2>

                        <p className="text-gray-400 text-sm">
                            Znaleziono {search.trim()
                            ? filteredMovies.length
                            : totalResults} produkcji
                        </p>
                    </div>

                </div>

                {/* Ładowanie */}

                {loading && (
                    <p className="text-gray-400">
                        Ładowanie produkcji...
                    </p>
                )}

                {/* Błąd */}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400">
                        {error}
                    </div>
                )}

                {/* Lista */}

                {!loading && !error && (
                    <>
                        <div className="flex flex-col gap-5">

                            {filteredMovies.map((movie) => (
                                <MovieCard
                                    key={movie.id}
                                    movie={{
                                        ...movie,
                                        media_type: type
                                    }}
                                />
                            ))}

                            {filteredMovies.length === 0 && (
                                <p className="text-gray-400">
                                    Nie znaleziono produkcji.
                                </p>
                            )}

                        </div>

                        {/* Paginacja */}

                        {!search.trim() && totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 mt-10">

                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => p - 1)}
                                    className="bg-[#303034] hover:bg-[#404045] px-5 py-2 rounded-lg disabled:opacity-40"
                                >
                                    Poprzednia
                                </button>

                                <span className="text-gray-400">
                                    {page} / {totalPages}
                                </span>

                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                    className="bg-[#303034] hover:bg-[#404045] px-5 py-2 rounded-lg disabled:opacity-40"
                                >
                                    Następna
                                </button>

                            </div>
                        )}

                    </>
                )}

            </main>
        </div>
    );
}

export default Home;