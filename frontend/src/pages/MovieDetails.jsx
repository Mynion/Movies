import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";

import { getMovieDetails, IMAGE_URL } from "../services/tmdb";

function MovieDetails() {
    const { type, id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [storyRating, setStoryRating] = useState(5);
    const [actingRating, setActingRating] = useState(5);
    const [musicRating, setMusicRating] = useState(5);
    const [review, setReview] = useState("");

    useEffect(() => {
        let active = true;

        async function loadMovie() {
            setLoading(true);
            setError("");

            try {
                const data = await getMovieDetails(type, id);

                if (active) {
                    setMovie(data);
                }
            } catch (err) {
                if (active) {
                    setError(err.message);
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadMovie();

        return () => {
            active = false;
        };
    }, [type, id]);

    function handleSaveRating() {
        const rating = {
            movieId: Number(id),
            mediaType: type,
            storyRating: Number(storyRating),
            actingRating: Number(actingRating),
            musicRating: Number(musicRating),
            review,
        };

        console.log("Ocena użytkownika:", rating);

        alert("Ocena została przygotowana. Podłącz backend, aby ją zapisać.");
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#181818] text-white p-10">
                Ładowanie filmu...
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="min-h-screen bg-[#181818] text-red-400 p-10">
                {error || "Nie znaleziono filmu."}
            </div>
        );
    }

    const title = movie.title || movie.name;

    const year = (
        movie.release_date ||
        movie.first_air_date ||
        ""
    ).slice(0, 4);

    return (
        <div className="min-h-screen bg-[#181818] text-white">

            <main className="max-w-5xl mx-auto px-5 py-10">

                <Link
                    to="/"
                    className="text-gray-400 hover:text-white"
                >
                    ← Powrót do wyszukiwarki
                </Link>

                {/* INFORMACJE O FILMIE */}

                <div className="bg-[#242426] rounded-2xl p-6 mt-8 border border-[#303034]">

                    <div className="flex flex-col md:flex-row gap-8">

                        <img
                            src={
                                movie.poster_path
                                    ? `${IMAGE_URL}${movie.poster_path}`
                                    : "https://placehold.co/300x450?text=Brak+plakatu"
                            }
                            alt={title}
                            className="w-full md:w-64 rounded-xl object-cover"
                        />

                        <div className="flex-1">

                            <h1 className="text-4xl font-bold mb-3">
                                {title}
                            </h1>

                            <p className="text-gray-400 mb-4">
                                {year}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-5">

                                {movie.genres?.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="bg-[#303034] px-3 py-1 rounded-lg text-sm"
                                    >
                    {genre.name}
                  </span>
                                ))}

                            </div>

                            <div className="mb-6">

                <span className="bg-[#cf6054] px-4 py-2 rounded-lg font-bold">
                  ⭐ {movie.vote_average?.toFixed(1)}
                </span>

                            </div>

                            <h2 className="text-xl font-bold mb-3">
                                Opis
                            </h2>

                            <p className="text-gray-400 leading-relaxed">
                                {movie.overview || "Brak opisu."}
                            </p>

                            <div className="flex flex-wrap gap-3 mt-8">

                                <button
                                    className="bg-[#cf6054] hover:bg-[#b94d43] px-5 py-3 rounded-lg"
                                >
                                    Dodaj do listy
                                </button>

                                <button
                                    className="bg-[#303034] hover:bg-[#404044] px-5 py-3 rounded-lg"
                                >
                                    Oznacz jako obejrzany
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

                {/* OCENIANIE */}

                <div className="bg-[#242426] rounded-2xl p-6 mt-8 border border-[#303034]">

                    <h2 className="text-2xl font-bold mb-2">
                        Twoja ocena
                    </h2>

                    <p className="text-gray-400 mb-8">
                        Oceń poszczególne aspekty produkcji.
                    </p>

                    <div className="space-y-6">

                        <RatingSlider
                            label="Fabuła"
                            value={storyRating}
                            onChange={setStoryRating}
                        />

                        <RatingSlider
                            label="Aktorstwo"
                            value={actingRating}
                            onChange={setActingRating}
                        />

                        <RatingSlider
                            label="Muzyka"
                            value={musicRating}
                            onChange={setMusicRating}
                        />

                    </div>

                    <div className="mt-8">

                        <label className="block mb-3 font-semibold">
                            Twoja opinia
                        </label>

                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Co sądzisz o tej produkcji?"
                            rows="5"
                            className="w-full bg-[#303034] rounded-lg p-4 outline-none focus:ring-2 focus:ring-[#cf6054]"
                        />

                    </div>

                    <button
                        onClick={handleSaveRating}
                        className="mt-6 bg-[#cf6054] hover:bg-[#b94d43] px-6 py-3 rounded-lg font-semibold"
                    >
                        Zapisz ocenę
                    </button>

                </div>

            </main>
        </div>
    );
}

function RatingSlider({ label, value, onChange }) {
    return (
        <div>

            <div className="flex justify-between mb-3">

        <span className="font-semibold">
          {label}
        </span>

                <span className="text-[#cf6054] font-bold">
          {value}/10
        </span>

            </div>

            <input
                type="range"
                min="1"
                max="10"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full accent-[#cf6054]"
            />

        </div>
    );
}

export default MovieDetails;