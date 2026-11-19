package org.mynion.movies.exception;

public class MediaListAccessDeniedException extends RuntimeException {
    public MediaListAccessDeniedException() {
        super("Nie masz dostępu do tej listy.");
    }
}