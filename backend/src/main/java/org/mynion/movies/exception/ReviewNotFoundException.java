package org.mynion.movies.exception;

public class ReviewNotFoundException extends RuntimeException {

    public ReviewNotFoundException() {
        super("Nie znaleziono recenzji.");
    }
}