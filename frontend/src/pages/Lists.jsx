
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:8080/api";
const IMAGE_URL = "https://image.tmdb.org/t/p/w342";

function Lists() {
    const navigate = useNavigate();

    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingList, setEditingList] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState("PRIVATE");
    const [saving, setSaving] = useState(false);

    // Szczegóły produkcji pobieramy z API filmów i seriali,
    // ponieważ endpoint list zwraca jedynie identyfikatory.
    const [itemDetails, setItemDetails] = useState({});

    async function loadLists() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/lists/me`, {
                credentials: "include"
            });

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Nie udało się pobrać list.");
            }

            const data = await response.json();
            setLists(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message || "Wystąpił błąd podczas pobierania list.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadLists();
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadItemsDetails() {
            const items = lists.flatMap((list) =>
                (list.mediaItems || []).map((item) => ({
                    ...item,
                    listId: list.id
                }))
            );

            const missingItems = items.filter(
                (item) => !itemDetails[itemKey(item)]
            );

            const results = await Promise.all(
                missingItems.map(async (item) => {
                    try {
                        let endpoint;

                        if (item.mediaType === "MOVIE") {
                            endpoint = `${API_URL}/movies/${item.tmdbId}`;
                        } else if (item.mediaType === "TV_SERIES" || item.mediaType === "SEASON") {
                            endpoint = `${API_URL}/series/${item.tmdbId}`;
                        } else if (item.mediaType === "EPISODE") {
                            endpoint =
                                `${API_URL}/series/${item.tmdbId}` +
                                `/seasons/${item.seasonNumber}` +
                                `/episodes/${item.episodeNumber}`;
                        } else {
                            return [itemKey(item), null];
                        }

                        const response = await fetch(endpoint);

                        if (!response.ok) {
                            return [itemKey(item), null];
                        }

                        return [itemKey(item), await response.json()];
                    } catch {
                        return [itemKey(item), null];
                    }
                })
            );

            if (!cancelled) {
                setItemDetails((current) => ({
                    ...current,
                    ...Object.fromEntries(results)
                }));
            }
        }

        if (lists.length > 0) {
            loadItemsDetails();
        }

        return () => {
            cancelled = true;
        };
    }, [lists]);

    function itemKey(item) {
        return [
            item.tmdbId,
            item.mediaType,
            item.seasonNumber ?? "",
            item.episodeNumber ?? ""
        ].join("-");
    }

    function openCreateForm() {
        setEditingList(null);
        setName("");
        setDescription("");
        setVisibility("PRIVATE");
        setShowForm(true);
    }

    function openEditForm(list) {
        setEditingList(list);
        setName(list.name || "");
        setDescription(list.description || "");
        setVisibility(list.visibility || "PRIVATE");
        setShowForm(true);
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!name.trim()) {
            setError("Nazwa listy nie może być pusta.");
            return;
        }

        try {
            setSaving(true);
            setError("");

            const response = await fetch(
                editingList
                    ? `${API_URL}/lists/${editingList.id}`
                    : `${API_URL}/lists`,
                {
                    method: editingList ? "PUT" : "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: name.trim(),
                        description: description.trim(),
                        visibility
                    })
                }
            );

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Nie udało się zapisać listy.");
            }

            setShowForm(false);
            await loadLists();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function deleteList(listId) {
        if (!window.confirm("Czy na pewno chcesz usunąć tę listę?")) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/lists/${listId}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            if (!response.ok && response.status !== 204) {
                throw new Error("Nie udało się usunąć listy.");
            }

            setLists((current) =>
                current.filter((list) => list.id !== listId)
            );
        } catch (err) {
            setError(err.message);
        }
    }

    async function removeItem(listId, item) {
        const confirmed = window.confirm(
            "Czy na pewno chcesz usunąć tę produkcję z listy?"
        );

        if (!confirmed) return;

        try {
            const response = await fetch(
                `${API_URL}/lists/${listId}/items`,
                {
                    method: "DELETE",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        tmdbId: item.tmdbId,
                        mediaType: item.mediaType,
                        ...(item.seasonNumber != null && {
                            seasonNumber: item.seasonNumber
                        }),
                        ...(item.episodeNumber != null && {
                            episodeNumber: item.episodeNumber
                        })
                    })
                }
            );

            if (response.status === 401) {
                navigate("/login");
                return;
            }

            if (!response.ok) {
                throw new Error("Nie udało się usunąć produkcji z listy.");
            }

            const updatedList = await response.json();

            setLists((current) =>
                current.map((list) =>
                    list.id === listId ? updatedList : list
                )
            );
        } catch (err) {
            setError(err.message);
        }
    }

    function getItemTitle(item) {
        const details = itemDetails[itemKey(item)];

        if (item.mediaType === "SEASON") {
            return details?.name
                ? `${details.name} – sezon ${item.seasonNumber}`
                : `Sezon ${item.seasonNumber} serialu`;
        }

        if (item.mediaType === "EPISODE") {
            return details?.name
                ? `${details.name} – S${item.seasonNumber}E${item.episodeNumber}`
                : `Odcinek ${item.episodeNumber}, sezon ${item.seasonNumber}`;
        }

        return details?.title || details?.name || `Produkcja #${item.tmdbId}`;
    }

    function getItemPoster(item) {
        const details = itemDetails[itemKey(item)];

        const path =
            details?.posterPath ||
            details?.poster_path ||
            details?.stillPath ||
            details?.still_path;

        return path ? `${IMAGE_URL}${path}` : null;
    }

    function getItemLink(item) {
        if (item.mediaType === "MOVIE") {
            return `/movie/movie/${item.tmdbId}`;
        }

        if (item.mediaType === "EPISODE") {
            return `/movie/tv/${item.tmdbId}/season/${item.seasonNumber}/episode/${item.episodeNumber}`;
        }

        return `/movie/tv/${item.tmdbId}`;
    }

    return (
        <div className="min-h-screen bg-[#181818] text-white">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Moje listy</h1>
                        <p className="text-gray-400 mt-2">
                            Zarządzaj swoimi listami filmów i seriali.
                        </p>
                    </div>

                    <button
                        onClick={openCreateForm}
                        className="bg-[#cf6054] hover:bg-[#b94d43] px-5 py-3 rounded-lg font-medium transition"
                    >
                        + Utwórz listę
                    </button>
                </div>

                {error && (
                    <p className="bg-red-900/30 border border-red-800 text-red-300 rounded-lg p-4 mb-6">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p className="text-center text-gray-400 py-20">
                        Ładowanie list...
                    </p>
                ) : lists.length === 0 ? (
                    <div className="text-center py-20 bg-[#242426] border border-[#303034] rounded-xl">
                        <p className="text-gray-400 mb-5">
                            Nie masz jeszcze żadnych list.
                        </p>
                        <button
                            onClick={openCreateForm}
                            className="bg-[#cf6054] hover:bg-[#b94d43] px-5 py-3 rounded-lg transition"
                        >
                            Utwórz pierwszą listę
                        </button>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {lists.map((list) => (
                            <section
                                key={list.id}
                                className="bg-[#242426] border border-[#303034] rounded-xl p-6"
                            >
                                <div className="flex flex-wrap justify-between gap-4 mb-5">
                                    <div>
                                        <h2 className="text-xl font-bold">
                                            {list.name}
                                        </h2>
                                        {list.description && (
                                            <p className="text-gray-400 mt-1">
                                                {list.description}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-500 mt-2">
                                            {list.visibility === "PUBLIC"
                                                ? "Lista publiczna"
                                                : "Lista prywatna"}
                                            {" · "}
                                            {list.mediaItems?.length || 0} produkcji
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditForm(list)}
                                            className="bg-[#303034] hover:bg-[#414146] px-4 py-2 rounded-lg transition"
                                        >
                                            Edytuj
                                        </button>
                                        <button
                                            onClick={() => deleteList(list.id)}
                                            className="bg-red-900/40 hover:bg-red-800/60 text-red-300 px-4 py-2 rounded-lg transition"
                                        >
                                            Usuń
                                        </button>
                                    </div>
                                </div>

                                {!list.mediaItems?.length ? (
                                    <p className="text-gray-500 py-4">
                                        Ta lista jest jeszcze pusta.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                                        {list.mediaItems.map((item) => (
                                            <div
                                                key={itemKey(item)}
                                                className="min-w-0"
                                            >
                                                <Link to={getItemLink(item)}>
                                                    {getItemPoster(item) ? (
                                                        <img
                                                            src={getItemPoster(item)}
                                                            alt={getItemTitle(item)}
                                                            className="w-full aspect-[2/3] object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-full aspect-[2/3] bg-[#303034] rounded-lg flex items-center justify-center text-gray-500 text-sm text-center p-2">
                                                            Brak plakatu
                                                        </div>
                                                    )}

                                                    <p className="font-medium mt-2 line-clamp-2 hover:text-[#e8796e]">
                                                        {getItemTitle(item)}
                                                    </p>
                                                </Link>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    {item.mediaType}
                                                </p>

                                                <button
                                                    onClick={() => removeItem(list.id, item)}
                                                    className="text-sm text-red-400 hover:text-red-300 mt-2"
                                                >
                                                    Usuń z listy
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>
                )}
            </main>

            {showForm && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#242426] border border-[#414146] rounded-xl p-6 w-full max-w-lg"
                    >
                        <h2 className="text-2xl font-bold mb-6">
                            {editingList ? "Edytuj listę" : "Nowa lista"}
                        </h2>

                        <label className="block text-sm text-gray-300 mb-2">
                            Nazwa
                        </label>
                        <input
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            maxLength={100}
                            required
                            className="w-full bg-[#181818] border border-[#414146] rounded-lg px-4 py-3 mb-4 outline-none focus:border-[#cf6054]"
                            placeholder="Np. Filmy do obejrzenia"
                        />

                        <label className="block text-sm text-gray-300 mb-2">
                            Opis
                        </label>
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={3}
                            className="w-full bg-[#181818] border border-[#414146] rounded-lg px-4 py-3 mb-4 outline-none focus:border-[#cf6054]"
                            placeholder="Krótki opis listy..."
                        />

                        <label className="block text-sm text-gray-300 mb-2">
                            Widoczność
                        </label>
                        <select
                            value={visibility}
                            onChange={(event) => setVisibility(event.target.value)}
                            className="w-full bg-[#181818] border border-[#414146] rounded-lg px-4 py-3 mb-6"
                        >
                            <option value="PRIVATE">Prywatna</option>
                            <option value="PUBLIC">Publiczna</option>
                        </select>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-[#303034] hover:bg-[#414146] px-4 py-2 rounded-lg"
                            >
                                Anuluj
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-[#cf6054] hover:bg-[#b94d43] disabled:opacity-50 px-5 py-2 rounded-lg"
                            >
                                {saving ? "Zapisywanie..." : "Zapisz"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Lists;
