
function CastSection({ isEpisode, cast, IMAGE_URL }) {
    return (
        <>
            {/* Obsada */}
            {!isEpisode && cast?.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 py-12">
                    <h2 className="text-2xl font-bold mb-6">Obsada</h2>

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
        </>
    );
}

export default CastSection;
