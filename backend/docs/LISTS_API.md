## API list użytkowników

**Adres bazowy:** `/api/lists`

Listy mogą być `PUBLIC` lub `PRIVATE`. Publiczne są dostępne dla wszystkich, prywatne tylko dla właściciela. Tworzenie i modyfikowanie list wymaga zalogowania (`JSESSIONID`).

### Endpointy

**1. POST `/api/lists`** – utworzenie nowej listy (wymaga logowania).

```json
{
  "name": "Do obejrzenia",
  "description": "Filmy i seriale na później",
  "visibility": "PRIVATE"
}
```

Zwraca `201 Created` i utworzoną listę. `visibility` jest opcjonalne (domyślnie `PRIVATE`), `description` również.

**2. GET `/api/lists/me`** – pobranie wszystkich list zalogowanego użytkownika, od najnowszych.

**3. GET `/api/lists/{id}`** – pobranie szczegółów listy wraz z jej zawartością. Publiczne listy można pobierać bez logowania.

**4. PUT `/api/lists/{id}`** – edycja własnej listy.

```json
{
  "name": "Ulubione filmy",
  "description": "Moje ulubione produkcje",
  "visibility": "PUBLIC"
}
```

Wymagane: `name`, `visibility`. Zwraca `200 OK` i zaktualizowaną listę.

**5. DELETE `/api/lists/{id}`** – usunięcie własnej listy. Zwraca `204 No Content`.

**6. POST `/api/lists/{id}/items`** – dodanie filmu, serialu, sezonu lub odcinka do własnej listy.

```json
{
  "tmdbId": 27205,
  "mediaType": "MOVIE"
}
```

Zwraca `200 OK` i zaktualizowaną listę. Ponowne dodanie tej samej produkcji nie tworzy duplikatu.

**7. DELETE `/api/lists/{id}/items`** – usunięcie produkcji z własnej listy.

Body takie samo jak przy dodawaniu. Zwraca `200 OK` i zaktualizowaną listę.

### Przykładowa odpowiedź API

```json
{
  "id": 1,
  "userId": 2,
  "name": "Ulubione filmy",
  "description": "Moje ulubione produkcje",
  "visibility": "PUBLIC",
  "createdAt": "2026-11-19T12:00:00Z",
  "mediaItems": [
    {
      "tmdbId": 27205,
      "mediaType": "MOVIE",
      "seasonNumber": null,
      "episodeNumber": null
    },
    {
      "tmdbId": 1396,
      "mediaType": "TV_SERIES",
      "seasonNumber": null,
      "episodeNumber": null
    }
  ]
}
```

`GET /api/lists/me` zwraca tablicę takich obiektów. Pozostałe operacje pobierania, tworzenia i edycji zwracają pojedynczy obiekt.

### Typy produkcji

- `MOVIE` – film.
- `TV_SERIES` – serial.
- `SEASON` – sezon (`tmdbId` serialu + `seasonNumber`).
- `EPISODE` – odcinek (`tmdbId` serialu + `seasonNumber` + `episodeNumber`).

Dla filmu i całego serialu numery sezonu i odcinka można pominąć.

### Statusy błędów

- `400` – nieprawidłowe dane.
- `401` – brak zalogowania przy operacji wymagającej autoryzacji.
- `403` – próba odczytu prywatnej listy lub modyfikacji cudzej listy.
- `404` – lista nie istnieje lub usuwanej produkcji nie ma na liście.

**Ważne:** do wyświetlania szczegółów produkcji frontend korzysta z istniejących endpointów TMDB (`/api/movies/...`, `/api/series/...`). API list zwraca referencje do produkcji, nie pełne dane o nich.