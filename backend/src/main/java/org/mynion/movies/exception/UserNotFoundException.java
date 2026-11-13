package org.mynion.movies.exception;

public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException() {
        super("Nie znaleziono użytkownika.");
    }
}