package org.mynion.movies.exception;

public class ReviewAlreadyExistsException extends RuntimeException {

    public ReviewAlreadyExistsException() {
        super("Użytkownik już dodał recenzję tej produkcji.");
    }
}