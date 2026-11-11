import { Link } from "react-router";
import { IMAGE_URL } from "../services/tmdb";

function MovieCard({ movie }) {
    const isSeries = movie.media_type === "tv";

    const title = isSeries
        ? movie.name
        : movie.title;

    const date = isSeries
        ? movie.first_air_date
        : movie.release_date;

    const year = date
        ? date.slice(0, 4)
        : "Brak daty";

    const poster = movie.poster_path || movie.posterPath
        ? `${IMAGE_URL}${movie.poster_path || movie.posterPath}`
        : "https://placehold.co/200x300?text=Brak+plakatu";

    return (
        <div className="flex gap-5 rounded-xl bg-[#242426] p-4 border border-[#303034]">

            <img
                src={poster}
                alt={title}
                className="w-32 h-48 object-cover rounded-lg"
            />

            <div className="flex-1">

                <div className="flex justify-between items-start">

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {title || "Brak tytułu"}
                        </h2>

                        <div className="flex gap-2 mt-2 text-xs text-gray-400">

                            <span className="bg-[#303034] px-2 py-1 rounded">
                                {isSeries ? "Serial" : "Film"}
                            </span>

                            <span className="bg-[#303034] px-2 py-1 rounded">
                                {year}
                            </span>

                        </div>
                    </div>

                </div>

                <p className="text-gray-400 text-sm mt-4 line-clamp-3">
                    {movie.overview || "Brak opisu."}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">

                    <Link
                        to={`/movie/${isSeries ? "tv" : "movie"}/${movie.id}`}
                        className="bg-[#cf6054] hover:bg-[#b94d43] px-4 py-2 rounded-lg text-sm text-white"
                    >
                        Otwórz
                    </Link>

                </div>

            </div>
        </div>
    );
}

export default MovieCard;