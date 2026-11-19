package org.mynion.movies.exception;

public class MediaListNotFoundException extends RuntimeException {
    public MediaListNotFoundException() {
        super("Nie znaleziono listy.");
    }
}