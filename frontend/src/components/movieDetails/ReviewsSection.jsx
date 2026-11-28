
function ReviewsSection({ reviews, userReview, openReviewModal }) {
    return (
        <>
            {/* Sekcja recenzji */}
            <section className="max-w-7xl mx-auto px-6 pb-16">
                <h2 className="text-2xl font-bold mb-4">
                    Recenzje użytkowników
                </h2>

                <div className="space-y-4">
                    {[
                        ...reviews.filter((item) => item.id !== userReview?.id),
                        ...(userReview ? [userReview] : [])
                    ]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((item) => {
                            const isOwnReview = userReview?.id === item.id;

                            return (
                                <article
                                    key={item.id}
                                    className="bg-[#242426] border border-[#303034] rounded-xl p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {item.username || "Użytkownik"}
                                                {item.createdAt
                                                    ? ` • ${new Date(item.createdAt).toLocaleDateString("pl-PL")}`
                                                    : ""}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs px-3 py-1 rounded-full ${
                                                item.visibility === "PRIVATE"
                                                    ? "bg-[#414146] text-gray-300"
                                                    : "bg-[#303034] text-gray-300"
                                            }`}>
                                                {item.visibility === "PRIVATE" ? "Prywatna" : "Publiczna"}
                                            </span>
                                            {isOwnReview && (
                                                <button
                                                    type="button"
                                                    onClick={openReviewModal}
                                                    className="text-[#cf6054] hover:text-[#e8796e] text-sm transition"
                                                >
                                                    Edytuj
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {item.content}
                                    </p>
                                </article>
                            );
                        })}

                    {reviews.length === 0 && !userReview && (
                        <div className="bg-[#242426] border border-[#303034] rounded-xl p-6">
                            <p className="text-gray-400">
                                Nie dodano jeszcze recenzji tej produkcji.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}

export default ReviewsSection;
