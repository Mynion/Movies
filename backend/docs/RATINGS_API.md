# Dokumentacja API – system oceniania produkcji

**Backend:** Spring Boot  
**Base URL:** `http://localhost:8080`  
**Format danych:** JSON  
**Autoryzacja:** sesja HTTP (`JSESSIONID`)

System umożliwia ocenianie filmów, seriali, sezonów i odcinków. Każda produkcja jest oceniana niezależnie.

Użytkownik może wystawić ocenę ogólną od 1 do 10 oraz maksymalnie 10 dodatkowych ocen według określonych kryteriów.

## 1. Typy produkcji (`MediaType`)

| Wartość | Znaczenie |
|---|---|
| `MOVIE` | Film |
| `TV_SERIES` | Serial |
| `SEASON` | Sezon |
| `EPISODE` | Odcinek |

Sposób identyfikowania produkcji:

| Typ | Wymagane parametry |
|---|---|
| Film | `tmdbId`, `mediaType=MOVIE` |
| Serial | `tmdbId`, `mediaType=TV_SERIES` |
| Sezon | `tmdbId`, `mediaType=SEASON`, `seasonNumber` |
| Odcinek | `tmdbId`, `mediaType=EPISODE`, `seasonNumber`, `episodeNumber` |

**Ważne:** dla sezonów i odcinków `tmdbId` zawsze oznacza identyfikator całego serialu w TMDB.

`seasonNumber` może wynosić 0 (sezony specjalne), natomiast `episodeNumber` musi wynosić co najmniej 1.

## 2. Typy kryteriów ocen (`ScoreType`)

Backend akceptuje dokładnie pięć wartości:

| Wartość | Nazwa do wyświetlenia |
|---|---|
| `STORY_SCORE` | Fabuła |
| `ACTING_SCORE` | Aktorstwo |
| `SOUNDTRACK_SCORE` | Ścieżka dźwiękowa |
| `OVERALL_SCORE` | Ocena ogólna (kryterium) |
| `CUSTOM_SCORE` | Własne kryterium |

Każde kryterium zawiera:

- `scoreType` – typ kryterium.
- `score` – ocena od 1 do 10, maksymalnie jedno miejsce po przecinku.
- `toAverage` – czy kryterium ma być uwzględniane w sugerowanej średniej.
- `customName` – nazwa własnego kryterium, maksymalnie 100 znaków.

Dla `CUSTOM_SCORE` pole `customName` musi zawierać niepustą nazwę. Dla pozostałych typów powinno mieć wartość `null`.

**Ocena ogólna `value` jest niezależna od kryteriów.** Nawet jeśli użytkownik zaznaczy kilka kryteriów do średniej, backend nie nadpisuje automatycznie `value`. Zwraca natomiast wyliczone `suggestedAverage`.

## 3. Zestawienie endpointów

| Metoda | Endpoint | Logowanie |
|---|---|---|
| `POST` | `/api/ratings` | Tak |
| `GET` | `/api/ratings/{id}` | Nie |
| `GET` | `/api/ratings/me` | Tak |
| `GET` | `/api/ratings/media` | Nie |
| `GET` | `/api/ratings/media/stats` | Nie |
| `PUT` | `/api/ratings/{id}` | Tak |
| `DELETE` | `/api/ratings/{id}` | Tak |

## 4. POST `/api/ratings` – dodawanie oceny

Wymaga zalogowania.

Przykład dodawania oceny odcinka:

```http
POST /api/ratings
Content-Type: application/json
```

```json
{
  "tmdbId": 1396,
  "mediaType": "EPISODE",
  "seasonNumber": 1,
  "episodeNumber": 1,
  "value": 9.0,
  "scores": [
    {
      "scoreType": "STORY_SCORE",
      "score": 9.5,
      "toAverage": true,
      "customName": null
    },
    {
      "scoreType": "ACTING_SCORE",
      "score": 9.0,
      "toAverage": true,
      "customName": null
    },
    {
      "scoreType": "CUSTOM_SCORE",
      "score": 8.5,
      "toAverage": false,
      "customName": "Klimat"
    }
  ]
}
```

### Wymagane pola

| Pole | Wymagane | Opis |
|---|---|---|
| `tmdbId` | Tak | Dodatnie ID TMDB |
| `mediaType` | Tak | Typ produkcji |
| `seasonNumber` | Zależnie od typu | Numer sezonu |
| `episodeNumber` | Zależnie od typu | Numer odcinka |
| `value` | Tak | Ocena ogólna 1–10 |
| `scores` | Nie | Maksymalnie 10 kryteriów |

Przykład minimalnego żądania dla filmu:

```json
{
  "tmdbId": 550,
  "mediaType": "MOVIE",
  "value": 8.5,
  "scores": []
}
```

Przykład dla serialu:

```json
{
  "tmdbId": 1396,
  "mediaType": "TV_SERIES",
  "value": 9.5,
  "scores": []
}
```

