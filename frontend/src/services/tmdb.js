const API_URL = "/api";

export const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

async function fetchApi(url, signal) {
    const response = await fetch(url, {
        signal,
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error(`Błąd HTTP: ${response.status}`);
    }

    return response.json();
}

// Normalizacja filmu
function normalizeMovie(movie) {
    return {
        ...movie,
        media_type: "movie",
        title: movie.title,
        poster_path: movie.posterPath ?? movie.poster_path,
        release_date: movie.releaseDate ?? movie.release_date,
        genre_ids: movie.genreIds ?? movie.genre_ids ?? []
    };
}

// Normalizacja serialu
function normalizeSeries(series) {
    return {
        ...series,
        media_type: "tv",
        title: series.name,
        poster_path: series.posterPath ?? series.poster_path,
        first_air_date: series.firstAirDate ?? series.first_air_date,
        genre_ids: series.genreIds ?? series.genre_ids ?? []
    };
}

// Normalizacja listy
function normalizeResponse(data, type) {
    return {
        ...data,
        results: (data.results ?? []).map(
            type === "tv" ? normalizeSeries : normalizeMovie
        )
    };
}

// Filmy
export async function getMovies(page = 1, genreId = null, signal) {
    const params = new URLSearchParams({ page: String(page) });

    if (genreId !== null) {
        params.append("genreId", String(genreId));
    }

    const data = await fetchApi(
        `${API_URL}/movies?${params}`,
        signal
    );

    return normalizeResponse(data, "movie");
}

// Seriale
export async function getSeries(page = 1, genreId = null, signal) {
    const params = new URLSearchParams({ page: String(page) });

    if (genreId !== null) {
        params.append("genreId", String(genreId));
    }

    const data = await fetchApi(
        `${API_URL}/series?${params}`,
        signal
    );

    return normalizeResponse(data, "tv");
}

// Wyszukiwanie filmów
export async function searchMovies(query, signal) {
    const params = new URLSearchParams({
        query: query.trim()
    });

    const data = await fetchApi(
        `${API_URL}/movies/search?${params}`,
        signal
    );

    return normalizeResponse(data, "movie");
}

// Wyszukiwanie seriali
export async function searchSeries(query, signal) {
    const params = new URLSearchParams({
        query: query.trim()
    });

    const data = await fetchApi(
        `${API_URL}/series/search?${params}`,
        signal
    );

    return normalizeResponse(data, "tv");
}

// Szczegóły filmu
export async function getMovieDetails(id) {
    return fetchApi(`${API_URL}/movies/${id}`);
}

// Szczegóły serialu
export async function getSeriesDetails(id) {
    return fetchApi(`${API_URL}/series/${id}`);
}

// Gatunki
export async function getGenres(type) {
    const params = new URLSearchParams({
        type: type.toUpperCase()
    });

    const data = await fetchApi(`${API_URL}/genres?${params}`);

    return data.genres ?? [];
}

// Własna baza
export async function getMediaItems() {
    return fetchApi("/mediaitems");
}

export async function addMediaItem(mediaItem) {
    const response = await fetch("/mediaitem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mediaItem)
    });

    if (!response.ok) {
        throw new Error(`Błąd backendu: ${response.status}`);
    }
}