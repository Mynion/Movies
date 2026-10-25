const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

export const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

export async function searchMovies(query) {
    const endpoint = query.trim()
        ? "/search/multi"
        : "/trending/all/week";

    const params = new URLSearchParams({
        api_key: API_KEY,
        language: "pl-PL",
    });

    if (query.trim()) {
        params.set("query", query);
    }

    const response = await fetch(
        `${BASE_URL}${endpoint}?${params}`
    );

    if (!response.ok) {
        throw new Error("Nie udało się pobrać filmów");
    }

    const data = await response.json();

    return data.results.filter(
        (item) =>
            item.media_type === "movie" ||
            item.media_type === "tv"
    );
}