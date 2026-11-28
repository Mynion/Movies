import { useEffect, useState } from "react";
import {
    Link,
    useParams,
    useNavigate,
    useLocation
} from "react-router";
import Navbar from "../components/Navbar";
import MovieHeader from "../components/movieDetails/MovieHeader";
import UserRatingStats from "../components/movieDetails/UserRatingStats";
import SeasonsSection from "../components/movieDetails/SeasonsSection";
import CastSection from "../components/movieDetails/CastSection";
import ReviewsSection from "../components/movieDetails/ReviewsSection";
import RelatedProductions from "../components/movieDetails/RelatedProductions";

const API_URL = "http://localhost:8080/api";
const IMAGE_URL = "https://image.tmdb.org/t/p/";

const SCORE_TYPES = [
    { value: "STORY_SCORE", label: "Fabuła" },
    { value: "ACTING_SCORE", label: "Aktorstwo" },
    { value: "SOUNDTRACK_SCORE", label: "Ścieżka dźwiękowa" },
    { value: "OVERALL_SCORE", label: "Ocena ogólna (kryterium)" },
    { value: "CUSTOM_SCORE", label: "Własne kryterium" }
];

function MovieDetails() {
    const {
        type,
        id,
        seasonNumber,
        episodeNumber
    } = useParams();

    const navigate = useNavigate();
    const location = useLocation();

    const isEpisode = seasonNumber !== undefined && episodeNumber !== undefined;
    const isSeries = type === "tv" && !isEpisode;
    const mediaType = isEpisode ? "EPISODE" : isSeries ? "TV_SERIES" : "MOVIE";

    const [details, setDetails] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [activeModal, setActiveModal] = useState(null);
    const [ratingValue, setRatingValue] = useState(5);
    const [scores, setScores] = useState([]);
    const [userRating, setUserRating] = useState(null);
    const [ratingStats, setRatingStats] = useState(null);
    const [savingRating, setSavingRating] = useState(false);
    const [ratingError, setRatingError] = useState("");
    const [review, setReview] = useState("");
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewVisibility, setReviewVisibility] = useState("PUBLIC");
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [reviewSaving, setReviewSaving] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [similarProductions, setSimilarProductions] = useState([]);
    const [userLists, setUserLists] = useState([]);
    const [showListModal, setShowListModal] = useState(false);
    const [selectedListId, setSelectedListId] = useState("");
    const [listError, setListError] = useState("");
    const [addingToList, setAddingToList] = useState(false);

    const [expandedSeason, setExpandedSeason] = useState(null);

    // Pobieranie szczegółów filmu, serialu lub odcinka oraz informacji o użytkowniku.
    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError("");

                let endpoint;

                if (isEpisode) {
                    endpoint = `${API_URL}/series/${id}/seasons/${seasonNumber}/episodes/${episodeNumber}`;
                } else if (isSeries) {
                    endpoint = `${API_URL}/series/${id}`;
                } else {
                    endpoint = `${API_URL}/movies/${id}`;
                }

                const [detailsResponse, userResponse] = await Promise.all([
                    fetch(endpoint, { credentials: "include" }),
                    fetch(`${API_URL}/auth/me`, { credentials: "include" })
                ]);

                if (!detailsResponse.ok) {
                    throw new Error("Nie udało się pobrać szczegółów produkcji.");
                }

                const detailsData = await detailsResponse.json();
                setDetails(detailsData);

                if (userResponse.ok) {
                    setUser(await userResponse.json());
                } else {
                    setUser(null);
                }
            } catch (err) {
                setError(err.message || "Wystąpił błąd.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, isSeries, isEpisode, seasonNumber, episodeNumber]);

    // Pobieranie średniej ocen oraz oceny aktualnie zalogowanego użytkownika.
    useEffect(() => {
        let cancelled = false;

        async function loadRatings() {
            setUserRating(null);
            setRatingStats(null);

            const params = new URLSearchParams({
                tmdbId: id,
                mediaType
            });

            if (isEpisode) {
                params.set("seasonNumber", seasonNumber);
                params.set("episodeNumber", episodeNumber);
            }

            try {
                const statsResponse = await fetch(
                    `${API_URL}/ratings/media/stats?${params.toString()}`
                );

                if (statsResponse.ok) {
                    const stats = await statsResponse.json();
                    if (!cancelled) setRatingStats(stats);
                }

                if (user) {
                    const myRatingsResponse = await fetch(`${API_URL}/ratings/me`, {
                        credentials: "include"
                    });

                    if (myRatingsResponse.ok) {
                        const myRatings = await myRatingsResponse.json();

                        const matchingRating = myRatings.find((item) => {
                            const sameMedia =
                                String(item.tmdbId) === String(id) &&
                                item.mediaType === mediaType;

                            if (!sameMedia) return false;

                            if (isEpisode) {
                                return (
                                    Number(item.seasonNumber) === Number(seasonNumber) &&
                                    Number(item.episodeNumber) === Number(episodeNumber)
                                );
                            }

                            return true;
                        });

                        if (!cancelled) {
                            setUserRating(matchingRating || null);
                            if (matchingRating) {
                                setRatingValue(matchingRating.value);
                                setScores(
                                    (matchingRating.scores || []).map((score) => ({
                                        scoreType: score.scoreType,
                                        score: score.score,
                                        toAverage: score.toAverage,
                                        customName: score.customName || ""
                                    }))
                                );
                            } else {
                                setRatingValue(5);
                                setScores([]);
                            }
                        }
                    } else if (!cancelled) {
                        setUserRating(null);
                    }
                } else if (!cancelled) {
                    setUserRating(null);
                }
            } catch (err) {
                console.error("Nie udało się pobrać ocen:", err);
            }
        }

        loadRatings();

        return () => {
            cancelled = true;
        };
    }, [id, mediaType, isEpisode, seasonNumber, episodeNumber, user]);

    // Pobieranie publicznych recenzji produkcji oraz recenzji zalogowanego użytkownika.
    useEffect(() => {
        let cancelled = false;

        async function loadReviews() {
            const params = new URLSearchParams({
                tmdbId: id,
                mediaType
            });

            if (isEpisode) {
                params.set("seasonNumber", seasonNumber);
                params.set("episodeNumber", episodeNumber);
            }

            try {
                const publicResponse = await fetch(
                    `${API_URL}/reviews/media?${params.toString()}`
                );

                if (!publicResponse.ok) {
                    throw new Error("Nie udało się pobrać recenzji.");
                }

                const publicData = await publicResponse.json();
                let matchingUserReview = null;

                if (user) {
                    const myReviewsResponse = await fetch(`${API_URL}/reviews/me`, {
                        credentials: "include"
                    });

                    if (myReviewsResponse.ok) {
                        const myReviews = await myReviewsResponse.json();
                        matchingUserReview = myReviews.find((item) => {
                            const sameMedia =
                                String(item.tmdbId) === String(id) &&
                                item.mediaType === mediaType;

                            if (!sameMedia) return false;

                            if (isEpisode) {
                                return (
                                    Number(item.seasonNumber) === Number(seasonNumber) &&
                                    Number(item.episodeNumber) === Number(episodeNumber)
                                );
                            }

                            return true;
                        }) || null;
                    }
                }

                if (!cancelled) {
                    setReviews(Array.isArray(publicData) ? publicData : []);
                    setUserReview(matchingUserReview);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Nie udało się pobrać recenzji:", err);
                }
            }
        }

        loadReviews();

        return () => {
            cancelled = true;
        };
    }, [id, mediaType, isEpisode, seasonNumber, episodeNumber, user]);

    // Pobieranie rekomendacji i podobnych produkcji z backendu.
    useEffect(() => {
        if (isEpisode) {
            setRecommendations([]);
            setSimilarProductions([]);
            return;
        }

        let cancelled = false;
        const endpoint = isSeries ? "series" : "movies";

        async function loadRelatedProductions() {
            try {
                const [recommendationsResponse, similarResponse] = await Promise.all([
                    fetch(`${API_URL}/${endpoint}/${id}/recommendations?page=1`),
                    fetch(`${API_URL}/${endpoint}/${id}/similar?page=1`)
                ]);

                if (!recommendationsResponse.ok || !similarResponse.ok) {
                    throw new Error("Nie udało się pobrać rekomendowanych produkcji.");
                }

                const [recommendationsData, similarData] = await Promise.all([
                    recommendationsResponse.json(),
                    similarResponse.json()
                ]);

                if (!cancelled) {
                    setRecommendations(
                        Array.isArray(recommendationsData.results)
                            ? recommendationsData.results
                            : []
                    );
                    setSimilarProductions(
                        Array.isArray(similarData.results)
                            ? similarData.results
                            : []
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("Nie udało się pobrać rekomendacji:", err);
                    setRecommendations([]);
                    setSimilarProductions([]);
                }
            }
        }

        setRecommendations([]);
        setSimilarProductions([]);
        loadRelatedProductions();

        return () => {
            cancelled = true;
        };
    }, [id, isSeries, isEpisode]);

    function requireLogin(modalType) {
        if (!user) {
            navigate("/login", {
                state: { from: location.pathname }
            });
            return;
        }

        if (modalType === "rating") {
            setRatingError("");
            setActiveModal("rating");
        } else {
            setActiveModal(modalType);
        }
    }

    function addScore() {
        if (scores.length >= 10) return;

        setScores((current) => [
            ...current,
            {
                scoreType: "STORY_SCORE",
                score: 5,
                toAverage: true,
                customName: ""
            }
        ]);
    }

    function updateScore(index, field, value) {
        setScores((current) =>
            current.map((score, scoreIndex) =>
                scoreIndex === index
                    ? { ...score, [field]: value }
                    : score
            )
        );
    }

    function removeScore(index) {
        setScores((current) =>
            current.filter((_, scoreIndex) => scoreIndex !== index)
        );
    }

    const suggestedAverage = (() => {
        const includedScores = scores
            .filter((score) => score.toAverage && score.score !== "" && Number.isFinite(Number(score.score)))
            .map((score) => Number(score.score));

        if (includedScores.length === 0) return null;

        const average =
            includedScores.reduce((sum, value) => sum + value, 0) /
            includedScores.length;

        return average.toFixed(2);
    })();

    async function refreshRatingData() {
        const params = new URLSearchParams({
            tmdbId: id,
            mediaType
        });

        if (isEpisode) {
            params.set("seasonNumber", seasonNumber);
            params.set("episodeNumber", episodeNumber);
        }

        const [statsResponse, myRatingsResponse] = await Promise.all([
            fetch(`${API_URL}/ratings/media/stats?${params.toString()}`),
            fetch(`${API_URL}/ratings/me`, { credentials: "include" })
        ]);

        if (statsResponse.ok) {
            setRatingStats(await statsResponse.json());
        }

        if (myRatingsResponse.ok) {
            const myRatings = await myRatingsResponse.json();
            const matchingRating = myRatings.find((item) => {
                const sameMedia =
                    String(item.tmdbId) === String(id) &&
                    item.mediaType === mediaType;

                if (!sameMedia) return false;

                if (isEpisode) {
                    return (
                        Number(item.seasonNumber) === Number(seasonNumber) &&
                        Number(item.episodeNumber) === Number(episodeNumber)
                    );
                }

                return true;
            });

            setUserRating(matchingRating || null);
        }
    }

    async function handleRatingSubmit(event) {
        event.preventDefault();
        setRatingError("");

        const parsedValue = Number(ratingValue);

        if (!Number.isFinite(parsedValue) || parsedValue < 1 || parsedValue > 10) {
            setRatingError("Ocena ogólna musi być liczbą od 1 do 10.");
            return;
        }

        if (scores.some((score) =>
            !Number.isFinite(Number(score.score)) ||
            Number(score.score) < 1 ||
            Number(score.score) > 10 ||
            (score.scoreType === "CUSTOM_SCORE" && !score.customName.trim())
        )) {
            setRatingError("Sprawdź kryteria. Każda ocena musi być od 1 do 10, a własne kryterium musi mieć nazwę.");
            return;
        }

        const body = {
            value: parsedValue,
            scores: scores.map((score) => ({
                scoreType: score.scoreType,
                score: Number(score.score),
                toAverage: Boolean(score.toAverage),
                customName: score.scoreType === "CUSTOM_SCORE"
                    ? score.customName.trim()
                    : null
            }))
        };

        if (!userRating) {
            body.tmdbId = Number(id);
            body.mediaType = mediaType;

            if (isEpisode) {
                body.seasonNumber = Number(seasonNumber);
                body.episodeNumber = Number(episodeNumber);
            }
        }

        try {
            setSavingRating(true);

            const response = await fetch(
                userRating
                    ? `${API_URL}/ratings/${userRating.id}`
                    : `${API_URL}/ratings`,
                {
                    method: userRating ? "PUT" : "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname }
                });
                return;
            }

            if (response.status === 409) {
                setRatingError("Ocena tej produkcji już istnieje. Odśwież stronę i spróbuj ponownie.");
                return;
            }

            if (!response.ok) {
                let message = "Nie udało się zapisać oceny.";
                try {
                    const errorData = await response.json();
                    message = errorData.message || errorData.error || message;
                } catch {
                    // Odpowiedź serwera nie zawiera JSON.
                }
                throw new Error(message);
            }

            const savedRating = await response.json();
            setUserRating(savedRating);
            setActiveModal(null);
            await refreshRatingData();
        } catch (err) {
            setRatingError(err.message || "Wystąpił błąd podczas zapisywania oceny.");
        } finally {
            setSavingRating(false);
        }
    }

    async function handleRatingDelete() {
        if (!userRating) return;

        const confirmed = window.confirm("Czy na pewno chcesz usunąć swoją ocenę?");
        if (!confirmed) return;

        try {
            setSavingRating(true);
            const response = await fetch(`${API_URL}/ratings/${userRating.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname }
                });
                return;
            }

            if (!response.ok && response.status !== 204) {
                throw new Error("Nie udało się usunąć oceny.");
            }

            setUserRating(null);
            setRatingValue(5);
            setScores([]);
            setActiveModal(null);
            await refreshRatingData();
        } catch (err) {
            setRatingError(err.message || "Wystąpił błąd podczas usuwania oceny.");
        } finally {
            setSavingRating(false);
        }
    }

    function openReviewModal() {
        setReviewError("");
        setReviewTitle(userReview?.title || "");
        setReview(userReview?.content || "");
        setReviewVisibility(userReview?.visibility || "PUBLIC");
        setActiveModal("review");
    }

    async function refreshReviews() {
        const params = new URLSearchParams({
            tmdbId: id,
            mediaType
        });

        if (isEpisode) {
            params.set("seasonNumber", seasonNumber);
            params.set("episodeNumber", episodeNumber);
        }

        const [publicResponse, myReviewsResponse] = await Promise.all([
            fetch(`${API_URL}/reviews/media?${params.toString()}`),
            fetch(`${API_URL}/reviews/me`, { credentials: "include" })
        ]);

        if (publicResponse.ok) {
            const publicData = await publicResponse.json();
            setReviews(Array.isArray(publicData) ? publicData : []);
        }

        if (myReviewsResponse.ok) {
            const myReviews = await myReviewsResponse.json();
            const matchingReview = myReviews.find((item) => {
                const sameMedia =
                    String(item.tmdbId) === String(id) &&
                    item.mediaType === mediaType;

                if (!sameMedia) return false;

                if (isEpisode) {
                    return (
                        Number(item.seasonNumber) === Number(seasonNumber) &&
                        Number(item.episodeNumber) === Number(episodeNumber)
                    );
                }

                return true;
            });

            setUserReview(matchingReview || null);
        }
    }

    async function handleReviewSubmit(event) {
        event.preventDefault();
        setReviewError("");

        const trimmedTitle = reviewTitle.trim();
        const trimmedContent = review.trim();

        if (!trimmedTitle) {
            setReviewError("Podaj tytuł recenzji.");
            return;
        }

        if (!trimmedContent) {
            setReviewError("Treść recenzji nie może być pusta.");
            return;
        }

        const body = {
            title: trimmedTitle,
            content: trimmedContent,
            visibility: reviewVisibility
        };

        if (!userReview) {
            body.tmdbId = Number(id);
            body.mediaType = mediaType;

            if (isEpisode) {
                body.seasonNumber = Number(seasonNumber);
                body.episodeNumber = Number(episodeNumber);
            }
        }

        try {
            setReviewSaving(true);

            const response = await fetch(
                userReview
                    ? `${API_URL}/reviews/${userReview.id}`
                    : `${API_URL}/reviews`,
                {
                    method: userReview ? "PUT" : "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname }
                });
                return;
            }

            if (response.status === 409) {
                setReviewError("Masz już recenzję tej produkcji. Odśwież stronę i spróbuj ponownie.");
                return;
            }

            if (!response.ok) {
                let message = "Nie udało się zapisać recenzji.";
                try {
                    const errorData = await response.json();
                    message = errorData.message || errorData.error || message;
                } catch {
                    // Odpowiedź serwera nie zawiera JSON.
                }
                throw new Error(message);
            }

            const savedReview = await response.json();
            setUserReview(savedReview);
            setActiveModal(null);
            await refreshReviews();
        } catch (err) {
            setReviewError(err.message || "Wystąpił błąd podczas zapisywania recenzji.");
        } finally {
            setReviewSaving(false);
        }
    }

    async function handleReviewDelete() {
        if (!userReview) return;

        const confirmed = window.confirm("Czy na pewno chcesz usunąć swoją recenzję?");
        if (!confirmed) return;

        try {
            setReviewSaving(true);
            const response = await fetch(`${API_URL}/reviews/${userReview.id}`, {
                method: "DELETE",
                credentials: "include"
            });

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname }
                });
                return;
            }

            if (!response.ok && response.status !== 204) {
                throw new Error("Nie udało się usunąć recenzji.");
            }

            setUserReview(null);
            setReviewTitle("");
            setReview("");
            setActiveModal(null);
            await refreshReviews();
        } catch (err) {
            setReviewError(err.message || "Wystąpił błąd podczas usuwania recenzji.");
        } finally {
            setReviewSaving(false);
        }
    }

    async function openAddToListModal() {
        if (!user) {
            navigate("/login", {
                state: { from: location.pathname }
            });
            return;
        }

        try {
            setListError("");

            const response = await fetch(`${API_URL}/lists/me`, {
                credentials: "include"
            });

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname }
                });
                return;
            }

            if (!response.ok) {
                throw new Error("Nie udało się pobrać Twoich list.");
            }

            const data = await response.json();
            setUserLists(Array.isArray(data) ? data : []);
            setSelectedListId(data.length > 0 ? String(data[0].id) : "");
            setShowListModal(true);
        } catch (err) {
            setListError(err.message || "Wystąpił błąd.");
        }
    }
    async function handleAddToList() {
        if (!selectedListId) {
            setListError("Najpierw utwórz listę.");
            return;
        }

        const body = {
            tmdbId: Number(id),
            mediaType
        };

        if (isEpisode) {
            body.seasonNumber = Number(seasonNumber);
            body.episodeNumber = Number(episodeNumber);
        }

        try {
            setAddingToList(true);
            setListError("");

            const response = await fetch(
                `${API_URL}/lists/${selectedListId}/items`,
                {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                }
            );

            if (response.status === 401) {
                navigate("/login", {
                    state: { from: location.pathname }
                });
                return;
            }

            if (!response.ok) {
                let message = "Nie udało się dodać produkcji do listy.";

                try {
                    const errorData = await response.json();
                    message = errorData.message || errorData.error || message;
                } catch {
                    // Odpowiedź nie zawiera JSON.
                }

                throw new Error(message);
            }

            // API zwraca zaktualizowaną listę.
            const updatedList = await response.json();

            setUserLists((current) =>
                current.map((list) =>
                    list.id === updatedList.id ? updatedList : list
                )
            );

            setShowListModal(false);
        } catch (err) {
            setListError(err.message || "Wystąpił błąd.");
        } finally {
            setAddingToList(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#181818] text-white">
                <Navbar />
                <div className="text-center py-32 text-gray-400">
                    Ładowanie szczegółów...
                </div>
            </div>
        );
    }

    if (error || !details) {
        return (
            <div className="min-h-screen bg-[#181818] text-white">
                <Navbar />
                <div className="text-center py-32 text-red-400">
                    {error || "Nie znaleziono produkcji."}
                </div>
            </div>
        );
    }

    const title = isSeries || isEpisode ? details.name : details.title;

    const date = isEpisode
        ? details.airDate || details.air_date
        : isSeries
            ? details.firstAirDate || details.first_air_date
            : details.releaseDate || details.release_date;

    const year = date ? date.slice(0, 4) : "Brak daty";

    const posterPath = isEpisode
        ? details.stillPath || details.still_path
        : details.posterPath || details.poster_path;

    const backdropPath = details.backdropPath || details.backdrop_path;

    const poster = posterPath
        ? `${IMAGE_URL}w500${posterPath}`
        : "https://placehold.co/500x750?text=Brak+zdjecia";

    const backdrop = backdropPath
        ? `${IMAGE_URL}original${backdropPath}`
        : null;

    const cast = isEpisode ? [] : details.credits?.cast || [];
    const voteAverage = details.voteAverage ?? details.vote_average;
    const runtime = details.runtime;

    const seasons = isSeries
        ? details.seasons || details.Seasons || []
        : [];

    const productionType = isEpisode
        ? "Odcinek serialu"
        : isSeries
            ? "Serial"
            : "Film";

    return (
        <div className="min-h-screen bg-[#181818] text-white">
            <Navbar />

            <MovieHeader backdrop={backdrop} isEpisode={isEpisode} id={id} poster={poster} title={title} productionType={productionType} year={year} seasonNumber={seasonNumber} episodeNumber={episodeNumber} details={details} isSeries={isSeries} runtime={runtime} voteAverage={voteAverage} userRating={userRating} requireLogin={requireLogin} openReviewModal={openReviewModal} user={user} userReview={userReview} openAddToListModal={openAddToListModal} />
            <UserRatingStats ratingStats={ratingStats} userRating={userRating} />
            <SeasonsSection isSeries={isSeries} seasons={seasons} expandedSeason={expandedSeason} setExpandedSeason={setExpandedSeason} id={id} IMAGE_URL={IMAGE_URL} />
            <CastSection isEpisode={isEpisode} cast={cast} IMAGE_URL={IMAGE_URL} />
            <ReviewsSection reviews={reviews} userReview={userReview} openReviewModal={openReviewModal} />
            <RelatedProductions isEpisode={isEpisode} recommendations={recommendations} similarProductions={similarProductions} isSeries={isSeries} IMAGE_URL={IMAGE_URL} />
            {/* Modal oceny */}
            {activeModal === "rating" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 overflow-y-auto">
                    <div className="bg-[#242426] border border-[#303034] rounded-xl p-7 w-full max-w-2xl my-auto">
                        <h2 className="text-2xl font-bold mb-2">
                            {userRating ? "Edytuj ocenę:" : "Oceń:"} {title}
                        </h2>

                        <p className="text-gray-400 text-sm mb-6">
                            Ocena ogólna jest niezależna od ocen poszczególnych kryteriów.
                        </p>

                        <form onSubmit={handleRatingSubmit}>
                            <label className="block text-gray-300 mb-2">
                                Twoja ocena ogólna (1–10)
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="10"
                                step="0.1"
                                required
                                value={ratingValue}
                                onChange={(event) => setRatingValue(event.target.value)}
                                className="w-full bg-[#181818] border border-[#414146] rounded-lg p-3 text-white mb-6"
                            />

                            <div className="flex items-center justify-between gap-3 mb-4">
                                <h3 className="text-lg font-semibold">
                                    Kryteria oceny
                                </h3>
                                <button
                                    type="button"
                                    onClick={addScore}
                                    disabled={scores.length >= 10}
                                    className="bg-[#303034] hover:bg-[#414146] disabled:opacity-50 px-4 py-2 rounded-lg text-sm transition"
                                >
                                    + Dodaj kryterium
                                </button>
                            </div>

                            {scores.length === 0 && (
                                <p className="text-gray-400 text-sm mb-5">
                                    Nie dodano jeszcze żadnych kryteriów. Możesz zapisać samą ocenę ogólną.
                                </p>
                            )}

                            <div className="space-y-4 mb-6">
                                {scores.map((score, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#181818] border border-[#414146] rounded-lg p-4"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-3 mb-3">
                                            <div className="flex-1">
                                                <label className="block text-gray-300 text-sm mb-2">
                                                    Typ oceny
                                                </label>
                                                <select
                                                    value={score.scoreType}
                                                    onChange={(event) =>
                                                        updateScore(index, "scoreType", event.target.value)
                                                    }
                                                    className="w-full bg-[#242426] border border-[#414146] rounded-lg p-3 text-white"
                                                >
                                                    {SCORE_TYPES.map((typeOption) => (
                                                        <option
                                                            key={typeOption.value}
                                                            value={typeOption.value}
                                                        >
                                                            {typeOption.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="sm:w-32">
                                                <label className="block text-gray-300 text-sm mb-2">
                                                    Ocena
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    step="0.1"
                                                    required
                                                    value={score.score}
                                                    onChange={(event) =>
                                                        updateScore(index, "score", event.target.value)
                                                    }
                                                    className="w-full bg-[#242426] border border-[#414146] rounded-lg p-3 text-white"
                                                />
                                            </div>
                                        </div>

                                        {score.scoreType === "CUSTOM_SCORE" && (
                                            <div className="mb-3">
                                                <label className="block text-gray-300 text-sm mb-2">
                                                    Nazwa własnego kryterium
                                                </label>
                                                <input
                                                    type="text"
                                                    maxLength="100"
                                                    required
                                                    value={score.customName}
                                                    onChange={(event) =>
                                                        updateScore(index, "customName", event.target.value)
                                                    }
                                                    placeholder="Np. Klimat, efekty specjalne..."
                                                    className="w-full bg-[#242426] border border-[#414146] rounded-lg p-3 text-white"
                                                />
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <label className="flex items-center gap-2 text-sm text-gray-300">
                                                <input
                                                    type="checkbox"
                                                    checked={score.toAverage}
                                                    onChange={(event) =>
                                                        updateScore(index, "toAverage", event.target.checked)
                                                    }
                                                    className="accent-[#cf6054] w-4 h-4"
                                                />
                                                Wliczaj tę ocenę do sugerowanej średniej
                                            </label>

                                            <button
                                                type="button"
                                                onClick={() => removeScore(index)}
                                                className="text-red-400 hover:text-red-300 text-sm transition"
                                            >
                                                Usuń kryterium
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[#181818] border border-[#414146] rounded-lg p-4 mb-6">
                                <p className="text-gray-300">
                                    Sugerowana średnia z zaznaczonych kryteriów:{" "}
                                    <span className="font-semibold text-white">
                                        {suggestedAverage !== null
                                            ? `${suggestedAverage}/10`
                                            : "—"}
                                    </span>
                                </p>
                                <p className="text-gray-500 text-xs mt-2">
                                    Do średniej brane są pod uwagę wyłącznie kryteria z zaznaczonym polem.
                                </p>
                            </div>

                            {ratingError && (
                                <p className="text-red-400 text-sm mb-4">
                                    {ratingError}
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={savingRating}
                                    className="flex-1 bg-[#cf6054] hover:bg-[#b94d43] disabled:opacity-50 rounded-lg py-3 font-medium transition"
                                >
                                    {savingRating
                                        ? "Zapisywanie..."
                                        : userRating
                                            ? "Zapisz zmiany"
                                            : "Zapisz ocenę"}
                                </button>

                                {userRating && (
                                    <button
                                        type="button"
                                        onClick={handleRatingDelete}
                                        disabled={savingRating}
                                        className="bg-red-700 hover:bg-red-800 disabled:opacity-50 rounded-lg px-5 py-3 font-medium transition"
                                    >
                                        Usuń ocenę
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => {
                                        setRatingError("");
                                        setActiveModal(null);
                                    }}
                                    className="bg-[#303034] hover:bg-[#414146] rounded-lg px-5 py-3 transition"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal recenzji */}
            {activeModal === "review" && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 overflow-y-auto">
                    <div className="bg-[#242426] border border-[#303034] rounded-xl p-7 w-full max-w-lg my-auto">
                        <h2 className="text-2xl font-bold mb-5">
                            {userReview ? "Edytuj recenzję:" : "Napisz recenzję:"} {title}
                        </h2>

                        <form onSubmit={handleReviewSubmit}>
                            <label className="block text-gray-300 mb-2">
                                Tytuł recenzji
                            </label>
                            <input
                                type="text"
                                value={reviewTitle}
                                onChange={(event) => setReviewTitle(event.target.value)}
                                required
                                placeholder="Np. Świetny serial"
                                className="w-full bg-[#181818] border border-[#414146] rounded-lg p-3 text-white mb-5"
                            />

                            <label className="block text-gray-300 mb-3">
                                Treść recenzji
                            </label>
                            <textarea
                                value={review}
                                onChange={(event) => setReview(event.target.value)}
                                required
                                minLength={1}
                                rows={6}
                                placeholder="Co sądzisz o tej produkcji?"
                                className="w-full bg-[#181818] border border-[#414146] rounded-lg p-3 text-white resize-none mb-5"
                            />

                            <label className="block text-gray-300 mb-2">
                                Widoczność recenzji
                            </label>
                            <select
                                value={reviewVisibility}
                                onChange={(event) => setReviewVisibility(event.target.value)}
                                className="w-full bg-[#181818] border border-[#414146] rounded-lg p-3 text-white mb-5"
                            >
                                <option value="PUBLIC">Publiczna</option>
                                <option value="PRIVATE">Prywatna</option>
                            </select>

                            {reviewError && (
                                <p className="text-red-400 text-sm mb-4">
                                    {reviewError}
                                </p>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    type="submit"
                                    disabled={reviewSaving || !reviewTitle.trim() || !review.trim()}
                                    className="flex-1 bg-[#cf6054] hover:bg-[#b94d43] disabled:opacity-50 rounded-lg py-3 font-medium transition"
                                >
                                    {reviewSaving
                                        ? "Zapisywanie..."
                                        : userReview
                                            ? "Zapisz zmiany"
                                            : "Opublikuj recenzję"}
                                </button>
                                {userReview && (
                                    <button
                                        type="button"
                                        onClick={handleReviewDelete}
                                        disabled={reviewSaving}
                                        className="bg-red-700 hover:bg-red-800 disabled:opacity-50 rounded-lg px-5 py-3 font-medium transition"
                                    >
                                        Usuń
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReviewError("");
                                        setActiveModal(null);
                                    }}
                                    className="bg-[#303034] hover:bg-[#414146] rounded-lg px-5 py-3 transition"
                                >
                                    Anuluj
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showListModal && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
                    <div className="bg-[#242426] border border-[#414146] rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-5">
                            Dodaj do listy
                        </h2>

                        {userLists.length > 0 ? (
                            <>
                                <label className="block text-sm text-gray-300 mb-2">
                                    Wybierz listę
                                </label>

                                <select
                                    value={selectedListId}
                                    onChange={(event) =>
                                        setSelectedListId(event.target.value)
                                    }
                                    className="w-full bg-[#181818] border border-[#414146] rounded-lg px-4 py-3 mb-4"
                                >
                                    {userLists.map((list) => (
                                        <option key={list.id} value={list.id}>
                                            {list.name}
                                        </option>
                                    ))}
                                </select>

                                <button
                                    onClick={handleAddToList}
                                    disabled={addingToList}
                                    className="w-full bg-[#cf6054] hover:bg-[#b94d43] disabled:opacity-50 px-5 py-3 rounded-lg font-medium transition"
                                >
                                    {addingToList ? "Dodawanie..." : "Dodaj"}
                                </button>
                            </>
                        ) : (
                            <p className="text-gray-400 mb-5">
                                Nie masz jeszcze żadnych list. Utwórz pierwszą listę na stronie „Moje listy”.
                            </p>
                        )}

                        {listError && (
                            <p className="text-red-400 text-sm mt-4">
                                {listError}
                            </p>
                        )}

                        <div className="flex justify-between items-center mt-5">
                            <Link
                                to="/lists"
                                className="text-[#cf6054] hover:text-[#e8796e] transition"
                            >
                                Przejdź do moich list
                            </Link>

                            <button
                                onClick={() => setShowListModal(false)}
                                className="bg-[#303034] hover:bg-[#414146] px-4 py-2 rounded-lg transition"
                            >
                                Zamknij
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetails;