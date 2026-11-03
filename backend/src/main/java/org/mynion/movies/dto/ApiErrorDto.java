package org.mynion.movies.dto;

public record ApiErrorDto(
        int status,
        String message
) {}