package org.mynion.movies.exception;

public class RatingAccessDeniedException extends RuntimeException {

    public RatingAccessDeniedException() {
        super("Nie masz uprawnień do edycji tej oceny.");
    }
}