
function UserRatingStats({ ratingStats, userRating }) {
    return (
        <>
            {/* Oceny użytkowników */}
            <section className="max-w-7xl mx-auto px-6 pt-4">
                <div className="bg-[#242426] border border-[#303034] rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-3">
                        Oceny użytkowników
                    </h2>
                    <div className="flex flex-wrap gap-8 text-gray-300">
                        <p>
                            Średnia:{" "}
                            <span className="text-white font-semibold">
                                {ratingStats?.averageRating != null
                                    ? Number(ratingStats.averageRating).toFixed(2)
                                    : "—"}
                                /10
                            </span>
                        </p>
                        <p>
                            Liczba ocen:{" "}
                            <span className="text-white font-semibold">
                                {ratingStats?.ratingsCount ?? 0}
                            </span>
                        </p>
                        {userRating && (
                            <p>
                                Twoja ocena:{" "}
                                <span className="text-white font-semibold">
                                    {Number(userRating.value).toFixed(1)}/10
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default UserRatingStats;
