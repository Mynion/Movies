package org.mynion.movies.exception;

public class RatingNotFoundException extends RuntimeException {

    public RatingNotFoundException() {
        super("Nie znaleziono wskazanej oceny.");
    }
}