# Backend

Backend aplikacji oparty na Spring Boot i PostgreSQL.

## Wymagania
- Java 17
- PostgreSQL

## Konfiguracja bazy danych

1. Zainstaluj i uruchom PostgreSQL.
2. Utwórz bazę danych.
3. Wykonaj skrypt SQL z [`database/movies_database_schema.sql`](backend/database/movies_database_schema.sql), aby utworzyć wymagane tabele.

## Konfiguracja połączenia

Dane połączenia można ustawić w zmiennych środowiskowych:

- `DB_URL` – adres bazy danych
- `DB_USERNAME` – użytkownik bazy danych
- `DB_PASSWORD` – hasło do bazy danych

Alternatywnie można skonfigurować połączenie w pliku `src/main/resources/application.properties`.

## Uruchomienie backendu

W katalogu `backend/` uruchom:

**Windows:**
```powershell
.\mvnw.cmd spring-boot:run
```

**Linux / macOS:**
```bash
./mvnw spring-boot:run
```

Backend będzie dostępny domyślnie na porcie `8080`.
