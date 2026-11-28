
import { Link } from "react-router";

function MovieHeader({
                         backdrop,
                         isEpisode,
                         id,
                         poster,
                         title,
                         productionType,
                         year,
                         seasonNumber,
                         episodeNumber,
                         details,
                         isSeries,
                         runtime,
                         voteAverage,
                         userRating,
                         requireLogin,
                         openReviewModal,
                         user,
                         userReview,
                         openAddToListModal,
                         openWatchModal
                     }) {
    return (
        <>
            {/* Tło produkcji */}
            <div className="relative">
                {backdrop && (
                    <div
                        className="absolute inset-0 h-[480px] bg-cover bg-center opacity-25"
                        style={{ backgroundImage: `url(${backdrop})` }}
                    />
                )}

                <div className="absolute inset-0 h-[480px] bg-gradient-to-b from-transparent to-[#181818]" />

                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    {isEpisode && (
                        <Link
                            to={`/movie/tv/${id}`}
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
                        >
                            ← Wróć do serialu
                        </Link>
                    )}

                    <div className="flex flex-col md:flex-row gap-10">
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

                            <div className="flex flex-wrap gap-6 mb-7 text-gray-300">
                                {isEpisode && (
                                    <>
                                        <span>Sezon: {seasonNumber}</span>
                                        <span>Odcinek: {episodeNumber}</span>
                                    </>
                                )}

                                {isSeries && (
                                    <>
                                        <span>
                                            Sezony:{" "}
                                            {details.numberOfSeasons ??
                                                details.number_of_seasons ?? "—"}
                                        </span>
                                        <span>
                                            Odcinki:{" "}
                                            {details.numberOfEpisodes ??
                                                details.number_of_episodes ?? "—"}
                                        </span>
                                    </>
                                )}

                                {!isSeries && runtime && (
                                    <span>Czas trwania: {runtime} min</span>
                                )}

                                <span>
                                    Ocena TMDB:{" "}
                                    {voteAverage != null
                                        ? Number(voteAverage).toFixed(1)
                                        : "—"}
                                    /10
                                </span>
                            </div>

                            <h2 className="text-xl font-semibold mb-3">Opis</h2>
                            <p className="text-gray-300 leading-relaxed max-w-3xl">
                                {details.overview || "Brak opisu tej produkcji."}
                            </p>

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

                            <div className="flex flex-wrap gap-4 mt-8">
                                <button
                                    onClick={() => requireLogin("rating")}
                                    className="bg-[#cf6054] hover:bg-[#b94d43] px-5 py-3 rounded-lg font-medium transition"
                                >
                                    {userRating ? "Edytuj ocenę" : "Oceń"}{" "}
                                    {isEpisode ? "odcinek" : "produkcję"}
                                </button>

                                <button
                                    onClick={() => {
                                        if (!user) {
                                            requireLogin("review");
                                        } else {
                                            openReviewModal();
                                        }
                                    }}
                                    className="bg-[#303034] hover:bg-[#414146] px-5 py-3 rounded-lg font-medium transition"
                                >
                                    {userReview ? "Edytuj recenzję" : "Napisz recenzję"}
                                </button>

                                {user && (
                                    <button
                                        onClick={openWatchModal}
                                        className="bg-[#303034] hover:bg-[#414146] border border-[#414146] px-5 py-3 rounded-lg font-medium transition"
                                    >
                                        Oznacz jako obejrzane
                                    </button>
                                )}

                                <button
                                    onClick={openAddToListModal}
                                    className="bg-[#303034] hover:bg-[#414146] px-5 py-3 rounded-lg font-medium transition"
                                >
                                    + Dodaj do listy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MovieHeader;
