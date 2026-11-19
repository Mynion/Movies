package org.mynion.movies.exception;

public class WatchHistoryAccessDeniedException extends RuntimeException {

    public WatchHistoryAccessDeniedException() {
        super("Nie masz uprawnień do tego wpisu historii oglądania.");
    }
}