
import { useEffect, useState } from "react";
import {
    Link,
    useParams,
    useNavigate,
    useLocation
} from "react-router";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:8080/api";
const IMAGE_URL = "https://image.tmdb.org/t/p/";

function MovieDetails() {
    const {
        type,
        id,
        seasonNumber,
        episodeNumber
    } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const isEpisode = seasonNumber !== undefined && episodeNumber !== undefined;
    const isSeries = type === "tv" && !isEpisode;

    const [details, setDetails] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeModal, setActiveModal] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");

    const [expandedSeason, setExpandedSeason] = useState(null);

    // Pobieranie szczegółów filmu, serialu lub odcinka
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                let endpoint;

                if (isEpisode) {
                    endpoint = `${API_URL}/series/${id}/seasons/${seasonNumber}/episodes/${episodeNumber}`;
                } else if (isSeries) {
                    endpoint = `${API_URL}/series/${id}`;
                } else {
                    endpoint = `${API_URL}/movies/${id}`;
                }

                const [detailsResponse, userResponse] = await Promise.all([
                    fetch(endpoint, {
                        credentials: "include",
                    }),
                    fetch(`${API_URL}/auth/me`, {
                        credentials: "include",
                    }),
                ]);

                if (!detailsResponse.ok) {
                    throw new Error(
                        "Nie udało się pobrać szczegółów produkcji."
                    );
                }

                const detailsData = await detailsResponse.json();

                console.log("Szczegóły produkcji:", detailsData);

                setDetails(detailsData);

                if (userResponse.ok) {
                    setUser(await userResponse.json());
                } else {
                    setUser(null);
                }
            } catch (err) {
                setError(err.message || "Wystąpił błąd.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, isSeries, isEpisode, seasonNumber, episodeNumber]);

    // Sprawdzanie logowania
    function requireLogin(modalType) {
        if (!user) {
            navigate("/login", {
                state: {
                    from: location.pathname,
                },
            });
            return;
        }

        setActiveModal(modalType);
    }

    // Wysyłanie oceny
    function handleRatingSubmit(event) {
        event.preventDefault();

        alert("Backend ocen użytkowników nie jest jeszcze podłączony.");

        setActiveModal(null);
    }

    // Wysyłanie recenzji
    function handleReviewSubmit(event) {
        event.preventDefault();

        alert("Backend recenzji nie jest jeszcze podłączony.");

        setActiveModal(null);
    }

    // Ekran ładowania
    if (loading) {
        return (
            <div className="min-h-screen bg-[#181818] text-white">
                <Navbar />

                <div className="text-center py-32 text-gray-400">
                    Ładowanie szczegółów...
                </div>
            </div>
        );
    }

    // Ekran błędu
    if (error || !details) {
        return (
            <div className="min-h-screen bg-[#181818] text-white">
                <Navbar />

                <div className="text-center py-32 text-red-400">
                    {error || "Nie znaleziono produkcji."}
                </div>
            </div>
        );
    }

    // Dane produkcji
    const title = isSeries || isEpisode
        ? details.name
        : details.title;

    const date = isEpisode
        ? details.airDate || details.air_date
        : isSeries
            ? details.firstAirDate || details.first_air_date
            : details.releaseDate || details.release_date;

    const year = date ? date.slice(0, 4) : "Brak daty";

    // Zdjęcie: plakat filmu/serialu albo kadr odcinka
    const posterPath = isEpisode
        ? details.stillPath || details.still_path
        : details.posterPath || details.poster_path;

    const backdropPath = details.backdropPath || details.backdrop_path;

    const poster = posterPath
        ? `${IMAGE_URL}w500${posterPath}`
        : "https://placehold.co/500x750?text=Brak+zdjecia";

    const backdrop = backdropPath
        ? `${IMAGE_URL}original${backdropPath}`
        : null;

    // Obsada: nie wyświetlamy aktorów na stronie odcinka
    const cast = isEpisode
        ? []
        : details.credits?.cast || [];

    const voteAverage =
        details.voteAverage ?? details.vote_average;

    const runtime = details.runtime;

    // Sezony serialu
    const seasons = isSeries
        ? details.seasons || details.Seasons || []
        : [];

    const productionType = isEpisode
        ? "Odcinek serialu"
        : isSeries
            ? "Serial"
            : "Film";

    return (
        <div className="min-h-screen bg-[#181818] text-white">
            <Navbar />

            {/* Tło produkcji */}
            <div className="relative">
                {backdrop && (
                    <div
                        className="absolute inset-0 h-[480px] bg-cover bg-center opacity-25"
                        style={{
                            backgroundImage: `url(${backdrop})`,
                        }}
                    />
                )}

                <div className="absolute inset-0 h-[480px] bg-gradient-to-b from-transparent to-[#181818]" />

                <div className="relative max-w-7xl mx-auto px-6 py-12">

                    {/* Link do całego serialu na stronie odcinka */}
                    {isEpisode && (
                        <Link
                            to={`/movie/tv/${id}`}
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
                        >
                            ← Wróć do serialu
                        </Link>
                    )}

                    <div className="flex flex-col md:flex-row gap-10">

                        {/* Plakat lub zdjęcie odcinka */}
                        <div className="shrink-0">
                            <img
                                src={poster}
                                alt={title}
                                className={`rounded-xl shadow-2xl ${
                                    isEpisode
                                        ? "w-full md:w-[420px] aspect-video object-cover"
                                        : "w-64"
                                }`}
                            />
                        </div>

                        {/* Informacje o produkcji */}
                        <div className="flex-1 pt-2">

                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="bg-[#cf6054] px-3 py-1 rounded-full text-sm">
                                    {productionType}
                                </span>

                                <span className="bg-[#303034] px-3 py-1 rounded-full text-sm">
                                    {year}
                                </span>

                                {isEpisode && (
                                    <>
                                        <span className="bg-[#303034] px-3 py-1 rounded-full text-sm">
                                            Sezon {seasonNumber}
                                        </span>

                                        <span className="bg-[#303034] px-3 py-1 rounded-full text-sm">
                                            Odcinek {episodeNumber}
                                        </span>
                                    </>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-5">
                                {title}
                            </h1>

                            {/* Gatunki */}
                            {details.genres?.length > 0 && (
                                <div className="flex flex-wrap gap-3 mb-6">
                                    {details.genres.map((genre) => (
                                        <span
                                            key={genre.id}
                                            className="bg-[#303034] px-3 py-1 rounded-lg text-sm text-gray-300"
                                        >
                                            {genre.name}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Podstawowe informacje */}
                            <div className="flex flex-wrap gap-6 mb-7 text-gray-300">

                                {isEpisode && (
                                    <>
                                        <span>
                                            Sezon: {seasonNumber}
                                        </span>

                                        <span>
                                            Odcinek: {episodeNumber}
                                        </span>
                                    </>
                                )}

                                {isSeries && (
                                    <>
                                        <span>
                                            Sezony:{" "}
                                            {details.numberOfSeasons ??
                                                details.number_of_seasons ??
                                                "—"}
                                        </span>

                                        <span>
                                            Odcinki:{" "}
                                            {details.numberOfEpisodes ??
                                                details.number_of_episodes ??
                                                "—"}
                                        </span>
                                    </>
                                )}

                                {!isSeries && runtime && (
                                    <span>
                                        Czas trwania: {runtime} min
                                    </span>
                                )}

                                <span>
                                    Ocena TMDB:{" "}
                                    {voteAverage != null
                                        ? Number(voteAverage).toFixed(1)
                                        : "—"}
                                    /10
                                </span>
                            </div>

                            {/* Opis */}
                            <h2 className="text-xl font-semibold mb-3">
                                Opis
                            </h2>

                            <p className="text-gray-300 leading-relaxed max-w-3xl">
                                {details.overview ||
                                    "Brak opisu tej produkcji."}
                            </p>

                            {/* Link do serialu */}
                            {isEpisode && (
                                <div className="mt-6">
                                    <Link
                                        to={`/movie/tv/${id}`}
                                        className="text-[#cf6054] hover:text-[#e8796e] transition font-medium"
                                    >
                                        Zobacz cały serial →
                                    </Link>
                                </div>
                            )}

                            {/* Przyciski oceniania i recenzji */}
                            <div className="flex flex-wrap gap-4 mt-8">
                                <button
                                    onClick={() => requireLogin("rating")}
                                    className="bg-[#cf6054] hover:bg-[#b94d43] px-5 py-3 rounded-lg font-medium transition"
                                >
                                    Oceń {isEpisode ? "odcinek" : "produkcję"}
                                </button>

                                <button
                                    onClick={() => requireLogin("review")}
                                    className="bg-[#303034] hover:bg-[#414146] px-5 py-3 rounded-lg font-medium transition"
                                >
                                    Napisz recenzję
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sezony i odcinki serialu */}
            {isSeries && (
                <section className="max-w-7xl mx-auto px-6 pb-12">
                    <h2 className="text-2xl font-bold mb-6">
                        Sezony i odcinki
                    </h2>

                    {seasons.length > 0 ? (
                        <div className="space-y-4">
                            {seasons.map((season) => {
                                const currentSeasonNumber =
                                    season.seasonNumber ??
                                    season.season_number;

                                const episodes = season.episodes || [];

                                const seasonName =
                                    season.name ||
                                    `Sezon ${currentSeasonNumber}`;

                                const seasonAirDate =
                                    season.airDate ||
                                    season.air_date;

                                const isExpanded =
                                    expandedSeason === currentSeasonNumber;

                                return (
                                    <div
                                        key={season.id}
                                        className="bg-[#242426] border border-[#303034] rounded-xl overflow-hidden"
                                    >
                                        {/* Nagłówek sezonu */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedSeason(
                                                    isExpanded
                                                        ? null
                                                        : currentSeasonNumber
                                                )
                                            }
                                            className="w-full flex items-center justify-between p-5 text-left hover:bg-[#303034] transition"
                                        >
                                            <div>
                                                <h3 className="text-lg font-semibold">
                                                    {seasonName}
                                                </h3>

                                                <p className="text-sm text-gray-400 mt-1">
                                                    {episodes.length} odcinków
                                                    {seasonAirDate
                                                        ? ` • ${seasonAirDate}`
                                                        : ""}
                                                </p>
                                            </div>

                                            <span className="text-2xl text-gray-400">
                                                {isExpanded ? "−" : "+"}
                                            </span>
                                        </button>

                                        {/* Lista odcinków */}
                                        {isExpanded && (
                                            <div className="border-t border-[#303034] p-5 space-y-5">
                                                {episodes.length > 0 ? (
                                                    episodes.map((episode) => {
                                                        const currentEpisodeNumber =
                                                            episode.episodeNumber ??
                                                            episode.episode_number;

                                                        const stillPath =
                                                            episode.stillPath ??
                                                            episode.still_path;

                                                        const airDate =
                                                            episode.airDate ??
                                                            episode.air_date;

                                                        const episodeRating =
                                                            episode.voteAverage ??
                                                            episode.vote_average;

                                                        return (
                                                            <Link
                                                                key={episode.id}
                                                                to={`/movie/tv/${id}/season/${currentSeasonNumber}/episode/${currentEpisodeNumber}`}
                                                                className="flex flex-col sm:flex-row gap-4 border-b border-[#303034] pb-5 last:border-0 last:pb-0 rounded-lg p-3 -mx-3 hover:bg-[#303034]/60 transition group"
                                                            >
                                                                <img
                                                                    src={
                                                                        stillPath
                                                                            ? `${IMAGE_URL}w300${stillPath}`
                                                                            : "https://placehold.co/300x170?text=Brak+zdjecia"
                                                                    }
                                                                    alt={episode.name}
                                                                    className="w-full sm:w-56 aspect-video object-cover rounded-lg"
                                                                />

                                                                <div className="flex-1">
                                                                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                                                                        <h4 className="font-semibold text-lg group-hover:text-[#cf6054] transition">
                                                                            {currentEpisodeNumber}.{" "}
                                                                            {episode.name}
                                                                        </h4>

                                                                        <span className="text-sm text-gray-400">
                                                                            {episodeRating != null
                                                                                ? `${Number(episodeRating).toFixed(1)}/10`
                                                                                : "Brak oceny"}
                                                                        </span>
                                                                    </div>

                                                                    <p className="text-sm text-gray-400 mb-2">
                                                                        {airDate ||
                                                                            "Brak daty emisji"}

                                                                        {episode.runtime
                                                                            ? ` • ${episode.runtime} min`
                                                                            : ""}
                                                                    </p>

                                                                    <p className="text-gray-300 text-sm leading-relaxed">
                                                                        {episode.overview ||
                                                                            "Brak opisu odcinka."}
                                                                    </p>

                                                                    <p className="text-[#cf6054] text-sm mt-3 font-medium">
                                                                        Zobacz szczegóły odcinka →
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-gray-400">
                                                        Brak informacji o odcinkach tego sezonu.
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-400">
                            Brak informacji o sezonach.
                        </p>
                    )}
                </section>
            )}

            {/* Obsada */}
            {!isEpisode && cast.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-6">
                        Obsada
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-5">
                        {cast.slice(0, 12).map((person) => {
                            const profilePath =
                                person.profilePath || person.profile_path;

                            return (
                                <div
                                    key={person.id}
                                    className="bg-[#242426] rounded-xl overflow-hidden border border-[#303034]"
                                >
                                    <img
                                        src={
                                            profilePath
                                                ? `${IMAGE_URL}w300${profilePath}`
                                                : "https://placehold.co/300x450?text=Brak+zdjecia"
                                        }
                                        alt={person.name}
                                        className="w-full aspect-[2/3] object-cover"
                                    />

                                    <div className="p-3">
                                        <p className="font-semibold text-sm">
                                            {person.name}
                                        </p>

                                        <p className="text-gray-400 text-xs mt-1">
                                            {person.character || " "}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Sekcja recenzji */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <h2 className="text-2xl font-bold mb-4">
                    Oceny i recenzje użytkowników
                </h2>

                <div className="bg-[#242426] border border-[#303034] rounded-xl p-6">
                    <p className="text-gray-400">
                        Tutaj pojawią się oceny i recenzje dodane przez użytkowników.
                    </p>

                    <p className="text-gray-500 text-sm mt-2">
                        Funkcjonalność zostanie podłączona po przygotowaniu backendu.
                    </p>
                </div>
            </section>

            {/* Modal oceny */}
            {activeModal === "rating" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="bg-[#242426] border border-[#303034] rounded-xl p-7 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-5">
                            Oceń: {title}
                        </h2>

                        <form onSubmit={handleRatingSubmit}>
                            <label className="block text-gray-300 mb-3">
                                Twoja ocena (1–10)
                            </label>

                            <select
                                value={rating}
                                onChange={(event) =>
                                    setRating(Number(event.target.value))
                                }
                                className="w-full bg-[#181818] border border-[#414146] rounded-lg p-3 text-white mb-6"
                            >
                                {Array.from(
                                    { length: 10 },
                                    (_, index) => index + 1
                                ).map((value) => (
                                    <option key={value} value={value}>
                                        {value}/10
                                    </option>
                                ))}
                            </select>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#cf6054] hover:bg-[#b94d43] rounded-lg py-3"
                                >
                                    Zapisz ocenę
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveModal(null)}
                                    className="flex-1 bg-[#303034] hover:bg-[#414146] rounded-lg py-3"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal recenzji */}
            {activeModal === "review" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="bg-[#242426] border border-[#303034] rounded-xl p-7 w-full max-w-lg">
                        <h2 className="text-2xl font-bold mb-5">
                            Recenzja: {title}
                        </h2>

                        <form onSubmit={handleReviewSubmit}>
                            <label className="block text-gray-300 mb-3">
                                Treść recenzji
                            </label>

                            <textarea
                                value={review}
                                onChange={(event) =>
                                    setReview(event.target.value)
                                }
                                required
                                minLength={10}
                                rows={6}
                                placeholder="Co sądzisz o tej produkcji?"
                                className="w-full bg-[#181818] border border-[#414146] rounded-lg p-3 text-white resize-none mb-6"
                            />

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    disabled={review.trim().length < 10}
                                    className="flex-1 bg-[#cf6054] hover:bg-[#b94d43] disabled:opacity-50 rounded-lg py-3"
                                >
                                    Opublikuj recenzję
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveModal(null)}
                                    className="flex-1 bg-[#303034] hover:bg-[#414146] rounded-lg py-3"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;
