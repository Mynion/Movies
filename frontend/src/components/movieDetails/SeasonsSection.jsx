import { Link } from "react-router";

function SeasonsSection({ isSeries, seasons, expandedSeason, setExpandedSeason, id, IMAGE_URL }) {
    return (
        <>
            {/* Sezony i odcinki serialu */}
            {isSeries && (
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-6">
                        Sezony i odcinki
                    </h2>

                    {seasons.length > 0 ? (
                        <div className="space-y-4">
                            {seasons.map((season) => {
                                const currentSeasonNumber =
                                    season.seasonNumber ?? season.season_number;
                                const episodes = season.episodes || [];
                                const seasonName =
                                    season.name || `Sezon ${currentSeasonNumber}`;
                                const seasonAirDate =
                                    season.airDate || season.air_date;
                                const isExpanded =
                                    expandedSeason === currentSeasonNumber;

                                return (
                                    <div
                                        key={season.id}
                                        className="bg-[#242426] border border-[#303034] rounded-xl overflow-hidden"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setExpandedSeason(
                                                    isExpanded ? null : currentSeasonNumber
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
                                                    {seasonAirDate ? ` • ${seasonAirDate}` : ""}
                                                </p>
                                            </div>
                                            <span className="text-2xl text-gray-400">
                                                {isExpanded ? "−" : "+"}
                                            </span>
                                        </button>

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
                                                                        {airDate || "Brak daty emisji"}
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
        </>
    );
}

export default SeasonsSection;
