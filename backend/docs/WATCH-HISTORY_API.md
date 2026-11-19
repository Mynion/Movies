**API historii oglądania – `/api/watch-history`**

Wszystkie endpointy wymagają zalogowania (`JSESSIONID`). Użytkownik ma dostęp wyłącznie do własnej historii.

**1. POST `/api/watch-history`** – dodanie wpisu historii

Body:
```json
{
  "watchedAt": "2026-11-12T20:00:00Z",
  "progress": 100,
  "mediaItems": [
    {
      "tmdbId": 1396,
      "mediaType": "EPISODE",
      "seasonNumber": 1,
      "episodeNumber": 1
    },
    {
      "tmdbId": 1396,
      "mediaType": "EPISODE",
      "seasonNumber": 1,
      "episodeNumber": 2
    }
  ]
}
```

Zwraca `201 Created` i utworzony wpis.

`watchedAt` jest opcjonalne (domyślnie aktualny czas), `progress` jest opcjonalne (0–100), a `mediaItems` musi zawierać co najmniej jedną produkcję.

**2. GET `/api/watch-history/me`** – cała historia zalogowanego użytkownika, posortowana od najnowszych wpisów.

**3. GET `/api/watch-history/me/range?start=2026-11-01T00:00:00Z&end=2026-12-01T00:00:00Z`** – historia z określonego zakresu dat.

`start` jest włącznie, a `end` wyłącznie. Daty przekazujemy w formacie ISO 8601.

**4. GET `/api/watch-history/{id}`** – pobranie pojedynczego własnego wpisu.

**5. PUT `/api/watch-history/{id}`** – edycja własnego wpisu.

Body:
```json
{
  "watchedAt": "2026-11-13T21:00:00Z",
  "progress": 100,
  "mediaItems": [
    {
      "tmdbId": 1396,
      "mediaType": "EPISODE",
      "seasonNumber": 1,
      "episodeNumber": 3
    }
  ]
}
```

Wymagane są `watchedAt` i niepusta lista `mediaItems`. Aktualizacja zastępuje dotychczasową listę produkcji.

**6. DELETE `/api/watch-history/{id}`** – usunięcie własnego wpisu. Zwraca `204 No Content`.

**Przykładowa odpowiedź POST/GET/PUT:**
```json
{
  "id": 12,
  "userId": 2,
  "watchedAt": "2026-11-12T20:00:00Z",
  "progress": 100,
  "mediaItems": [
    {
      "tmdbId": 1396,
      "mediaType": "EPISODE",
      "seasonNumber": 1,
      "episodeNumber": 1
    },
    {
      "tmdbId": 1396,
      "mediaType": "EPISODE",
      "seasonNumber": 1,
      "episodeNumber": 2
    }
  ]
}
```

**Dodatkowe informacje:**
- `mediaType`: `MOVIE`, `TV_SERIES`, `SEASON`, `EPISODE`.
- Dla sezonów i odcinków `tmdbId` oznacza ID całego serialu.
- `seasonNumber` jest wymagany dla sezonów i odcinków, a `episodeNumber` tylko dla odcinków.
- Jeden wpis może zawierać wiele produkcji.
- Tę samą produkcję można dodać do historii wielokrotnie, w osobnych wpisach.
- Kolejność produkcji wewnątrz wpisu nie jest gwarantowana.
- Błędy: `400` – nieprawidłowe dane, `401` – brak zalogowania, `403` – cudzy wpis, `404` – nie znaleziono wpisu.