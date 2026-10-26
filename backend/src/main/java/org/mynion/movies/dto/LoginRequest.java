package org.mynion.movies.dto;

public record LoginRequest(
        String username,
        String password
) {}
