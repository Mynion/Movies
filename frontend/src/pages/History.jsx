
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:8080/api";
const IMAGE_URL = "https://image.tmdb.org/t/p/w200";

function getLocalDate(value) {
    const date = new Date(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(value) {
    return new Date(value).toLocaleDateString("pl-PL");
}

function getDetailsEndpoint(item) {
    if (item.mediaType === "MOVIE") {
        return `${API_URL}/movies/${item.tmdbId}`;
    }

    if (item.mediaType === "TV_SERIES" || item.mediaType === "SEASON") {
        return `${API_URL}/series/${item.tmdbId}`;
    }

    if (item.mediaType === "EPISODE") {
        return `${API_URL}/series/${item.tmdbId}/seasons/${item.seasonNumber}/episodes/${item.episodeNumber}`;
    }

    return null;
}

function getMediaLabel(item, details) {
    if (item.mediaType === "EPISODE") {
        return `${details?.name || details?.title || "Odcinek"} — sezon ${item.seasonNumber}, odcinek ${item.episodeNumber}`;
    }

    if (item.mediaType === "SEASON") {
        return `${details?.name || details?.title || "Serial"} — sezon ${item.seasonNumber}`;
    }

    return details?.title || details?.name || "Nieznana produkcja";
}

function History() {
    const navigate = useNavigate();
    const location = useLocation();

    const [entries, setEntries] = useState([]);
    const [sortOrder, setSortOrder] = useState("newest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editDate, setEditDate] = useState("");
    const [saving, setSaving] = useState(false);

    async function loadHistory() {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API_URL}/watch-history/me`, {
                credentials: "include",
            });

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname },
                });
                return;
            }

            if (!response.ok) {
                throw new Error("Nie udało się pobrać historii.");
            }

            const data = await response.json();

            const enrichedEntries = await Promise.all(
                data.map(async (entry) => {
                    const enrichedItems = await Promise.all(
                        (entry.mediaItems || []).map(async (item) => {
                            const endpoint = getDetailsEndpoint(item);

                            if (!endpoint) {
                                return { ...item, details: null };
                            }

                            try {
                                const detailsResponse = await fetch(endpoint);

                                if (!detailsResponse.ok) {
                                    return { ...item, details: null };
                                }

                                const details = await detailsResponse.json();

                                return { ...item, details };
                            } catch {
                                return { ...item, details: null };
                            }
                        })
                    );

                    return {
                        ...entry,
                        mediaItems: enrichedItems,
                    };
                })
            );

            setEntries(enrichedEntries);
        } catch (err) {
            setError(err.message || "Wystąpił błąd.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadHistory();
    }, []);

    async function handleDelete(entryId) {
        if (!window.confirm("Czy na pewno chcesz usunąć ten wpis z historii?")) {
            return;
        }

        try {
            const response = await fetch(
                `${API_URL}/watch-history/${entryId}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname },
                });
                return;
            }

            if (!response.ok && response.status !== 204) {
                throw new Error("Nie udało się usunąć wpisu.");
            }

            setEntries((current) =>
                current.filter((entry) => entry.id !== entryId)
            );
        } catch (err) {
            setError(err.message);
        }
    }

    function startEditing(entry) {
        setEditingId(entry.id);
        setEditDate(getLocalDate(entry.watchedAt));
        setError("");
    }

    async function handleEdit(event, entry) {
        event.preventDefault();

        if (!editDate) {
            setError("Wybierz datę obejrzenia.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const watchedAt = new Date(
                `${editDate}T12:00:00`
            ).toISOString();

            const body = {
                watchedAt,
                progress: entry.progress,
                mediaItems: entry.mediaItems.map((item) => ({
                    tmdbId: item.tmdbId,
                    mediaType: item.mediaType,
                    ...(item.seasonNumber != null && {
                        seasonNumber: item.seasonNumber,
                    }),
                    ...(item.episodeNumber != null && {
                        episodeNumber: item.episodeNumber,
                    }),
                })),
            };

            const response = await fetch(
                `${API_URL}/watch-history/${entry.id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body),
                }
            );

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname },
                });
                return;
            }

            if (!response.ok) {
                throw new Error("Nie udało się edytować wpisu.");
            }

            const updatedEntry = await response.json();

            setEntries((current) =>
                current.map((item) =>
                    item.id === entry.id
                        ? {
                            ...updatedEntry,
                            mediaItems: entry.mediaItems,
                        }
                        : item
                )
            );

            setEditingId(null);
        } catch (err) {
            setError(err.message || "Wystąpił błąd.");
        } finally {
            setSaving(false);
        }
    }

    const sortedEntries = [...entries].sort((a, b) => {
        const difference =
            new Date(a.watchedAt) - new Date(b.watchedAt);

        return sortOrder === "newest" ? -difference : difference;
    });

    return (
        <div className="min-h-screen bg-[#181818] text-white">
            <Navbar search="" setSearch={() => {}} />

            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Historia oglądania
                        </h1>
                        <p className="text-gray-400 mt-2">
                            Wszystkie obejrzane przez Ciebie produkcje.
                        </p>
                    </div>

                    <select
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        className="bg-[#242426] border border-[#414146] rounded-lg px-4 py-3 text-white"
                    >
                        <option value="newest">Od najnowszych</option>
                        <option value="oldest">Od najstarszych</option>
                    </select>
                </div>

                {error && (
                    <p className="text-red-400 mb-5">{error}</p>
                )}

                {loading ? (
                    <p className="text-center text-gray-400 py-16">
                        Ładowanie historii...
                    </p>
                ) : sortedEntries.length === 0 ? (
                    <p className="text-center text-gray-400 py-16">
                        Twoja historia oglądania jest jeszcze pusta.
                    </p>
                ) : (
                    <div className="space-y-5">
                        {sortedEntries.map((entry) => (
                            <section
                                key={entry.id}
                                className="bg-[#242426] border border-[#303034] rounded-xl p-5"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                                    <div>
                                        <p className="text-gray-400 text-sm">
                                            Data obejrzenia
                                        </p>
                                        <p className="font-semibold text-lg">
                                            {formatDate(entry.watchedAt)}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startEditing(entry)}
                                            className="bg-[#303034] hover:bg-[#414146] px-4 py-2 rounded-lg text-sm transition"
                                        >
                                            Edytuj datę
                                        </button>

                                        <button
                                            onClick={() => handleDelete(entry.id)}
                                            className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-lg text-sm transition"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </div>

                                {editingId === entry.id && (
                                    <form
                                        onSubmit={(event) =>
                                            handleEdit(event, entry)
                                        }
                                        className="mb-5 p-4 bg-[#181818] rounded-lg border border-[#414146]"
                                    >
                                        <label className="block text-sm text-gray-300 mb-2">
                                            Nowa data obejrzenia
                                        </label>

                                        <input
                                            type="date"
                                            value={editDate}
                                            onChange={(event) =>
                                                setEditDate(event.target.value)
                                            }
                                            required
                                            className="w-full bg-[#242426] border border-[#414146] rounded-lg p-3 text-white mb-3"
                                        />

                                        <div className="flex gap-3">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="bg-[#cf6054] hover:bg-[#b94d43] disabled:opacity-50 px-5 py-2 rounded-lg transition"
                                            >
                                                {saving ? "Zapisywanie..." : "Zapisz"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setEditingId(null)}
                                                className="bg-[#303034] hover:bg-[#414146] px-5 py-2 rounded-lg transition"
                                            >
                                                Anuluj
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="space-y-4">
                                    {entry.mediaItems.map((item, index) => {
                                        const details = item.details;
                                        const title = getMediaLabel(item, details);
                                        const posterPath =
                                            details?.posterPath ||
                                            details?.poster_path ||
                                            details?.stillPath ||
                                            details?.still_path;

                                        const poster = posterPath
                                            ? `${IMAGE_URL}${posterPath}`
                                            : "https://placehold.co/100x150?text=Brak";

                                        const link =
                                            item.mediaType === "EPISODE"
                                                ? `/movie/tv/${item.tmdbId}/season/${item.seasonNumber}/episode/${item.episodeNumber}`
                                                : item.mediaType === "MOVIE"
                                                    ? `/movie/movie/${item.tmdbId}`
                                                    : `/movie/tv/${item.tmdbId}`;

                                        return (
                                            <div
                                                key={`${item.mediaType}-${item.tmdbId}-${item.seasonNumber}-${item.episodeNumber}-${index}`}
                                                className="flex items-center gap-4"
                                            >
                                                <img
                                                    src={poster}
                                                    alt={title}
                                                    className="w-16 h-24 object-cover rounded-lg bg-[#181818]"
                                                />

                                                <div>
                                                    <a
                                                        href={link}
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            navigate(link);
                                                        }}
                                                        className="font-semibold hover:text-[#e8796e] transition"
                                                    >
                                                        {title}
                                                    </a>

                                                    <p className="text-gray-500 text-sm mt-1">
                                                        {item.mediaType === "MOVIE"
                                                            ? "Film"
                                                            : item.mediaType === "TV_SERIES"
                                                                ? "Serial"
                                                                : item.mediaType === "SEASON"
                                                                    ? "Sezon"
                                                                    : "Odcinek"}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default History;
