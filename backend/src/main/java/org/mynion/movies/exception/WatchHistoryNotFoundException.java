package org.mynion.movies.exception;

public class WatchHistoryNotFoundException extends RuntimeException {

    public WatchHistoryNotFoundException() {
        super("Nie znaleziono wpisu historii oglądania.");
    }
}