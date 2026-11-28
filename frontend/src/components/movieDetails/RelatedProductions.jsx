import { Link } from "react-router";

function RelatedProductions({ isEpisode, recommendations, similarProductions, isSeries, IMAGE_URL }) {
    return (
            {/* Rekomendacje i podobne produkcje */}
            {!isEpisode && (
                <section className="max-w-7xl mx-auto px-6 pb-16 space-y-12">
                    {recommendations.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                Może Ci się spodobać
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                {recommendations.slice(0, 12).map((item) => {
                                    const itemTitle = isSeries
                                        ? item.name || item.title
                                        : item.title || item.name;
                                    const itemPoster = item.poster_path
                                        ? `${IMAGE_URL}w342${item.poster_path}`
                                        : "https://placehold.co/200x300?text=Brak+plakatu";

                                    return (
                                        <Link
                                            key={item.id}
                                            to={`/movie/${isSeries ? "tv" : "movie"}/${item.id}`}
                                            className="group bg-[#242426] border border-[#303034] rounded-xl overflow-hidden hover:border-[#cf6054] transition"
                                        >
                                            <img
                                                src={itemPoster}
                                                alt={itemTitle || "Plakat produkcji"}
                                                className="w-full aspect-[2/3] object-cover"
                                                loading="lazy"
                                            />
                                            <div className="p-3">
                                                <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#e8796e] transition">
                                                    {itemTitle || "Brak tytułu"}
                                                </h3>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {similarProductions.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">
                                Podobne produkcje
                            </h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                {similarProductions.slice(0, 12).map((item) => {
                                    const itemTitle = isSeries
                                        ? item.name || item.title
                                        : item.title || item.name;
                                    const itemPoster = item.poster_path
                                        ? `${IMAGE_URL}w342${item.poster_path}`
                                        : "https://placehold.co/200x300?text=Brak+plakatu";

                                    return (
                                        <Link
                                            key={item.id}
                                            to={`/movie/${isSeries ? "tv" : "movie"}/${item.id}`}
                                            className="group bg-[#242426] border border-[#303034] rounded-xl overflow-hidden hover:border-[#cf6054] transition"
                                        >
                                            <img
                                                src={itemPoster}
                                                alt={itemTitle || "Plakat produkcji"}
                                                className="w-full aspect-[2/3] object-cover"
                                                loading="lazy"
                                            />
                                            <div className="p-3">
                                                <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-[#e8796e] transition">
                                                    {itemTitle || "Brak tytułu"}
                                                </h3>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>
            )}

    );
}

export default RelatedProductions;
