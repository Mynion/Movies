**API recenzji – `/api/reviews`**

**1. POST `/api/reviews`** – dodanie recenzji (wymaga zalogowania)

Body:
```json
{
  "tmdbId": 1396,
  "mediaType": "TV_SERIES",
  "seasonNumber": null,
  "episodeNumber": null,
  "title": "Świetny serial",
  "content": "Bardzo dobra fabuła i postacie.",
  "visibility": "PUBLIC"
}
```
Zwraca `201 Created` i utworzoną recenzję.

**2. GET `/api/reviews/{id}`** – pobranie recenzji po ID

Publiczne recenzje są dostępne dla wszystkich, prywatne tylko dla autora.

**3. GET `/api/reviews/me`** – wszystkie recenzje zalogowanego użytkownika (publiczne i prywatne).

**4. GET `/api/reviews/media?tmdbId=1396&mediaType=TV_SERIES`** – publiczne recenzje konkretnej produkcji.

Dla sezonów i odcinków dodatkowo `seasonNumber` i `episodeNumber`.

**5. PUT `/api/reviews/{id}`** – edycja własnej recenzji.

Body:
```json
{
  "title": "Zmieniony tytuł",
  "content": "Zmieniona treść recenzji.",
  "visibility": "PRIVATE"
}
```

**6. DELETE `/api/reviews/{id}`** – usunięcie własnej recenzji. Zwraca `204 No Content`.

**Przykładowa odpowiedź:**
```json
{
  "id": 1,
  "userId": 2,
  "username": "test",
  "mediaItemId": 5,
  "tmdbId": 1396,
  "mediaType": "TV_SERIES",
  "seasonNumber": null,
  "episodeNumber": null,
  "title": "Świetny serial",
  "content": "Bardzo dobra fabuła i postacie.",
  "visibility": "PUBLIC",
  "createdAt": "2026-11-13T20:30:00Z"
}
```

**Dodatkowe informacje:**
- `mediaType`: `MOVIE`, `TV_SERIES`, `SEASON`, `EPISODE`.
- `visibility`: `PUBLIC` lub `PRIVATE`.
- `tmdbId` dla sezonów i odcinków to ID całego serialu w TMDB.
- `seasonNumber` jest wymagany dla sezonów i odcinków, a `episodeNumber` tylko dla odcinków.
- Jeden użytkownik może mieć tylko jedną recenzję danej produkcji.
- Uwierzytelnianie odbywa się przez ciasteczko sesyjne `JSESSIONID`.
- Najważniejsze błędy: `400` – nieprawidłowe dane, `401` – brak zalogowania, `403` – brak uprawnień, `404` – nie znaleziono, `409` – recenzja już istnieje.