Przykład dla sezonu:

```json
{
  "tmdbId": 1396,
  "mediaType": "SEASON",
  "seasonNumber": 1,
  "value": 9.0,
  "scores": []
}
```

**Odpowiedź:** `201 Created` + obiekt oceny.

Jeżeli użytkownik już ocenił daną produkcję, backend zwróci `409 Conflict`.

## 5. Format odpowiedzi – `RatingResponseDto`

Przykładowa odpowiedź po dodaniu lub pobraniu oceny:

```json
{
  "id": 15,
  "mediaItemId": 8,
  "tmdbId": 1396,
  "mediaType": "EPISODE",
  "seasonNumber": 1,
  "episodeNumber": 1,
  "value": 9.0,
  "suggestedAverage": 9.25,
  "createdAt": "2026-11-11T15:30:00Z",
  "scores": [
    {
      "id": 21,
      "scoreType": "STORY_SCORE",
      "score": 9.5,
      "toAverage": true,
      "customName": null
    },
    {
      "id": 22,
      "scoreType": "ACTING_SCORE",
      "score": 9.0,
      "toAverage": true,
      "customName": null
    },
    {
      "id": 23,
      "scoreType": "CUSTOM_SCORE",
      "score": 8.5,
      "toAverage": false,
      "customName": "Klimat"
    }
  ]
}
```

Znaczenie najważniejszych pól:

- `id` – identyfikator oceny w naszej bazie; używany przy GET, PUT i DELETE.
- `mediaItemId` – wewnętrzny identyfikator produkcji w naszej bazie.
- `tmdbId` – identyfikator produkcji w TMDB.
- `value` – ocena ogólna ustawiona przez użytkownika.
- `suggestedAverage` – średnia kryteriów z `toAverage=true`, zaokrąglona do dwóch miejsc po przecinku.
- `createdAt` – data utworzenia oceny.
- `scores` – lista dodatkowych kryteriów.

Jeśli żadne kryterium nie jest uwzględniane w średniej, `suggestedAverage` wynosi `null`.

## 6. GET `/api/ratings/{id}` – pobieranie pojedynczej oceny

Publiczny endpoint.

Przykład:

```http
GET /api/ratings/15
```

**Odpowiedź:** `200 OK` + `RatingResponseDto`.

Jeśli ocena nie istnieje, backend zwróci `404 Not Found`.

## 7. GET `/api/ratings/me` – oceny zalogowanego użytkownika

Wymaga zalogowania.

```http
GET /api/ratings/me
```

**Odpowiedź:** `200 OK` + tablica obiektów `RatingResponseDto`.

Przykładowo:

```json
[
  {
    "id": 15,
    "mediaItemId": 8,
    "tmdbId": 1396,
    "mediaType": "TV_SERIES",
    "seasonNumber": null,
    "episodeNumber": null,
    "value": 9.5,
    "suggestedAverage": null,
    "createdAt": "2026-11-11T15:30:00Z",
    "scores": []
  }
]
```

Endpoint można wykorzystać do wyświetlenia ocen na profilu użytkownika oraz do sprawdzenia, czy użytkownik ocenił już konkretną produkcję.

Przy porównywaniu należy uwzględnić `mediaType`, `tmdbId` oraz, w przypadku sezonów i odcinków, ich numery.

## 8. GET `/api/ratings/media` – oceny produkcji

Publiczny endpoint zwracający listę ocen konkretnej produkcji.

### Film

```http
GET /api/ratings/media?tmdbId=550&mediaType=MOVIE
```

### Serial

```http
GET /api/ratings/media?tmdbId=1396&mediaType=TV_SERIES
```

### Sezon

```http
GET /api/ratings/media?tmdbId=1396&mediaType=SEASON&seasonNumber=1
```

### Odcinek

```http
GET /api/ratings/media?tmdbId=1396&mediaType=EPISODE&seasonNumber=1&episodeNumber=1
```

**Odpowiedź:** `200 OK` + tablica obiektów `RatingResponseDto`.

Jeżeli produkcja nie ma żadnych ocen lub nie istnieje jeszcze w naszej bazie:

```json
[]
```

Endpoint nie tworzy nowych rekordów i nie pobiera danych z TMDB.

Oceny całego serialu, jego sezonów i odcinków są przechowywane niezależnie.

## 9. GET `/api/ratings/media/stats` – statystyki ocen

Publiczny endpoint.

Przyjmuje identyczne parametry jak `/api/ratings/media`.

Przykład:

```http
GET /api/ratings/media/stats?tmdbId=1396&mediaType=TV_SERIES
```

**Odpowiedź:** `200 OK`

```json
{
  "averageRating": 8.75,
  "ratingsCount": 12
}
```

Pola:

