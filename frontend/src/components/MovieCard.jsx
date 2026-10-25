import { Link } from "react-router";
import { IMAGE_URL } from "../services/tmdb";

function MovieCard({ movie }) {
    const title = movie.title || movie.name;

    const year = (
        movie.release_date ||
        movie.first_air_date ||
        ""
    ).slice(0, 4);

    const rating = movie.vote_average?.toFixed(1) || "N/A";

    return (
        <div className="flex gap-5 rounded-xl bg-[#242426] p-4 border border-[#303034]">

            <img
                src={
                    movie.poster_path
                        ? `${IMAGE_URL}${movie.poster_path}`
                        : "https://placehold.co/200x300?text=Brak+plakatu"
                }
                alt={title}
                className="w-32 h-48 object-cover rounded-lg"
            />

            <div className="flex-1">

                <div className="flex justify-between items-start">

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {title}
                        </h2>

                        <div className="flex gap-2 mt-2 text-xs text-gray-400">
              <span className="bg-[#303034] px-2 py-1 rounded">
                {movie.media_type === "movie" ? "Film" : "Serial"}
              </span>

                            <span className="bg-[#303034] px-2 py-1 rounded">
                {year}
              </span>
                        </div>
                    </div>

                    <span className="bg-[#cf6054] px-3 py-2 rounded-lg font-bold text-white">
            {rating}
          </span>

                </div>

                <p className="text-gray-400 text-sm mt-4 line-clamp-3">
                    {movie.overview || "Brak opisu."}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">

                    <Link
                        to={`/movie/${movie.media_type}/${movie.id}`}
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