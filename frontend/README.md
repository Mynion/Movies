# Jak odpalić:

```npm ci``` Instalacja zależności

Utwórz plik .env

```npm run dev``` Odpalenie

# Endpointy do dodania:

## TMDB

- GET /api/movies/search?query= Wyszukiwanie Filmu
- GET /api/movies/{id} Szczegóły Filmu
- GET /api/series/search?query= Wyszukiwanie seriali
- GET /api/series/{id} Szczegóły serialu
- POST api/ratings Dodawanie oceny
- GET /api/ratings/{id} Ocena

## Logowanie

- POST /api/auth/login Logowanie
- POST /api/auth/register Rejestracja 
- POST /api/auth/logout Wylogowanie