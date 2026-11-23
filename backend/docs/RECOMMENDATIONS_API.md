**API – rekomendowane i podobne filmy oraz seriale**

Dodane zostały 4 publiczne endpointy (nie wymagają logowania).

**1. GET `/api/movies/{id}/recommendations`**

Zwraca rekomendowane filmy na podstawie wskazanego filmu.

Przykład:
`/api/movies/157336/recommendations`

**2. GET `/api/movies/{id}/similar`**

Zwraca filmy podobne do wskazanego filmu.

Przykład:
`/api/movies/157336/similar`

**3. GET `/api/series/{id}/recommendations`**

Zwraca rekomendowane seriale na podstawie wskazanego serialu.

Przykład:
`/api/series/1396/recommendations`

**4. GET `/api/series/{id}/similar`**

Zwraca seriale podobne do wskazanego serialu.

Przykład:
`/api/series/1396/similar`

**Parametry:**
- `id` – identyfikator produkcji w TMDB.
- `page` – opcjonalny numer strony, domyślnie `1`.

Przykład z paginacją:
`/api/movies/157336/similar?page=2`

**Format odpowiedzi**

Taki sam jak przy wyszukiwaniu filmów i seriali (`MovieSearchResponseDto` i odpowiedni DTO seriali).

```json
{
  "page": 1,
  "results": [
    {
      "id": 123,
      "title": "Przykładowy film",
      "overview": "Opis produkcji",
      "poster_path": "/example.jpg"
    }
  ],
  "total_pages": 5,
  "total_results": 100
}
```

Przykład jest poglądowy. Dla seriali pola odpowiadają strukturze DTO wyszukiwania seriali.

**Dodatkowe informacje:**
- Wszystkie endpointy zwracają `200 OK` przy poprawnym żądaniu.
- `page` i `id` muszą być większe od zera.
- Wyniki pochodzą z TMDB, z ustawionym językiem `pl-PL`.
- `/recommendations` służy do sekcji „Może Ci się spodobać”.
- `/similar` służy do sekcji „Podobne produkcje”.
- Rekomendacje nie są personalizowane na podstawie ocen zalogowanego użytkownika.