- `averageRating` – średnia ocen ogólnych `value` wystawionych przez użytkowników, zaokrąglona do dwóch miejsc po przecinku.
- `ratingsCount` – liczba ocen.

Jeśli nie ma ocen:

```json
{
  "averageRating": null,
  "ratingsCount": 0
}
```

Średnia nie jest obliczana z dodatkowych kryteriów, lecz z głównych ocen `value`.

Statystyki serialu nie uwzględniają automatycznie ocen sezonów ani odcinków.

## 10. PUT `/api/ratings/{id}` – edycja oceny

Wymaga zalogowania. Użytkownik może edytować wyłącznie własne oceny.

Przykład:

```http
PUT /api/ratings/15
Content-Type: application/json
```

```json
{
  "value": 9.5,
  "scores": [
    {
      "scoreType": "STORY_SCORE",
      "score": 10.0,
      "toAverage": true,
      "customName": null
    },
    {
      "scoreType": "SOUNDTRACK_SCORE",
      "score": 9.0,
      "toAverage": true,
      "customName": null
    }
  ]
}
```

Podczas edycji:

- `value` jest wymagane.
- `scores` jest wymagane i może być pustą tablicą.
- Przesyłana lista kryteriów całkowicie zastępuje poprzednią.
- Nie przesyłamy `tmdbId`, `mediaType`, `seasonNumber` ani `episodeNumber`.

Aby usunąć wszystkie kryteria, należy wysłać:

```json
{
  "value": 9.5,
  "scores": []
}
```

**Odpowiedź:** `200 OK` + zaktualizowany `RatingResponseDto`.

## 11. DELETE `/api/ratings/{id}` – usuwanie oceny

Wymaga zalogowania.

Przykład:

```http
DELETE /api/ratings/15
```

Nie wymaga body.

**Odpowiedź:** `204 No Content`.

Po usunięciu należy odświeżyć oceny i statystyki produkcji.

## 12. Uwierzytelnianie

Backend wykorzystuje sesję HTTP, a nie JWT.

Po zalogowaniu przeglądarka otrzymuje cookie `JSESSIONID`. W żądaniach wymagających autoryzacji należy przesyłać cookie sesyjne.

Przykład w React:

```javascript
const response = await fetch(
  "http://localhost:8080/api/ratings/me",
  {
    method: "GET",
    credentials: "include"
  }
);

const ratings = await response.json();
```

Przykład dodawania oceny:

```javascript
const response = await fetch(
  "http://localhost:8080/api/ratings",
  {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      tmdbId: 550,
      mediaType: "MOVIE",
      value: 8.5,
      scores: []
    })
  }
);
```

Analogicznie należy postępować przy PUT i DELETE.

## 13. Statusy HTTP i błędy

| Status | Znaczenie |
|---|---|
| `200 OK` | Poprawne pobranie lub edycja |
| `201 Created` | Ocena została dodana |
| `204 No Content` | Ocena została usunięta |
| `400 Bad Request` | Błędne dane lub parametry |
| `401 Unauthorized` | Brak uwierzytelnienia |
| `403 Forbidden` | Brak uprawnień do oceny |
| `404 Not Found` | Ocena nie istnieje |
| `409 Conflict` | Użytkownik już ocenił produkcję |

Błędy obsługiwane przez `GlobalExceptionHandler` mają strukturę:

```json
{
  "status": 400,
  "message": "Treść błędu"
}
```

Odpowiedzi błędów generowane bezpośrednio przez Spring Security mogą mieć inny format.

## 14. Sugerowany sposób implementacji we froncie

Na stronie szczegółów filmu, serialu, sezonu lub odcinka:

1. Pobrać statystyki przez `GET /api/ratings/media/stats`.
2. W razie potrzeby pobrać listę ocen przez `GET /api/ratings/media`.
3. Jeśli użytkownik jest zalogowany, sprawdzić jego oceny przez `GET /api/ratings/me`.
4. Jeśli nie ocenił produkcji, wyświetlić formularz dodawania (`POST`).
5. Jeśli już ocenił, wyświetlić jego ocenę oraz przyciski edycji (`PUT`) i usuwania (`DELETE`).
6. Po każdej zmianie odświeżyć ocenę użytkownika, listę ocen i statystyki.

Formularz oceniania powinien zawierać:

- Główną ocenę ogólną `value` (1–10).
- Możliwość dodawania kryteriów oceniania (maksymalnie 10).
- Wybór typu kryterium spośród wartości `ScoreType`.
- Pole nazwy własnej dla `CUSTOM_SCORE`.
- Ocenę każdego kryterium (1–10).
- Przełącznik `toAverage`.
- Wyświetlanie sugerowanej średniej z zaznaczonych kryteriów.

**Ważne:** sugerowana średnia nie zastępuje automatycznie oceny ogólnej. Użytkownik sam decyduje o wartości `value`.

Każdy film, serial, sezon i odcinek posiada niezależne oceny oraz statystyki.