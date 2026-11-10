package org.mynion.movies.exception;

public class RatingAlreadyExistsException extends RuntimeException {

    public RatingAlreadyExistsException() {
        super("Użytkownik już ocenił tę produkcję");
    }
}