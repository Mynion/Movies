package org.mynion.movies.exception;

public class InvalidMediaItemException extends RuntimeException {

    public InvalidMediaItemException(String message) {
        super(message);
    }
}