package org.mynion.movies.exception;

public class ReviewAccessDeniedException extends RuntimeException {

    public ReviewAccessDeniedException() {
        super("Nie masz uprawnień do tej recenzji.");
    }
}