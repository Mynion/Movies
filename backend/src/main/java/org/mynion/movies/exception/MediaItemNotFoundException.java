package org.mynion.movies.exception;

public class MediaItemNotFoundException extends RuntimeException {
    public MediaItemNotFoundException() {
        super("Nie znaleziono produkcji na liście.");
    }
}